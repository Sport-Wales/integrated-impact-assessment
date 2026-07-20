import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { usePreserveId } from '../../hooks/usePreserveId';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form2Steps } from './constants'; 

const Form2Step4 = () => {
  const navigate = useNavigate();
  const { navigateWithId } = usePreserveId();
  const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

  const canAccessReview = formData.status === 'signed_off' && formData.userRole === 'owner';


  const [formState, setFormState] = useState({
    review: formData.form2?.review || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!canAccessReview) {
      // Send them back to the Sign Off / Assessment Document page instead
      navigate(formData.formType === 'form1' ? '/form1/step9' : '/form2/step3', {
        replace: true,
      });
    }
  }, [canAccessReview]);

  if (!canAccessReview) return null;

  
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

  // Save this step's data to localStorage + DB in background, then return to workspace
  const handleDone = async () => {
    setIsSubmitting(true);

    const updatedData = {
      form2: {
        ...formData.form2,
        review: formState.review,
      },
      reviewedAt: new Date().toISOString(),
    };

    commitStep(3, updatedData);

    // Write reviewedAt directly to localStorage before saving
    const localId = formData.localId;
    if (localId) {
      try {
        const raw = localStorage.getItem('iia_assessments');
        const store = raw ? JSON.parse(raw) : {};
        if (store[localId]) {
          store[localId] = { ...store[localId], reviewedAt: new Date().toISOString() };
          localStorage.setItem('iia_assessments', JSON.stringify(store));
        }
      } catch { /* safe to ignore */ }
    }

    const ft = formData.formType;
    const cs = formData.completedSteps?.[ft] || [];
    const savePayload = {
      ...formData,
      ...updatedData,
      completedSteps: { ...formData.completedSteps, [ft]: cs.includes(3) ? cs : [...cs, 3].sort((a, b) => a - b) },
    };

    try {
      const result = await apiService.saveAssessment(savePayload);
      if (!formData.assessmentId && result?.id) confirmDbSave(result.id);
    } catch (err) {
      console.warn('[AutoSave] Form2/Step4 DB save failed. Data is safe in localStorage.', err.message);
    }

    setIsSubmitting(false);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ProgressBar 
        steps={form2Steps} 
        currentStep={3} 
        completedSteps={formData.completedSteps?.form2 || []} 
        formType={formData.formType}
      />

      <h2 className="text-3xl font-bold mb-8">
        Final Review
      </h2>

      {/* {isReadOnly && (
        <p className="mb-6 text-sm text-gray-500">
          {formData.status === 'signed_off'
            ? 'This assessment has been signed off and cannot be edited.'
            : 'You have view-only access to this assessment.'}
        </p>
      )} */}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="review" className="block text-lg font-semibold mb-2">
            Use this space to detail the outcome of your work. What were the positive and negative impacts? Did you have to take any actions?
          </label>
          <textarea
            id="review"
            name="review"
            value={formState.review}
            onChange={handleChange}
            // readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={6}
            placeholder="Describe the outcomes, impacts, and any actions taken"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <button
          onClick={() => navigateWithId('/form2/step3')}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>
        {!isReadOnly && (
          <button
            onClick={handleDone}
            disabled={isSubmitting}
            className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Saving...' : 'Save & Back to My Assessments'}
          </button>
        )}
        {/* {isReadOnly && (
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700"
          >
            Back to My Assessments
          </button>
        )} */}
      </div>
    </div>
  );
};

export default Form2Step4;