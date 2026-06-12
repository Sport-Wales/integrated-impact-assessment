const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// =============================================
// VALID STATUS VALUES — matches database schema
// Use these constants instead of raw strings to
// prevent typos across components.
// =============================================
export const ASSESSMENT_STATUS = {
  DRAFT: 'draft',
  COMPLETE: 'complete',
  SIGNED_OFF: 'signed_off',
};

// =============================================
// VALID PERMISSION ROLES — matches assessment_permissions table
// =============================================
export const PERMISSION_ROLE = {
  VIEW: 'view',
  EDIT: 'edit',
};

// =============================================
// INTERNAL: Parse and throw consistent API errors
// =============================================
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = new Error(`API Error: ${response.statusText}`);
    error.status = response.status;
    try {
      const errorData = await response.json();
      error.details = errorData;
    } catch {
      // No JSON body on this error — that's fine
    }
    throw error;
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  } else {
    return await response.text();
  }
};

// =============================================
// INTERNAL: Consistent user-facing error messages
// =============================================
const handleError = (context, error) => {
  console.error(`[API] ${context} failed:`, error);
  if (error.status === 401) throw new Error('You must be logged in to do this');
  if (error.status === 403) throw new Error('You do not have permission to do this');
  if (error.status === 404) throw new Error('Assessment not found');
  if (error.status === 500) throw new Error('Server error. Please try again.');
  // { cause } preserves the original error for debugging (stack trace, message)
  // while the user-facing message stays generic. ES2022 — supported in all target envs.
  throw new Error(`${context} failed. Check your connection.`, { cause: error });
};

// =============================================
// API SERVICE
// =============================================
// Two error-handling patterns are used deliberately:
//
// Pattern A — uses try/catch + handleError (most methods)
//   → Throws a user-friendly message. Callers surface this to the UI.
//
// Pattern B — no try/catch (saveAssessment, deleteAssessment)
//   → Throws the raw error. Callers swallow it silently because
//     localStorage is always the source of truth; DB save comes after.
//
// When adding a new method: use Pattern A unless the caller explicitly
// handles failure without showing any error to the user.
// =============================================
export const apiService = {

  // -----------------------------------------
  // CONNECTIVITY TEST
  // -----------------------------------------
  pingServer: async () => {
    try {
      const response = await fetch(`${API_BASE}/hello?name=SportWales`);
      return await handleResponse(response);
    } catch (error) {
      console.error('[API] Ping failed:', error);
      throw error;
    }
  },

  // -----------------------------------------
  // ASSESSMENT CRUD
  // -----------------------------------------

  // Save assessment — INSERT if new, UPDATE if existing.
  // Called on every step navigation (auto-save) and by the Save button.
  // formData must include assessmentId (null for new, UUID for existing).
  // Returns: { id: UUID } on success — frontend stores this as assessmentId in FormContext.
  // 
  // NOTE: This method deliberately does NOT call handleError — it throws the raw error.
  // All callers (step files, SaveButton) silently swallow the error because localStorage
  // is always the primary store. The DB save is a best-effort background sync.
  saveAssessment: async (formData) => {
    const response = await fetch(`${API_BASE}/saveAssessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    return await handleResponse(response);
  },

  // Get a single assessment by ID.
  // Returns: full assessment row including form_data JSONB.
  // Used by workspace when user clicks to open a saved assessment.
  getAssessment: async (assessmentId) => {
    try {
      const response = await fetch(`${API_BASE}/getAssessment?id=${assessmentId}`);
      return await handleResponse(response);
    } catch (error) {
      handleError('Get assessment', error);
    }
  },

  // List all assessments for the current user (owned + shared).
  // Returns: lightweight array for workspace table — no full form_data, just metadata.
  // Each item: { id, title, lead_name, form_type, status, created_at, updated_at,
  //              completed_at, signed_off_at, user_role }
  listAssessments: async () => {
    try {
      const response = await fetch(`${API_BASE}/listAssessments`);
      return await handleResponse(response);
    } catch (error) {
      handleError('List assessments', error);
    }
  },

  // -----------------------------------------
  // STATUS TRANSITIONS
  // -----------------------------------------

  // Mark assessment as complete (user has finished filling it out).
  // Backend sets: status = 'complete', completed_at = NOW()
  // Only callable by owner or editor — backend enforces this.
  completeAssessment: async (assessmentId) => {
    try {
      const response = await fetch(`${API_BASE}/completeAssessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError('Complete assessment', error);
    }
  },

  // Delete an assessment permanently.
  // Only callable by the owner — backend enforces this.
  // Frontend always removes from localStorage first; DB delete is best-effort silent.
  // Does NOT call handleError — callers swallow the error silently (same pattern as saveAssessment).
  deleteAssessment: async (assessmentId) => {
    const response = await fetch(`${API_BASE}/deleteAssessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assessmentId }),
    });
    return await handleResponse(response);
  },

  // Sign off assessment — permanently locks it as read-only.
  // Backend sets: status = 'signed_off', signed_off_at = NOW(), signed_off_by = user_id
  // Once signed off, all update requests are rejected by the backend.
  signOffAssessment: async (assessmentId) => {
    try {
      const response = await fetch(`${API_BASE}/signOffAssessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError('Sign off assessment', error);
    }
  },

  // -----------------------------------------
  // SHARING (assessment_permissions table)
  // -----------------------------------------

  // Get list of everyone who has access to an assessment.
  // Returns: array of { user_email, role, granted_at }
  // Used by the share modal to display current permissions.
  // Only the owner can call this — backend enforces this.
  getPermissions: async (assessmentId) => {
    try {
      const response = await fetch(`${API_BASE}/getPermissions?assessmentId=${assessmentId}`);
      return await handleResponse(response);
    } catch (error) {
      handleError('Get permissions', error);
    }
  },

  // Share assessment with a colleague by email.
  // role: use PERMISSION_ROLE.VIEW or PERMISSION_ROLE.EDIT
  // Inserts into assessment_permissions table.
  // Only the owner can call this — backend enforces this.
  shareAssessment: async (assessmentId, userEmail, role) => {
    try {
      const response = await fetch(`${API_BASE}/shareAssessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, userEmail, role }),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError('Share assessment', error);
    }
  },

  // Remove a colleague's access to an assessment.
  // Deletes from assessment_permissions table.
  // Only the owner can call this — backend enforces this.
  removeShare: async (assessmentId, userEmail) => {
    try {
      const response = await fetch(`${API_BASE}/removeShare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId, userEmail }),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError('Remove share', error);
    }
  },
};
