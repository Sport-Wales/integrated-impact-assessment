// src/pages/Form1/Step5.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form1Step5 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

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

    // Navigate to the next step
    navigate('/form1/step6');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div className="bg-sw-red h-3 rounded-full" style={{ width: '55%' }}></div>
        </div>

        <div className="flex justify-between items-center mt-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              1
            </div>
            <div className="text-xs text-center">Basic Details</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              2
            </div>
            <div className="text-xs text-center">Understanding</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              3
            </div>
            <div className="text-xs text-center">People</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              4
            </div>
            <div className="text-xs text-center">Socio-Economic</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sw-red flex items-center justify-center text-white text-sm mb-1">
              5
            </div>
            <div className="text-xs text-center">Environment</div>
          </div>
          {/* Additional steps would be displayed here */}
        </div>
      </div>

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
            className="input-field w-full"
            rows={4}
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