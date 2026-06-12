import { useState } from 'react';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';

// Save states: 'idle' | 'saving' | 'saved'
const SaveButton = () => {
  const { formData, confirmDbSave } = useFormContext();
  const [saveState, setSaveState] = useState('idle');

  const onClick = async () => {
    // Nothing to save if no form has been started yet
    if (!formData.formType) return;

    setSaveState('saving');

    // localStorage is always written first by FormContext on every state change,
    // so the data is already safe before we even attempt the DB call.
    // The DB save is a best-effort background sync — failure is always silent to the user.
    try {
      const result = await apiService.saveAssessment(formData);
      // On first successful DB save: re-key localStorage entry under real DB id
      if (!formData.assessmentId && result?.id) {
        confirmDbSave(result.id);
      }
    } catch (err) {
      // Backend not available yet — that's fine. Data is safe in localStorage.
      // When the backend is connected, the next save attempt will sync everything.
      console.warn('[SaveButton] DB save failed (backend not available). Data is safe in localStorage.', err.message);
    }

    // Always show 'Saved ✓' — localStorage save always succeeded
    setSaveState('saved');
    setTimeout(() => setSaveState('idle'), 2000);
  };

  const label = saveState === 'saving' ? 'Saving...'
    : saveState === 'saved' ? 'Saved ✓'
      : 'Save';

  const bgClass = saveState === 'saved' ? 'bg-green-600 hover:bg-green-700'
    : 'bg-[--color-sw-blue] hover:bg-cyan-700';

  return (
    <button
      onClick={onClick}
      disabled={saveState === 'saving' || !formData.formType}
      className={`inline-flex items-center px-3 py-2 rounded-md text-sm text-white font-medium
        transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${bgClass}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="img"
        stroke="currentColor"
        className="h-4 w-4 mr-2 fill-current"
      >
        <path
          d="M7 4h8.3c.4 0 .8.16 1.06.44l3.2 3.2c.28.28.44.66.44 1.06V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          fill="currentColor"
        />
        <rect
          x="6.75"
          y="6.75"
          width="9.5"
          height="4"
          rx="0.6"
          className="fill-[--color-sw-blue]"
        />
      </svg>
      {label}
    </button>
  );
};

export default SaveButton;
