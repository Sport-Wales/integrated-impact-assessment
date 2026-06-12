// src/pages/Form2/Step3.jsx
// Sign Off step — wraps AssessmentDocument with the ProgressBar and form navigation.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ui/ProgressBar';
import AssessmentDocument from '../AssessmentDocument';
import { form2Steps } from './constants';

const Form2Step3 = () => {
  const navigate = useNavigate();
  const { formData } = useFormContext();

  // Redirect if no form type is set (direct URL access without an active form)
  useEffect(() => {
    if (!formData.formType) navigate('/form-selection');
  }, [formData.formType, navigate]);

  return (
    <div>
      {/* ProgressBar at the top — same pattern as all other steps */}
      <div className="max-w-4xl mx-auto px-4 pt-12">
        <ProgressBar
          steps={form2Steps}
          currentStep={2}
          completedSteps={formData.completedSteps?.form2 || []}
          formType={formData.formType}
        />
      </div>

      {/* The full assessment report + sign off */}
      <AssessmentDocument embedded />

      {/* Navigation to Review step — below the document */}
      {formData.status !== 'draft' && (
        <div className="max-w-4xl mx-auto px-4 pb-12 flex justify-end">
          <button
            onClick={() => navigate('/form2/step4')}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium
              bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Next: Review →
          </button>
        </div>
      )}
    </div>
  );
};

export default Form2Step3;
