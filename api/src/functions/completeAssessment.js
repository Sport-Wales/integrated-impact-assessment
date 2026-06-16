// api/src/functions/completeAssessment.js
// Mark an assessment as complete.
//
// Called by: Step8.jsx and Form2/Step2.jsx after "Mark as Complete".
// Sets:      status = 'complete', completed_at = NOW()
// Allowed:   owner or editor (not view-only, not already signed off)

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('completeAssessment', {
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
      // Fetch assessment — verify exists and get owner + status
      const rows = await db.query(
        `SELECT owner_id, status FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      if (rows.length === 0) {
        return { status: 404, jsonBody: { error: 'Assessment not found' } };
      }

      const { owner_id, status } = rows[0];

      // Already signed off — cannot transition back or re-complete
      if (status === 'signed_off') {
        return { status: 403, jsonBody: { error: 'Assessment is signed off and cannot be modified' } };
      }

      // Check permission — owner always allowed, editor allowed, view blocked
      const isOwner = owner_id === user.userId;
      if (!isOwner) {
        const perm = await db.query(
          `SELECT role FROM assessment_permissions
           WHERE assessment_id = $1 AND user_email = $2`,
          [assessmentId, user.userEmail]
        );
        if (perm.length === 0 || perm[0].role === 'view') {
          return { status: 403, jsonBody: { error: 'You do not have permission to complete this assessment' } };
        }
      }

      await db.query(
        `UPDATE assessments
         SET status = 'complete', completed_at = NOW()
         WHERE id = $1`,
        [assessmentId]
      );

      logger.info(`Assessment completed: ${assessmentId} by ${user.userEmail}`);
      return { status: 200, jsonBody: { success: true } };

    } catch (error) {
      logger.error('completeAssessment error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to complete assessment' } };
    }
  }
});
