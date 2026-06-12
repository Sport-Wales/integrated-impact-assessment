// api/src/functions/listAssessments.js
// List all assessments for the current user — owned + shared.
//
// Called by: LandingPage on every page load to populate the workspace table.
// Returns: lightweight metadata array — no form_data (too heavy for a list).
//
// Each row includes user_role so LandingPage can:
//   - Show Owner/Shared badge
//   - Control which actions are available (Share/Delete only for owners)
//   - Navigate to the correct step on open
//
// UNION query:
//   First SELECT  → assessments this user owns (user_role = 'owner')
//   Second SELECT → assessments shared with this user via assessment_permissions
//                   (AND a.owner_id != $1 prevents duplicates if owner was
//                    accidentally added to permissions table)
//
// Results ordered by updated_at DESC — most recently edited first.

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('listAssessments', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    logger.setContext(context);

    const user = getUser(request);
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorised' } };
    }

    try {
      const rows = await db.query(
        `SELECT
             id, title, lead_name, form_type, status,
             created_at, updated_at, completed_at,
             signed_off_at, reviewed_at,
             'owner' AS user_role
           FROM assessments
           WHERE owner_id = $1

         UNION ALL

         SELECT
             a.id, a.title, a.lead_name, a.form_type, a.status,
             a.created_at, a.updated_at, a.completed_at,
             a.signed_off_at, a.reviewed_at,
             p.role AS user_role
           FROM assessments a
           JOIN assessment_permissions p
             ON p.assessment_id = a.id
           WHERE p.user_email = $2
             AND a.owner_id != $1

         ORDER BY updated_at DESC`,
        [user.userId, user.userEmail]
      );

      return { status: 200, jsonBody: rows };

    } catch (error) {
      logger.error('listAssessments error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to list assessments' } };
    }
  }
});
