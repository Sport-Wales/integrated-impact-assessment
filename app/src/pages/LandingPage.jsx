// src/pages/LandingPage.jsx
// The main home page — shows all of the user's assessments in a simple table.
// Users start new assessments or open existing ones from here.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';
import { apiService, ASSESSMENT_STATUS } from '../services/api';
import ShareModal from '../components/ui/ShareModal';

const LandingPage = () => {
  const navigate = useNavigate();
  const { formData, resetFormData, loadAssessment, deleteLocalAssessment } = useFormContext();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openingId, setOpeningId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [shareModalId, setShareModalId] = useState(null); // assessment id currently open in share modal

  // Fetch all assessments for this user on mount
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await apiService.listAssessments();
        setAssessments(data || []);
      } catch (err) {
        // Distinguish between different error types for better UX
        if (err.status === 401) {
          setError('You are not logged in. Please log in to see your assessments.');
        } else if (err.status === 403) {
          setError('You do not have permission to access assessments.');
        } else {
          // Backend not connected yet (network error / 404 / 500).
          // Fall back to whatever is currently in localStorage so the user can
          // still see and reopen their in-progress work without the backend.
          console.warn('[Workspace] Backend not available. Falling back to localStorage.');
          buildLocalStorageFallback();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  // Build display rows from ALL assessments currently in localStorage.
  // Reads from the new multi-assessment store (iia_assessments).
  // Each stored assessment becomes one row in the table.
  // Only includes entries where formType is set (real in-progress forms).
  const buildLocalStorageFallback = () => {
    let store = {};
    try {
      const raw = localStorage.getItem('iia_assessments');
      store = raw ? JSON.parse(raw) : {};
    } catch {
      // Corrupted localStorage — nothing to show
    }

    const rows = Object.values(store)
      .filter(local => !!local?.formType && !!local?.title?.trim())
      .map(local => ({
        id:           local.assessmentId || local.localId,
        title:        local.title     || '',
        form_type:    local.formType,
        status:       local.status    || 'draft',
        user_role:    local.userRole  || 'owner',
        created_at:   local.createdAt   || null,   // set by resetFormData on creation
        updated_at:   local.lastSavedAt || null,   // updated by writeAssessmentToStore on every save
        completed_at:  (local.status === 'complete' || local.status === 'signed_off') ? (local.lastSavedAt || true) : null,
        signed_off_at: local.status === 'signed_off' ? (local.lastSavedAt || true) : null,
        reviewed_at:   local.reviewedAt || null,
        _isLocalOnly:  true,
        _localId:      local.localId,
      }));

    setAssessments(rows);
  };

  // Start a brand-new assessment — clears any in-progress form data
  const handleStartNew = () => {
    resetFormData();
    navigate('/intro');
  };



  // Open an existing assessment — loads it into FormContext then navigates.
  // Optional destination param lets the Review column navigate to a specific step
  // without changing the default behaviour for every other row click.
  const handleOpenAssessment = async (assessment, destination = null) => {
    const { id, form_type, status, _isLocalOnly, _localId } = assessment;

    // Determine default destination based on status if none explicitly provided
    const defaultDest = (status === ASSESSMENT_STATUS.COMPLETE || status === ASSESSMENT_STATUS.SIGNED_OFF)
      ? (form_type === 'form1' ? '/form1/step9' : '/form2/step3')
      : (form_type === 'form1' ? '/form1/step1' : '/form2/step1');
    const target = destination || defaultDest;

    // Local-only row: load the specific assessment from the store into FormContext,
    // then navigate. We must explicitly load it in case another form was active.
    if (_isLocalOnly) {
      try {
        const raw = localStorage.getItem('iia_assessments');
        const store = raw ? JSON.parse(raw) : {};
        const localData = store[_localId];
        if (localData) {
          loadAssessment({
            id:        localData.assessmentId || _localId,
            form_data: localData,
            form_type: localData.formType,
            status:    localData.status || 'draft',
            user_role: localData.userRole || 'owner',
          });
        }
      } catch {
        // Corrupted entry — navigate anyway, FormContext already has something loaded
      }
      navigate(target);
      return;
    }

    // DB-backed row: fetch full form_data from backend and load into FormContext
    setOpeningId(id);
    try {
      const data = await apiService.getAssessment(id);
      loadAssessment(data);
      navigate(target);
    } catch (err) {
      setError('Could not open that assessment. Please try again.');
    } finally {
      setOpeningId(null);
    }
  };

  // Delete an assessment — removes from localStorage immediately, then attempts DB delete silently.
  // Only owners can delete; signed-off assessments cannot be deleted (UI enforces this).
  const handleDelete = async (assessment) => {
    // Resolve the localStorage key: for DB-backed rows localId === assessmentId (UUID);
    // for local-only rows _localId holds the local_ prefixed key.
    const localId = assessment._localId || assessment.id;
    const dbId    = assessment._isLocalOnly ? null : assessment.id;

    // 1. Remove from localStorage and reset FormContext if this was the active form
    deleteLocalAssessment(localId);

    // 2. Remove from the table immediately — instant feedback, no waiting
    setAssessments(prev => prev.filter(a => a.id !== assessment.id));
    setConfirmDeleteId(null);

    // 3. Attempt DB delete silently in background — failure is fine, data already cleared locally
    if (dbId) {
      try {
        await apiService.deleteAssessment(dbId);
      } catch (err) {
        console.warn('[Delete] DB delete failed (backend not available). Local data already removed.', err.message);
      }
    }
  };

  // Format ISO date string to UK date format (DD/MM/YYYY)
  const formatDate = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-GB');
  };

  const formTypeLabel = (type) => type === 'form1' ? 'Full IIA' : 'Short IIA';

  // ===== RENDER =====
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Page header with IIA intro text and Start button */}
      <div className="mb-8">
        <h2 className="sw-heading-primary text-3xl font-bold mb-3">
          Integrated Impact Assessments (IIA)
        </h2>
        <p className="text-gray-600 mb-6">
          Integrated Impact Assessments are a tool to help make sure our work supports as many people as possible.
        </p>
        <button
          onClick={handleStartNew}
          className="inline-flex items-center px-5 py-2 rounded-md text-sm bg-[--color-sw-blue] text-white font-medium hover:bg-cyan-700 transition-colors duration-200"
        >
          <span className="text-xl mr-2">+</span> Start New Assessment
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Loading your assessments...</p>
        </div>
      )}

      {/* Empty state — no assessments yet */}
      {!loading && !error && assessments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-100">
          <p className="text-gray-500 text-lg mb-4">You have no assessments yet.</p>

        </div>
      )}

      {/* Assessments table */}
      {!loading && assessments.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Created</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Last Edited</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Role</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Complete</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Sign Off</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Review</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assessments.map((assessment) => (
                <tr
                  key={assessment.id}
                  onClick={() => handleOpenAssessment(assessment)}
                  className="cursor-pointer hover:bg-blue-50 transition-colors duration-150"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {openingId === assessment.id ? (
                      <span className="text-gray-400">Opening...</span>
                    ) : (
                      assessment.title || <span className="text-gray-400 italic">Untitled</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formTypeLabel(assessment.form_type)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(assessment.created_at)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(assessment.updated_at)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      assessment.user_role === 'owner'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {assessment.user_role === 'owner' ? 'Owner' : 'Shared'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {assessment.completed_at
                      ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {assessment.signed_off_at
                      ? <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500"><svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></span>
                      : <span className="text-gray-300">—</span>}
                  </td>

                  {/* Review column — blank until signed off, then clickable "Review" in SW Blue,
                      then "Reviewed" in SW Green once the review step has been completed */}
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    {!assessment.signed_off_at ? (
                      <span className="text-gray-300">—</span>
                    ) : assessment.reviewed_at ? (
                      <span className="text-xs font-semibold" style={{ color: 'var(--color-sw-green)' }}>
                        Reviewed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenAssessment(
                          assessment,
                          assessment.form_type === 'form1' ? '/form1/step10' : '/form2/step4'
                        )}
                        className="text-xs font-semibold hover:underline transition-colors"
                        style={{ color: 'var(--color-sw-blue)' }}
                      >
                        Review
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    {assessment.user_role === 'owner' && !assessment.signed_off_at ? (
                      <div className="flex items-center justify-center gap-3">

                        {/* Share button — only shown for DB-backed assessments (real UUID) */}
                        {!assessment.id?.startsWith('local_') && (
                          <button
                            onClick={() => setShareModalId(assessment.id)}
                            className="text-xs text-[--color-sw-blue] hover:text-cyan-700 font-medium transition-colors"
                          >
                            Share
                          </button>
                        )}

                        {/* Delete — confirm/cancel inline, or default delete link */}
                        {confirmDeleteId === assessment.id ? (
                          <span className="flex items-center gap-1 text-xs">
                            <button
                              onClick={() => handleDelete(assessment)}
                              className="text-red-600 font-semibold hover:text-red-800"
                            >
                              Confirm
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(assessment.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        )}

                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Share modal — rendered at page level so it sits above the table */}
      {shareModalId && (
        <ShareModal
          assessmentId={shareModalId}
          onClose={() => setShareModalId(null)}
        />
      )}
    </div>
  );
};

export default LandingPage;
