import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { apiService, ASSESSMENT_STATUS } from '../../services/api';
import { form2Steps } from './constants';
import ProgressBar from '../../components/ui/ProgressBar';
import PrevButton from "../../components/ui/PrevButton";

const Form2Step2 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

  const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

  const [formState, setFormState] = useState({
    assessment: formData.form2?.assessment || '',
  });

  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(null);

  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Sync to FormContext immediately so SaveButton always has current data
    updateFormData({ form2: { ...formData.form2, [name]: value } });
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    setCompleteError(null);

    const updatedData = {
      form2: {
        ...formData.form2,
        assessment: formState.assessment,
      },
      status: ASSESSMENT_STATUS.COMPLETE,
    };

    const dataToSave = commitStep(1, updatedData);

    let idToUse = formData.assessmentId || formData.localId;

    try {
      const saveResult = await apiService.saveAssessment(dataToSave);
      if (saveResult?.id) {
        idToUse = saveResult.id;
        if (!formData.assessmentId) {
          confirmDbSave(saveResult.id);
        }
      }
    } catch (err) {
      console.warn('[Complete] DB save failed. Continuing with local id.', err.message);
    }

    if (idToUse && !idToUse.startsWith('local_')) {
      try {
        await apiService.completeAssessment(idToUse);
      } catch (err) {
        console.warn('[Complete] DB completeAssessment failed. Status saved locally.', err.message);
      }
    }

    setIsCompleting(false);
    navigate('/form2/step3');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <ProgressBar 
        steps={form2Steps} 
        currentStep={1} 
        completedSteps={formData.completedSteps?.form2 || []} 
        formType={formData.formType}
      />

      <h2 className="text-3xl font-bold mb-8">
        Your Assessment
      </h2>
      {isReadOnly && (
        <p className="mb-6 text-sm text-gray-500">
          {formData.status === 'signed_off' ? 'This assessment has been signed off and cannot be edited.' : 'You have view-only access to this assessment.'}
        </p>
      )}

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p>
          You should read the 'Guidance and Research' section and view the 'IIA Bank' to help you. 
          If you need further guidance contact Ian Blackburn.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="assessment" className="block text-lg font-semibold mb-2">
            In this section you should explain any positive or negative impact you believe your work will achieve, and any actions you will take.
          </label>
          <textarea
            id="assessment"
            name="assessment"
            value={formState.assessment}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={10}
            placeholder="Describe the positive and negative impacts of your work and any actions you plan to take"
          />
        </div>

        <div className="mt-12 flex justify-between">
          	<PrevButton backLink="/form2/step1" />
          	{!isReadOnly && (
              <div className="flex flex-col items-end gap-2">
                {completeError && (
                  <p className="text-sm text-red-600">{completeError}</p>
                )}
                <button
                  onClick={handleComplete}
                  disabled={isCompleting}
                  className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isCompleting ? 'Saving & Completing...' : 'Mark as Complete ✓'}
                </button>
              </div>
            )}
            {isReadOnly && (
              <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">
                Back to My Assessments
              </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Form2Step2;