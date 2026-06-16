// api/src/functions/signOffAssessment.js
// Permanently sign off an assessment — locks it as read-only forever.
//
// Called by: AssessmentDocument.jsx Sign Off button.
// Sets:      status = 'signed_off', signed_off_at = NOW(), signed_off_by = userId
// Allowed:   owner only — editors cannot permanently lock an assessment
// Guards:    already signed off → 403 (idempotency — safe to call twice)
//            draft → 403 (must be complete before signing off)

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('signOffAssessment', {
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
      const rows = await db.query(
        `SELECT owner_id, status FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      if (rows.length === 0) {
        return { status: 404, jsonBody: { error: 'Assessment not found' } };
      }

      const { owner_id, status } = rows[0];

      // Owner only — editors cannot sign off
      if (owner_id !== user.userId) {
        return { status: 403, jsonBody: { error: 'Only the owner can sign off an assessment' } };
      }

      // Must be complete before signing off
      if (status === 'draft') {
        return { status: 403, jsonBody: { error: 'Assessment must be complete before signing off' } };
      }

      // Already signed off — return success (idempotent)
      if (status === 'signed_off') {
        return { status: 200, jsonBody: { success: true } };
      }

      await db.query(
        `UPDATE assessments
         SET status = 'signed_off', signed_off_at = NOW(), signed_off_by = $1
         WHERE id = $2`,
        [user.userId, assessmentId]
      );

      logger.info(`Assessment signed off: ${assessmentId} by ${user.userEmail}`);
      return { status: 200, jsonBody: { success: true } };

    } catch (error) {
      logger.error('signOffAssessment error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to sign off assessment' } };
    }
  }
});
