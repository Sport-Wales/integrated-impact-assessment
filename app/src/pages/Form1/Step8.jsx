// src/pages/Form1/Step8.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step8 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    actionsAndNextSteps: formData.form1?.actionsAndNextSteps || '',
    reviewDate: formData.form1?.reviewDate || '',
    responsiblePerson: formData.form1?.responsiblePerson || '',
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
      form1: {
        ...formData.form1,
        actionsAndNextSteps: formState.actionsAndNextSteps,
        reviewDate: formState.reviewDate,
        responsiblePerson: formState.responsiblePerson,
      }
    });

    completeStep(7);
    navigate('/form1/step9');
  };

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
      <ProgressBar 
        steps={form1Steps} 
        currentStep={7} 
        completedSteps={formData.completedSteps?.form1 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Step 8: Actions and Next Steps
      </h2>

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
            className="input-field w-full"
            rows={6}
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
            value={formState.reviewDate}
            onChange={handleChange}
            className="input-field w-full"
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
            className="input-field w-full"
            placeholder="Name and role of the person responsible"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step7" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
          Prev
        </Link>
        <button
          className="inline-flex items-center px-6 py-1 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Form1Step8;