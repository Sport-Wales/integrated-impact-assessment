// src/pages/Form1/Step8.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { usePreserveId } from '../../hooks/usePreserveId';
import { apiService, ASSESSMENT_STATUS } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import PrevButton from "../../components/ui/PrevButton";

const Form1Step8 = () => {
  const navigate = useNavigate();
  const { navigateWithId } = usePreserveId();
  const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

  const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    actionsAndNextSteps: formData.form1?.actionsAndNextSteps || '',
    reviewDate: formData.form1?.reviewDate || '',
    responsiblePerson: formData.form1?.responsiblePerson || '',
  });

  const [isCompleting, setIsCompleting] = useState(false);
  const [completeError, setCompleteError] = useState(null);

  // Redirect if form type is not set
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    // Sync to FormContext immediately so SaveButton always has current data
    updateFormData({ form1: { ...formData.form1, [name]: value } });
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    setCompleteError(null);

    const updatedData = {
      form1: {
        ...formData.form1,
        actionsAndNextSteps: formState.actionsAndNextSteps,
        reviewDate: formState.reviewDate,
        responsiblePerson: formState.responsiblePerson,
      },
      status: ASSESSMENT_STATUS.COMPLETE,
    };

    commitStep(7, updatedData);

    const ft = formData.formType;
    const cs = formData.completedSteps?.[ft] || [];
    const savePayload = {
      ...formData,
      ...updatedData,
      completedSteps: { ...formData.completedSteps, [ft]: cs.includes(7) ? cs : [...cs, 7].sort((a, b) => a - b) },
    };

    let idToUse = formData.assessmentId || formData.localId;

    try {
      const saveResult = await apiService.saveAssessment(savePayload);
      if (saveResult?.id) {
        idToUse = saveResult.id;
        if (!formData.assessmentId) confirmDbSave(saveResult.id);
      }
      if (idToUse && !idToUse.startsWith('local_')) {
        await apiService.completeAssessment(idToUse);
      }
    } catch (err) {
      console.warn('[Complete] Background save/complete failed:', err.message);
    }

    setIsCompleting(false);
    navigateWithId('/form1/step9');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ProgressBar 
        steps={form1Steps} 
        currentStep={7} 
        completedSteps={formData.completedSteps?.form1 || []} 
        formType={formData.formType}
      />

      <h2 className="text-3xl font-bold mb-8">
        Actions and next steps
      </h2>
      {isReadOnly && (
        <p className="mb-6 text-sm text-gray-500">
          {formData.status === 'signed_off' ? 'This assessment has been submitted and cannot be edited.' : 'You have view-only access to this assessment.'}
        </p>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label htmlFor="actionsAndNextSteps" className="block text-lg font-semibold mb-2">
            What changes will you make based on this assessment? Do you need any more information?
          </label>
          <textarea
            id="actionsAndNextSteps"
            name="actionsAndNextSteps"
            value={formState.actionsAndNextSteps}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="List specific actions, improvements, and any additional information needed"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="reviewDate" className="block text-lg font-semibold mb-2">
            When will you check progress?
          </label>
          <p className="text-sm text-gray-600 mb-2">Set a review date</p>
          <input
            type="date"
            id="reviewDate"
            name="reviewDate"
            min="2025-01-01"
            value={formState.reviewDate}
            onChange={handleChange}
            readOnly={isReadOnly}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg${isReadOnly ? ' pointer-events-none' : ''}`}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="responsiblePerson" className="block text-lg font-semibold mb-2">
            Who is responsible for follow-up actions?
          </label>
          <input
            type="text"
            id="responsiblePerson"
            name="responsiblePerson"
            value={formState.responsiblePerson}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Name and role of the person responsible"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <PrevButton onPrev={() => navigateWithId('/form1/step7')} />
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
  );
};

export default Form1Step8;