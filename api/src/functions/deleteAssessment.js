// api/src/functions/deleteAssessment.js
// Permanently delete an assessment.
//
// Called by: LandingPage.jsx confirm delete flow.
// Allowed:   owner only — editors and viewers cannot delete
// Note:      CASCADE DELETE on assessment_permissions means all
//            permission rows are automatically removed by the DB.
//            No need to manually clean up permissions here.

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('deleteAssessment', {
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
      const raw = await request.text();
      body = JSON.parse(raw);
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON body' } };
    }

    const { assessmentId } = body;
    if (!assessmentId) {
      return { status: 400, jsonBody: { error: 'assessmentId is required' } };
    }

    try {
      // Verify exists and check ownership in one query
      const rows = await db.query(
        `SELECT owner_id FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      if (rows.length === 0) {
        // Already deleted — return success (idempotent, frontend already removed from UI)
        return { status: 200, jsonBody: { success: true } };
      }

      // Owner only
      if (rows[0].owner_id !== user.userId) {
        return { status: 403, jsonBody: { error: 'Only the owner can delete an assessment' } };
      }

      // Delete — CASCADE removes assessment_permissions rows automatically
      await db.query(
        `DELETE FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      logger.info(`Assessment deleted: ${assessmentId} by ${user.userEmail}`);
      return { status: 200, jsonBody: { success: true } };

    } catch (error) {
      logger.error('deleteAssessment error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to delete assessment' } };
    }
  }
});
