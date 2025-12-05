import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { form2Steps } from './constants';
import ProgressBar from '../../components/ui/ProgressBar';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form2Step2 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  const [formState, setFormState] = useState({
    assessment: formData.form2?.assessment || '',
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
      form2: {
        ...formData.form2,
        assessment: formState.assessment,
      }
    });
    // Mark this step as completed
    completeStep(1);
    navigate('/form2/step3');
  };

  // Handle clicking on a step in the progress bar
  const handleStepClick = (stepIndex) => {
    // Navigate to the appropriate step
    switch(stepIndex) {
      case 0:
        navigate('/form2/step1');
        break;
      case 1:
        // Current step - do nothing
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
        currentStep={1} 
        completedSteps={formData.completedSteps?.form2 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Your Assessment
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
          	<PrevButton backLink="/form2/step1" />
			<NextButton label="Next: People" onClick={handleNext} />
        </div>
      </div>
    </div>
  );
};

export default Form2Step2;