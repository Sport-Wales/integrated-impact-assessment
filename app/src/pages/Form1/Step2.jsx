// src/pages/Form1/Step2.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form1Step2 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  const [formState, setFormState] = useState({
    existingKnowledge: formData.form1?.existingKnowledge || '',
    missingInfo: formData.form1?.missingInfo || 'no',
    missingInfoDetails: formData.form1?.missingInfoDetails || '',
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
        existingKnowledge: formState.existingKnowledge,
        missingInfo: formState.missingInfo,
        missingInfoDetails: formState.missingInfoDetails,
      }
    });

    // Navigate to the next step
    navigate('/form1/step3');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div className="bg-sw-red h-3 rounded-full" style={{ width: '22%' }}></div>
        </div>

        <div className="flex justify-between items-center mt-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              1
            </div>
            <div className="text-xs text-center">Basic Details</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sw-red flex items-center justify-center text-white text-sm mb-1">
              2
            </div>
            <div className="text-xs text-center">Understanding the Impact</div>
          </div>
          {/* Additional steps would be displayed here */}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">
        Step 2: Understanding the Impact
      </h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="existingKnowledge" className="block text-lg font-semibold mb-2">
            What do you already know?
          </label>
          <p className="text-sm text-gray-600 mb-2">
            Past reports, surveys, feedback, statistics
          </p>
          <textarea
            id="existingKnowledge"
            name="existingKnowledge"
            value={formState.existingKnowledge}
            onChange={handleChange}
            className="input-field w-full my-4"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="missingInfo" className="block text-lg font-semibold mb-2">
            Are you missing any information?
          </label>
          <div className="space-y-2 my-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="missingInfoYes"
                name="missingInfo"
                value="yes"
                checked={formState.missingInfo === 'yes'}
                onChange={handleChange}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="missingInfoYes">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="missingInfoNo"
                name="missingInfo"
                value="no"
                checked={formState.missingInfo === 'no'}
                onChange={handleChange}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="missingInfoNo">No</label>
            </div>
          </div>
        </div>

        {formState.missingInfo === 'yes' && (
          <div>
            <label htmlFor="missingInfoDetails" className="block text-lg font-semibold mb-2">
              How will you find the missing info?
            </label>
            <textarea
              id="missingInfoDetails"
              name="missingInfoDetails"
              value={formState.missingInfoDetails}
              onChange={handleChange}
              className="input-field w-full my-4"
              rows={3}
            />
          </div>
        )}

        <div className="mt-12 flex justify-between">
          <Link to="/form1/step1" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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
    </div>
  );
};

export default Form1Step2;