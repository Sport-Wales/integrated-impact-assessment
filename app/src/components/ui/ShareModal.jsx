import { useState, useEffect } from 'react';
import { apiService, PERMISSION_ROLE } from '../../services/api';

const ShareModal = ({ assessmentId, onClose }) => {
  const [permissions, setPermissions] = useState([]);
  const [email, setEmail]             = useState('');
  const [role, setRole]               = useState(PERMISSION_ROLE.VIEW);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [adding, setAdding]           = useState(false);

  // Fetch current permissions when modal opens
  useEffect(() => {
    const fetchPerms = async () => {
      try {
        const data = await apiService.getPermissions(assessmentId);
        setPermissions(data);
      } catch (err) {
        setError('Could not load current permissions.');
      } finally {
        setLoading(false);
      }
    };
    fetchPerms();
  }, [assessmentId]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleAdd = async () => {
    if (!email.trim()) return;
    // Prevent adding the same email twice
    if (permissions.some(p => p.user_email === email.trim())) {
      setError('This person already has access.');
      return;
    }
    setAdding(true);
    setError(null);
    try {
      await apiService.shareAssessment(assessmentId, email.trim(), role);
      setPermissions(prev => [
        ...prev,
        { user_email: email.trim(), role, granted_at: new Date().toISOString() }
      ]);
      setEmail('');
    } catch (err) {
      setError('Could not add access. Please check the email address.');
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (userEmail) => {
    setError(null);
    try {
      await apiService.removeShare(assessmentId, userEmail);
      setPermissions(prev => prev.filter(p => p.user_email !== userEmail));
    } catch (err) {
      setError('Could not remove access. Please try again.');
    }
  };

  const roleLabel = (r) => r === PERMISSION_ROLE.EDIT ? 'Can edit' : 'View only';

  return (
    /* Backdrop — click outside to close */
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal panel — stop propagation so clicks inside don't close it */}
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">Share Assessment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Add person row */}
        <div className="flex gap-2 mb-6">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
            placeholder="colleague@sportwales.org.uk"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sw-blue"
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
            disabled={adding || !email.trim()}
            className="px-4 py-2 bg-[--color-sw-blue] text-white rounded-lg text-sm font-medium
              hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {adding ? '...' : 'Add'}
          </button>
        </div>

        {/* Current permissions list */}
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            People with access
          </p>

          {loading && (
            <p className="text-sm text-gray-500 py-2">Loading...</p>
          )}

          {!loading && permissions.length === 0 && (
            <p className="text-sm text-gray-400 py-2">Not shared with anyone yet.</p>
          )}

          {!loading && permissions.map((perm) => (
            <div
              key={perm.user_email}
              className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{perm.user_email}</p>
                <p className="text-xs text-gray-500">{roleLabel(perm.role)}</p>
              </div>
              <button
                onClick={() => handleRemove(perm.user_email)}
                className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShareModal;
