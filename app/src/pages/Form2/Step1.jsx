import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form2Steps } from './constants';
import NextButton from '../../components/ui/NextButton';
import PrevButton from '../../components/ui/PrevButton';

const Form2Step1 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

  const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

  const [formState, setFormState] = useState({
    title: formData.title || '',
    leadName: formData.leadName || '',
    leadRole: formData.leadRole || '',
    otherPeople: formData.otherPeople || '',
    workDetails: formData.workDetails || '',
  });

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
    updateFormData({ [name]: value });
  };

  // Save to DB as soon as a title is entered and the user clicks off the field.
  // This is the first meaningful save — gives the assessment an identity before
  // the user clicks Next. Silent fail: localStorage always has the data.
  // Skipped if assessmentId already exists (DB record already created).
  const handleTitleBlur = async () => {
    if (!formState.title.trim() || formData.assessmentId) return;

    const dataToSave = {
      ...formData,
      title: formState.title,
    };

    try {
      const result = await apiService.saveAssessment(dataToSave);
      if (result?.id) {
        confirmDbSave(result.id);
      }
    } catch (err) {
      console.warn('[TitleBlur] Early save failed. Data is safe in localStorage.', err.message);
    }
  };

  const handleNext = async () => {
    // Build updated data
    const updatedData = {
      title: formState.title,
      leadName: formState.leadName,
      leadRole: formState.leadRole,
      otherPeople: formState.otherPeople,
      workDetails: formState.workDetails
    };

    const dataToSave = commitStep(0, updatedData);

    try {
      const result = await apiService.saveAssessment(dataToSave);
      
      // Use dataToSave.assessmentId (committed snapshot) not formData.assessmentId
      // (stale closure) — prevents duplicate INSERT if blur save already ran.
      if (!dataToSave.assessmentId && result?.id) {
        confirmDbSave(result.id);
      }
    } catch (err) {
      // Silent fail — data is safe in localStorage
      console.warn('[AutoSave] Could not save to database:', err.message);
    }

    // Navigate to next step
    navigate('/form2/step2');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <ProgressBar 
        steps={form2Steps} 
        currentStep={0} 
        completedSteps={formData.completedSteps?.form2 || []} 
        formType={formData.formType}
      />

      <h2 className="text-3xl font-bold mb-8">
        About your project
      </h2>
      {isReadOnly && (
        <p className="mb-6 text-sm text-gray-500">
          {formData.status === 'signed_off' ? 'This assessment has been signed off and cannot be edited.' : 'You have view-only access to this assessment.'}
        </p>
      )}

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-semibold mb-2">
            Give this assessment a title
            {!isReadOnly && <span className="ml-2 pb-2 text-xs font-normal text-red-400">* Required</span>}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            onBlur={handleTitleBlur}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="leadName" className="block text-lg font-semibold mb-2">
            Who is leading this assessment?
          </label>
          <p className="text-sm text-gray-600 mb-2">Your name and role</p>
          <input
            type="text"
            id="leadName"
            name="leadName"
            value={formState.leadName}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
            placeholder="Name"
          />
        </div>

        <div className="mt-4">
          <input
            type="text"
            id="leadRole"
            name="leadRole"
            value={formState.leadRole}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            required
            placeholder="Role"
          />
        </div>

        <div>
          <label htmlFor="otherPeople" className="block text-lg font-semibold mb-2">
            Who else is involved?
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Other people helping. These will also be given access to this assessment
          </p>
          <input
            type="text"
            id="otherPeople"
            name="otherPeople"
            value={formState.otherPeople}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="workDetails" className="block text-lg font-semibold mb-2">
            Use this section to detail this work
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Provide any background, objectives, past work, insight or research
          </p>
          <textarea
            id="workDetails"
            name="workDetails"
            value={formState.workDetails}
            onChange={handleChange}
            readOnly={isReadOnly}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={6}
          />
        </div>

        <div className="mt-12 flex justify-between">
          	<PrevButton backLink="/form-introduction" />
			{!isReadOnly
				? <NextButton label="Next: Known impacts" onClick={handleNext} />
				: <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">Back to My Assessments</button>
			}
        </div>
      </div>
    </div>
  );
};

export default Form2Step1;