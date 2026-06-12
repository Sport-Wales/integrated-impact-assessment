// api/src/functions/removeShare.js
// Remove a colleague's access to an assessment.
//
// Called by: ShareModal.jsx on Submit (after staging pending removes).
// Deletes:   one row from assessment_permissions by (assessment_id, user_email)
// Allowed:   owner only
// Idempotent: if the row doesn't exist, return success — frontend already
//             removed the person from the displayed list.

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('removeShare', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    logger.setContext(context);

    const user = getUser(request);
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorised' } };
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON body' } };
    }

    const { assessmentId, userEmail } = body;
    if (!assessmentId || !userEmail) {
      return { status: 400, jsonBody: { error: 'assessmentId and userEmail are required' } };
    }

    try {
      // Verify assessment exists and requester is the owner
      const rows = await db.query(
        `SELECT owner_id FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      if (rows.length === 0) {
        return { status: 404, jsonBody: { error: 'Assessment not found' } };
      }

      if (rows[0].owner_id !== user.userId) {
        return { status: 403, jsonBody: { error: 'Only the owner can remove access' } };
      }

      // Delete the permission row — no error if it doesn't exist (idempotent)
      await db.query(
        `DELETE FROM assessment_permissions
         WHERE assessment_id = $1 AND user_email = $2`,
        [assessmentId, userEmail.trim().toLowerCase()]
      );

      logger.info(`Access removed: ${userEmail} from ${assessmentId} by ${user.userEmail}`);
      return { status: 200, jsonBody: { success: true } };

    } catch (error) {
      logger.error('removeShare error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to remove access' } };
    }
  }
});
