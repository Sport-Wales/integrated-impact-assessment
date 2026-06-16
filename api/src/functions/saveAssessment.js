// api/src/functions/saveAssessment.js
// INSERT new assessment or UPDATE existing one.
//
// Called by: every form step on Next, SaveButton, ShareButton (pre-save), handleTitleBlur.
// Returns:   { id: UUID } — frontend stores this as assessmentId in FormContext.
//
// INSERT path: assessmentId is null → creates new row, returns generated UUID.
// UPDATE path: assessmentId is UUID → updates existing row after permission check.
//
// Permission model:
//   owner → always allowed to update
//   edit  → allowed to update (checked via assessment_permissions)
//   view  → blocked (returns 403)
//   signed_off → all writes blocked regardless of role (returns 403)
//
// form_data stored clean — internal frontend fields (localId, userRole, etc.)
// are stripped before storage so stale state never pollutes the database.

const { app }     = require('@azure/functions');
const db          = require('../db');
const { getUser } = require('../utils/getUser');
const logger      = require('../utils/logger');

app.http('saveAssessment', {
  methods: ['POST'],
  authLevel: 'anonymous', // SWA handles auth — /api/* is blocked to unauthenticated users
  handler: async (request, context) => {
    logger.setContext(context);

    // 1. Get user identity from SWA auth header
    const user = getUser(request);
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorised' } };
    }

    // 2. Parse request body
    //    Using request.text() + JSON.parse() instead of request.json()
    //    because Azure SWA proxy can deliver the body in a format that
    //    request.json() cannot read reliably.
    let body;
    try {
      const raw = await request.text();
      body = JSON.parse(raw);
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON body' } };
    }

    // 3. Extract DB-level and internal frontend fields.
    //    These are stored as dedicated columns or are frontend-only —
    //    they must NOT be stored inside the form_data JSONB column.
    //    cleanFormData contains only the actual form answers.
    const {
      assessmentId,
      localId:      _l,   // frontend localStorage key — not stored in DB
      userRole:     _ur,  // computed by DB query — not stored in DB
      createdAt:    _ca,  // DB manages created_at column — not stored in form_data
      lastSavedAt:  _ls,  // frontend-only timestamp — not stored in DB
      formType:     _ft,  // stored as form_type column — not stored in form_data
      title       = '',
      leadName    = '',
      status,
      completedSteps,
      reviewedAt,         // set by Step10/Form2Step4 — maps to reviewed_at column
      // Strip these extra fields that come from DB responses — never store back into form_data
      id:           _id,
      form_type:    _ftype,
      lead_name:    _ln,
      created_at:   _cat,
      updated_at:   _uat,
      completed_at: _coat,
      signed_off_at:_soat,
      signed_off_by:_sob,
      reviewed_at:  _rat,
      user_role:    _urol,
      form_data:    _fd,
      completed_steps: _cs,
      ...cleanFormData    // everything else — the actual form field answers
    } = body;


    // formType is required — never silently default to form1
    if (!_ft) {
      return { status: 400, jsonBody: { error: 'formType is required' } };
    }

    try {
      // ============================================================
      // INSERT — new assessment (no assessmentId yet)
      // ============================================================
      if (!assessmentId) {
        const rows = await db.query(
          `INSERT INTO assessments
             (owner_id, owner_email, form_type, title, lead_name, status, form_data, completed_steps)
           VALUES ($1, $2, $3, $4, $5, 'draft', $6, $7)
           RETURNING id`,
          [
            user.userId,
            user.userEmail,
            _ft,
            title.trim(),
            leadName.trim(),
            JSON.stringify(cleanFormData),
            JSON.stringify(completedSteps || {}),
          ]
        );
        logger.info(`Assessment created: ${rows[0].id} by ${user.userEmail}`);
        return { status: 200, jsonBody: { id: rows[0].id } };
      }

      // ============================================================
      // UPDATE — existing assessment
      // ============================================================

      // Fetch current state — need owner_id and status before proceeding
      const existing = await db.query(
        `SELECT owner_id, status FROM assessments WHERE id = $1`,
        [assessmentId]
      );

      if (existing.length === 0) {
        return { status: 404, jsonBody: { error: 'Assessment not found' } };
      }


      // Block all writes to signed-off assessments — permanently locked
      if (existing[0].status === 'signed_off') {
        return { status: 403, jsonBody: { error: 'Assessment is signed off and cannot be edited' } };
      }

      // Check permission: owner bypasses permissions table,
      // edit role is allowed, view role is blocked
      const isOwner = existing[0].owner_id === user.userId;
      if (!isOwner) {
        const perm = await db.query(
          `SELECT role FROM assessment_permissions
           WHERE assessment_id = $1 AND user_email = $2`,
          [assessmentId, user.userEmail]
        );
        if (perm.length === 0 || perm[0].role === 'view') {
          return { status: 403, jsonBody: { error: 'You do not have permission to edit this assessment' } };
        }
      }

      // Status forward-only guard — prevents accidental downgrade (e.g. complete → draft).
      // COALESCE handles null (no status sent). CASE handles forward-only logic.
      // reviewed_at only updates when Step10/Form2Step4 include reviewedAt.
      await db.query(
        `UPDATE assessments SET
           title           = $1,
           lead_name       = $2,
           form_data       = $3,
           completed_steps = $4,
           status          = CASE
                               WHEN $5 IS NULL THEN status
                               WHEN status = 'signed_off' THEN status
                               WHEN status = 'complete' AND $5 = 'draft' THEN status
                               ELSE $5
                             END,
           reviewed_at     = COALESCE($6, reviewed_at)
         WHERE id = $7`,
        [
          title.trim(),
          leadName.trim(),
          JSON.stringify(cleanFormData),
          JSON.stringify(completedSteps || {}),
          status     || null,
          reviewedAt || null,
          assessmentId,
        ]
      );

      logger.info(`Assessment updated: ${assessmentId} by ${user.userEmail}`);
      return { status: 200, jsonBody: { id: assessmentId } };

    } catch (error) {
      logger.error('saveAssessment error:', error.message);
      return { status: 500, jsonBody: { error: 'Failed to save assessment', detail: error.message } };
    }
  }
});
