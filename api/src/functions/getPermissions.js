// api/src/functions/getPermissions.js
// Get all permissions for an assessment.
//
// Called by: ShareModal.jsx on open to display current access list.
// Returns:   array of { user_email, role, granted_at }
// Allowed:   owner only

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('getPermissions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    logger.setContext(context);

    const user = getUser(request);
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorised' } };
    }

    const assessmentId = request.query.get('assessmentId');
    if (!assessmentId) {
      return { status: 400, jsonBody: { error: 'assessmentId is required' } };
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
        return { status: 403, jsonBody: { error: 'Only the owner can view permissions' } };
      }

      // Return all permission rows for this assessment
      const perms = await db.query(
        `SELECT user_email, role, granted_at
         FROM assessment_permissions
         WHERE assessment_id = $1
         ORDER BY granted_at ASC`,
        [assessmentId]
      );

      return { status: 200, jsonBody: perms };

    } catch (error) {
      logger.error('getPermissions error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to get permissions' } };
    }
  }
});
