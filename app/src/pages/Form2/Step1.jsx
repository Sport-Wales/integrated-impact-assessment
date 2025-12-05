import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ui/ProgressBar';
import { form2Steps } from './constants';
import NextButton from '../../components/ui/NextButton';
import PrevButton from '../../components/ui/PrevButton';

const Form2Step1 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

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
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      title: formState.title,
      leadName: formState.leadName,
      leadRole: formState.leadRole,
      otherPeople: formState.otherPeople,
      workDetails: formState.workDetails
    });

    // Mark this step as completed
    completeStep(0);

    // Navigate to the next step
    navigate('/form2/step2');
  };

  // Handle clicking on a step in the progress bar
  const handleStepClick = (stepIndex) => {
    // Navigate to the appropriate step
    switch(stepIndex) {
      case 0:
        // Current step - do nothing
        break;
      case 1:
        navigate('/form2/step2');
        break;
      case 2:
        navigate('/form2/step3');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <ProgressBar 
        steps={form2Steps} 
        currentStep={0} 
        completedSteps={formData.completedSteps?.form2 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        About your project
      </h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-lg font-semibold mb-2">
            Give this assessment a title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={6}
          />
        </div>

        <div className="mt-12 flex justify-between">
          	<PrevButton backLink="/form-introduction" />
			<NextButton label="Next: Known impacts" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default Form2Step1;