// src/pages/Form1/Step9.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import PrevButton from '../../components/ui/PrevButton';

const Form1Step9 = () => {
  const navigate = useNavigate();
  const { formData } = useFormContext();

  const [signingOff, setSigningOff]     = useState(false);
  const [signOffError, setSignOffError] = useState(null);

  const isSignedOff = formData.status === 'signed_off';
  const canSignOff  = !!formData.assessmentId && !isSignedOff;

  // Redirect if no form type is set (direct URL access without an active form)
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  const handleSignOff = async () => {
    setSigningOff(true);
    setSignOffError(null);
    try {
      await apiService.signOffAssessment(formData.assessmentId);
      navigate('/');
    } catch (err) {
      setSignOffError('Could not sign off. Please try again.');
    } finally {
      setSigningOff(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ProgressBar
        steps={form1Steps}
        currentStep={8}
        completedSteps={formData.completedSteps?.form1 || []}
        formType={formData.formType}
      />

      <h2 className="text-3xl font-bold mb-4">Assessment complete</h2>

      {isSignedOff ? (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-green-800 font-medium">This assessment has been signed off and is locked.</p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-700">
            Your assessment is complete. You can review the content using the back button,
            then sign it off when you are ready. Once signed off it cannot be edited.
          </p>
        </div>
      )}

      {/* Warning shown when DB is unavailable — sign off requires a real assessment ID */}
      {!formData.assessmentId && !isSignedOff && (
        <p className="mb-4 text-sm text-amber-600">
          ⚠ Sign off requires a database connection. Your assessment is saved locally — sign off will be available once connected.
        </p>
      )}

      {signOffError && (
        <p className="mb-4 text-sm text-red-600">{signOffError}</p>
      )}

      <div className="mt-8 flex justify-between">
        <PrevButton backLink="/form1/step8" />

        <div className="flex gap-3">
          {/* Always allow moving to the Review step */}
          {!isSignedOff && (
            <button
              onClick={() => navigate('/form1/step10')}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
              Next: Review →
            </button>
          )}

          {/* Sign Off — only available when assessment is in DB and not yet signed off */}
          {canSignOff && (
            <button
              onClick={handleSignOff}
              disabled={signingOff}
              className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {signingOff ? 'Signing off...' : 'Sign Off Assessment ✓'}
            </button>
          )}

          {/* Signed off — only show return to workspace */}
          {isSignedOff && (
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700 transition-colors duration-200"
            >
              Back to My Assessments
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Form1Step9;
