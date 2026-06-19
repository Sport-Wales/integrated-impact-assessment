// api/src/functions/getAssessment.js
// Fetch a single assessment by ID including full form_data.
//
// Called by: LandingPage when user clicks to open a DB-backed assessment row.
// Returns: full assessment row — form_data JSONB + user_role for FormContext.
//
// user_role is computed here:
//   'owner' → requesting user is the assessment owner
//   'edit'  → requesting user has edit permission in assessment_permissions
//   'view'  → requesting user has view permission in assessment_permissions
//
// Access control: only the owner or a user with a permission row can fetch.
// Returns 403 with the assessment title if the user has no access (so the
// frontend can show "you don't have access to X"). Returns 404 only when
// the assessment genuinely doesn't exist.

const { app }          = require('@azure/functions');
const db               = require('../db');
const { getUser }      = require('../utils/getUser');
const { isSuperUser }  = require('../utils/superusers');
const logger           = require('../utils/logger');

app.http('getAssessment', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    logger.setContext(context);

    const user = getUser(request);
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorised' } };
    }

    const assessmentId = request.query.get('id');
    if (!assessmentId) {
      return { status: 400, jsonBody: { error: 'Assessment ID is required' } };
    }

    try {
      // Step 1: Does this assessment exist at all? (PK index lookup, ~1ms)
      const exists = await db.query(
        'SELECT title FROM assessments WHERE id = $1',
        [assessmentId]
      );

      if (exists.length === 0) {
        return { status: 404, jsonBody: { error: 'Assessment not found' } };
      }

      // Step 2: Does this user have access? (full permission-checked query)
      const rows = await db.query(
        `SELECT
           a.id, a.form_type, a.title, a.lead_name, a.status,
           a.form_data, a.completed_steps,
           a.created_at, a.updated_at, a.completed_at,
           a.signed_off_at, a.signed_off_by, a.reviewed_at,
           CASE
             WHEN a.owner_id = $2 THEN 'owner'
             ELSE p.role
           END AS user_role
         FROM assessments a
         LEFT JOIN assessment_permissions p
           ON p.assessment_id = a.id AND p.user_email = $3
         WHERE a.id = $1
           AND (a.owner_id = $2 OR p.user_email = $3)`,
        [assessmentId, user.userId, user.userEmail]
      );

      if (rows.length === 0) {
        // No ownership or permission row — check superuser before denying.
        if (isSuperUser(user.userEmail)) {
          // Superuser gets full read access with 'view' role.
          // Re-fetch without permission filter — assessment existence already confirmed above.
          const superRows = await db.query(
            `SELECT
               a.id, a.form_type, a.title, a.lead_name, a.status,
               a.form_data, a.completed_steps,
               a.created_at, a.updated_at, a.completed_at,
               a.signed_off_at, a.signed_off_by, a.reviewed_at,
               'view' AS user_role
             FROM assessments a
             WHERE a.id = $1`,
            [assessmentId]
          );
          const row = superRows[0];
          row.form_data = {
            ...row.form_data,
            completedSteps: row.completed_steps || { form1: [], form2: [] },
          };
          return { status: 200, jsonBody: row };
        }

        // Not a superuser — access denied with title for the frontend popup.
        return { status: 403, jsonBody: {
          error: 'You do not have access to this assessment',
          title: exists[0].title || 'this assessment'
        }};
      }

      // Merge completed_steps into form_data before returning.
      // FormContext.loadAssessment reads completedSteps from form_data:
      //   completedSteps: dbResponse.form_data?.completedSteps || { form1: [], form2: [] }
      // completed_steps is stored as a separate column for query efficiency but
      // must be injected back into form_data so the progress bar loads correctly.
      const row = rows[0];
      row.form_data = {
        ...row.form_data,
        completedSteps: row.completed_steps || { form1: [], form2: [] },
      };

      return { status: 200, jsonBody: row };

    } catch (error) {
      logger.error('getAssessment error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to get assessment' } };
    }
  }
});
