// src/pages/Form1/Step5.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step5 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    environmentalImpact: formData.form1?.environmentalImpact || {
      helpNatureAndEnvironment: 'no',
      harmNature: 'no',
      improvements: '',
    }
  });

  // Redirect if form type is not set
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  const handleRadioChange = (field, value) => {
    setFormState(prev => ({
      ...prev,
      environmentalImpact: {
        ...prev.environmentalImpact,
        [field]: value
      }
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      environmentalImpact: {
        ...prev.environmentalImpact,
        [name]: value
      }
    }));
  };

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      form1: {
        ...formData.form1,
        environmentalImpact: formState.environmentalImpact
      }
    });

    completeStep(4);
    navigate('/form1/step6');
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
        currentStep={4} 
        completedSteps={formData.completedSteps?.form1 || []} 
        onStepClick={handleStepClick} 
      />
      <h2 className="text-3xl font-bold mb-8">
        Step 5: Environment & Biodiversity
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Will this help nature and the environment?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="helpNatureYes"
                name="helpNatureAndEnvironment"
                value="yes"
                checked={formState.environmentalImpact.helpNatureAndEnvironment === 'yes'}
                onChange={() => handleRadioChange('helpNatureAndEnvironment', 'yes')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="helpNatureYes" className="ml-2">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="helpNatureNo"
                name="helpNatureAndEnvironment"
                value="no"
                checked={formState.environmentalImpact.helpNatureAndEnvironment === 'no'}
                onChange={() => handleRadioChange('helpNatureAndEnvironment', 'no')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="helpNatureNo" className="ml-2">No</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Could it harm nature?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="harmNatureYes"
                name="harmNature"
                value="yes"
                checked={formState.environmentalImpact.harmNature === 'yes'}
                onChange={() => handleRadioChange('harmNature', 'yes')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="harmNatureYes" className="ml-2">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="harmNatureNo"
                name="harmNature"
                value="no"
                checked={formState.environmentalImpact.harmNature === 'no'}
                onChange={() => handleRadioChange('harmNature', 'no')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="harmNatureNo" className="ml-2">No</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="improvements" className="block text-lg font-semibold mb-2">
            How can we reduce harm and increase benefits?
          </label>
          <textarea
            id="improvements"
            name="improvements"
            value={formState.environmentalImpact.improvements}
            onChange={handleTextChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={1}
            placeholder="Describe how your work could minimize environmental impact or enhance biodiversity"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step4" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form1Step5;