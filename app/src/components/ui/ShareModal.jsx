import { useState, useEffect } from 'react';
import { apiService, PERMISSION_ROLE } from '../../services/api';

// =============================================
// HELPERS
// =============================================

// Only accept @sport.wales email addresses
const isValidSwEmail = (val) => /^[^\s@]+@sport\.wales$/i.test(val.trim());

const roleLabel = (r) => r === PERMISSION_ROLE.EDIT ? 'Edit' : 'View only';

// =============================================
// COMPONENT
// =============================================

const ShareModal = ({ assessmentId, onClose, shareUrl = null }) => {

  // --- committed state (from DB) ---
  const [permissions, setPermissions]       = useState([]);
  const [loading, setLoading]               = useState(true);

  // --- pending (staged, not yet submitted) ---
  const [pendingAdds, setPendingAdds]       = useState([]);
  const [pendingRemoves, setPendingRemoves] = useState([]);

  // --- input row ---
  const [email, setEmail]                   = useState('');
  const [role, setRole]                     = useState(PERMISSION_ROLE.VIEW);

  // --- async/feedback ---
  const [error, setError]                   = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const [copied, setCopied]                 = useState(false);

  // Derived: combined view of what will exist after Submit
  const visibleCommitted = permissions.filter(p => !pendingRemoves.includes(p.user_email));
  const displayList      = [...visibleCommitted, ...pendingAdds];
  const hasChanges       = pendingAdds.length > 0 || pendingRemoves.length > 0;

  // ---- fetch committed permissions on open ----
  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const data = await apiService.getPermissions(assessmentId);
        setPermissions(data || []);
      } catch {
        setError('Could not load current permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPerms();
  }, [assessmentId]);

  // ---- Escape key: only close if no unsaved changes ----
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !hasChanges) onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, hasChanges]);

  // ---- Add: validate and stage locally — NO API call yet ----
  const handleAdd = () => {
    const trimmed = email.trim();
    if (!trimmed) return;

    if (!isValidSwEmail(trimmed)) {
      setError('Only Sport Wales accounts can have access.');
      return;
    }

    const alreadyExists =
      permissions.some(p => p.user_email === trimmed) ||
      pendingAdds.some(p => p.user_email === trimmed);

    if (alreadyExists) {
      setError('This person already has access.');
      return;
    }

    setPendingAdds(prev => [...prev, { user_email: trimmed, role }]);
    setEmail('');
    setError(null);
  };

  // ---- Remove: stage locally — NO API call yet ----
  const handleRemove = (userEmail) => {
    setError(null);
    // If it's a pending add (not yet submitted), just unstage it
    if (pendingAdds.some(p => p.user_email === userEmail)) {
      setPendingAdds(prev => prev.filter(p => p.user_email !== userEmail));
      return;
    }
    // Otherwise stage for removal on Submit
    setPendingRemoves(prev => [...prev, userEmail]);
  };

  // ---- Submit: commit all staged changes to the API ----
  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      for (const p of pendingAdds) {
        await apiService.shareAssessment(assessmentId, p.user_email, p.role);
      }
      for (const emailAddr of pendingRemoves) {
        await apiService.removeShare(assessmentId, emailAddr);
      }
      onClose();
    } catch {
      // Re-fetch current state from DB so the display is accurate after partial failure
      try {
        const fresh = await apiService.getPermissions(assessmentId);
        setPermissions(fresh || []);
        setPendingAdds([]);
        setPendingRemoves([]);
      } catch {
        // If re-fetch also fails, leave current state in place
      }
      setError('Something went wrong saving changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Copy URL to clipboard ----
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy link. Please copy the URL from your browser.');
    }
  };

  // =============================================
  // RENDER
  // =============================================
  return (
    /* Backdrop — only closes if no unsaved pending changes */
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      {/* Modal panel — stop propagation so clicks inside don't close it */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">Share Assessment</h3>
          <button
            onClick={() => { if (!submitting) onClose(); }}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 rounded text-sm text-red-700">
            ⚠  {error}
          </div>
        )}

        {/* Add person row */}
        <div className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="colleague@sport.wales"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-sw-blue"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          >
            <option value={PERMISSION_ROLE.VIEW}>View only</option>
            <option value={PERMISSION_ROLE.EDIT}>Can edit</option>
          </select>
          <button
            onClick={handleAdd}
            disabled={!email.trim()}
            className="px-4 py-2 bg-[--color-sw-blue] text-white rounded-lg text-sm font-medium
              hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
        </div>

        {/* People with access */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            People with access
          </p>

          {loading && <p className="text-sm text-gray-500 py-2">Loading...</p>}

          {!loading && displayList.length === 0 && (
            <p className="text-sm text-gray-400 py-2">Not shared with anyone yet.</p>
          )}

          {!loading && displayList.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 w-1/2">Email</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500">Access</th>
                  <th className="text-left py-2 text-xs font-semibold text-gray-500"></th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {displayList.map((perm) => {
                  const isPendingAdd = pendingAdds.some(p => p.user_email === perm.user_email);
                  return (
                    <tr key={perm.user_email} className="align-middle">
                      <td className="py-2 pr-4 font-medium text-gray-800">{perm.user_email}</td>
                      <td className="py-2 pr-2 text-gray-500">{roleLabel(perm.role)}</td>
                      <td className="py-2 pr-2">
                        {isPendingAdd && (
                          <span className="text-xs font-medium">Pending</span>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => handleRemove(perm.user_email)}
                          className="text-xs text-red-500 hover:text-red-800 font-medium transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Bottom actions — Copy link + Save permissions */}
        <div className="border-t border-gray-100 pt-4 mt-4 flex flex-col items-center gap-2">

          {/* Copy link — only shown when opened from a form step */}
          {shareUrl && (
            <button
              onClick={handleCopyUrl}
              className="flex items-center justify-center gap-2 px-8 py-2 w-60
                border border-gray-300 rounded-lg text-sm text-gray-700
                hover:bg-gray-50 transition-colors"
            >
              {copied ? '✓ Copied!' : '🔗 Copy link'}
            </button>
          )}

          {/* Save permissions — only active when there are staged changes */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !hasChanges}
            className="px-8 py-2 w-60 bg-[--color-sw-blue] text-white rounded-lg text-sm font-medium
              hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Saving...' : 'Save permissions'}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ShareModal;
