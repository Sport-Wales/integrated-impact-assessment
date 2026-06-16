// api/src/functions/shareAssessment.js
// Share an assessment with a colleague by granting them a permission role.
//
// Called by: ShareModal.jsx on Submit (after staging pending adds).
// Allowed:   owner only
// Uses UPSERT — if the person already has a permission row, their role
// is updated (e.g. view → edit). This handles role changes cleanly.
//
// Validation:
//   - assessmentId, userEmail, role all required
//   - role must be 'view' or 'edit'
//   - userEmail must end in @sport.wales
//   - Cannot share with yourself (the owner)

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('shareAssessment', {
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

    const { assessmentId, userEmail, role } = body;

    if (!assessmentId || !userEmail || !role) {
      return { status: 400, jsonBody: { error: 'assessmentId, userEmail, and role are required' } };
    }

    if (!['view', 'edit'].includes(role)) {
      return { status: 400, jsonBody: { error: 'role must be view or edit' } };
    }

    // Backend email validation — defence in depth beyond the frontend check
    if (!/^[^\s@]+@sport\.wales$/i.test(userEmail.trim())) {
      return { status: 400, jsonBody: { error: 'Only Sport Wales accounts can be granted access' } };
    }

    try {
      const rows = await db.query(
        `SELECT owner_id, owner_email FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      if (rows.length === 0) {
        return { status: 404, jsonBody: { error: 'Assessment not found' } };
      }

      // Owner only
      if (rows[0].owner_id !== user.userId) {
        return { status: 403, jsonBody: { error: 'Only the owner can share this assessment' } };
      }

      // Cannot share with yourself
      if (userEmail.trim().toLowerCase() === rows[0].owner_email.toLowerCase()) {
        return { status: 400, jsonBody: { error: 'You cannot share an assessment with yourself' } };
      }

      // UPSERT — insert new row or update role if person already has access
      await db.query(
        `INSERT INTO assessment_permissions (assessment_id, user_email, role)
         VALUES ($1, $2, $3)
         ON CONFLICT (assessment_id, user_email)
         DO UPDATE SET role = EXCLUDED.role`,
        [assessmentId, userEmail.trim().toLowerCase(), role]
      );

      logger.info(`Assessment ${assessmentId} shared with ${userEmail} (${role}) by ${user.userEmail}`);
      return { status: 200, jsonBody: { success: true } };

    } catch (error) {
      logger.error('shareAssessment error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to share assessment' } };
    }
  }
});
