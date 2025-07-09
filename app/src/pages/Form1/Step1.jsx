// src/pages/Form1/Step1.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step1 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  const [formState, setFormState] = useState({
    title: formData.title || '',
    leadName: formData.leadName || '',
    leadRole: formData.leadRole || '',
    otherPeople: formData.otherPeople || '',
    workDetails: formData.workDetails || '',
    affectedGroups: formData.form1?.affectedGroups || '',
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
      workDetails: formState.workDetails,
      form1: {
        ...formData.form1,
        affectedGroups: formState.affectedGroups,
      }
    });

    // Mark this step as completed
    completeStep(0);

    // Navigate to the next step
    navigate('/form1/step2');
  };

  // Handle clicking on a step in the progress bar
  const handleStepClick = (stepIndex) => {
    // Navigate to the appropriate step
    switch(stepIndex) {
      case 0:
        navigate('/form1/step1');
        break;
      case 1:
        navigate('/form1/step2');
        break;
      case 2:
        navigate('/form1/step3');
        break;
      case 3:
        navigate('/form1/step4');
        break;
      case 4:
        navigate('/form1/step5');
        break;
      case 5:
        navigate('/form1/step6');
        break;
      case 6:
        navigate('/form1/step7');
        break;
      case 7:
        navigate('/form1/step8');
        break;
      case 8:
        navigate('/form1/step9');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <ProgressBar 
        steps={form1Steps} 
        currentStep={0} 
        completedSteps={formData.completedSteps?.form1 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Step 1: Basic Details
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
            What is this piece of work about?
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Explain your project, plan, or idea in a few sentences
          </p>
          <textarea
            id="workDetails"
            name="workDetails"
            value={formState.workDetails}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="affectedGroups" className="block text-lg font-semibold mb-2">
            Who will be affected?
          </label>
          <p className="text-sm text-gray-600 mb-2">
            e.g., staff, public, athletes, partners
          </p>
          <textarea
            id="affectedGroups"
            name="affectedGroups"
            value={formState.affectedGroups}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={4}
          />
        </div>

        <div className="mt-12 flex justify-between">
          <Link to="/form-introduction" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </Link>
          <button
            className="inline-flex items-center px-6 py-2 rounded-md text-sm bg-[--color-sw-red] text-white font-medium transition-colors duration-200 hover:bg-opacity-90"
            onClick={handleNext}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form1Step1;