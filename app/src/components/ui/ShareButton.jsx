import { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';
import ShareModal from './ShareModal';

const ShareButton = ({ isOwner }) => {
  const { formData, updateFormData } = useFormContext();
  const [showModal, setShowModal]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [resolvedId, setResolvedId] = useState(null);

  // Only the owner can share
  if (!isOwner) return null;

  // Nothing to share if no form has been started yet
  if (!formData.formType) return null;

  const handleClick = async () => {
    // Path A: already saved to DB — capture ID directly, open immediately
    if (formData.assessmentId) {
      setResolvedId(formData.assessmentId);
      setShowModal(true);
      return;
    }

    // Path B: not yet in DB — pre-save first, capture the returned ID directly
    // so the modal never receives a stale null from formData's render cycle.
    setSaving(true);
    try {
      const result = await apiService.saveAssessment(formData);
      if (result?.id) {
        updateFormData({ assessmentId: result.id }); // keep FormContext in sync
        setResolvedId(result.id);                    // capture fresh — guaranteed stable
      }
    } catch (err) {
      console.warn('[ShareButton] Pre-save before share failed (backend not available):', err.message);
    } finally {
      setSaving(false);
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={saving}
        title="Share this assessment"
        className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
          bg-[--color-sw-blue] text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          role="img"
          stroke="currentColor"
          className="h-4 w-4 mr-2"
          fill="none"
        >
          <circle cx="17.25" cy="6.75"  r="1.75" strokeWidth="2.5" />
          <circle cx="6.75"  cy="12.00" r="1.75" strokeWidth="2.5" />
          <circle cx="17.75" cy="17.25" r="1.75" strokeWidth="2.5" />
          <path d="M8.3 11.2 L15.2 7.9"  strokeWidth="2.5" strokeLinecap="round" />
          <path d="M8.3 12.8 L15.6 16.1" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        {saving ? 'Saving...' : 'Share'}
      </button>

      {/* resolvedId is set when the assessment exists in DB.
          When backend is unavailable (local dev), resolvedId stays null
          but we still open the modal so the UI remains usable. */}
      {showModal && (
        <ShareModal
          assessmentId={resolvedId}
          onClose={() => { setShowModal(false); setResolvedId(null); }}
          shareUrl={window.location.href}
        />
      )}
    </>
  );
};

export default ShareButton;
