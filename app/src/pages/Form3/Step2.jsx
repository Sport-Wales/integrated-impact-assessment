// src/pages/Form3/Step2.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ui/ProgressBar';
import { form3Steps } from './constants';

const Form3Step2 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  const [formState, setFormState] = useState({
    assessment: formData.form3?.assessment || '',
  });

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
    updateFormData({
      form3: {
        ...formData.form3,
        assessment: formState.assessment,
      }
    });
    // Mark this step as completed
    completeStep(1);
    navigate('/form3/step3');
  };

  // Handle clicking on a step in the progress bar
  const handleStepClick = (stepIndex) => {
    // Navigate to the appropriate step
    switch(stepIndex) {
      case 0:
        navigate('/form3/step1');
        break;
      case 1:
        // Current step - do nothing
        break;
      case 2:
        navigate('/form3/step3');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <ProgressBar 
        steps={form3Steps} 
        currentStep={1} 
        completedSteps={formData.completedSteps?.form3 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Step 2: Your Assessment
      </h2>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={10}
            placeholder="Describe the positive and negative impacts of your work and any actions you plan to take"
          />
        </div>

        <div className="mt-12 flex justify-between">
          <Link to="/form3/step1" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form3Step2;