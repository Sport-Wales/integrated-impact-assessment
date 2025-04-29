// src/pages/Form1/Step6.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form1Step6 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    welshLanguage: formData.form1?.welshLanguage || {
      supportWelshLanguage: 'no',
      hardForWelshSpeakers: 'no',
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
      welshLanguage: {
        ...prev.welshLanguage,
        [field]: value
      }
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      welshLanguage: {
        ...prev.welshLanguage,
        [name]: value
      }
    }));
  };

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      form1: {
        ...formData.form1,
        welshLanguage: formState.welshLanguage
      }
    });

    // Navigate to the next step
    navigate('/form1/step7');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div className="bg-sw-red h-3 rounded-full" style={{ width: '66%' }}></div>
        </div>

        <div className="flex justify-between items-center mt-4 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              1
            </div>
            <div className="text-xs text-center">Basic</div>
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
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm mb-1">
              5
            </div>
            <div className="text-xs text-center">Environment</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sw-red flex items-center justify-center text-white text-sm mb-1">
              6
            </div>
            <div className="text-xs text-center">Welsh Language</div>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">
        Step 6: Welsh Language
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Will this support the Welsh language?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="supportWelshYes"
                name="supportWelshLanguage"
                value="yes"
                checked={formState.welshLanguage.supportWelshLanguage === 'yes'}
                onChange={() => handleRadioChange('supportWelshLanguage', 'yes')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="supportWelshYes" className="ml-2">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="supportWelshNo"
                name="supportWelshLanguage"
                value="no"
                checked={formState.welshLanguage.supportWelshLanguage === 'no'}
                onChange={() => handleRadioChange('supportWelshLanguage', 'no')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="supportWelshNo" className="ml-2">No</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Could it make things harder for Welsh speakers?
          </label>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="hardForWelshYes"
                name="hardForWelshSpeakers"
                value="yes"
                checked={formState.welshLanguage.hardForWelshSpeakers === 'yes'}
                onChange={() => handleRadioChange('hardForWelshSpeakers', 'yes')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="hardForWelshYes" className="ml-2">Yes</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="hardForWelshNo"
                name="hardForWelshSpeakers"
                value="no"
                checked={formState.welshLanguage.hardForWelshSpeakers === 'no'}
                onChange={() => handleRadioChange('hardForWelshSpeakers', 'no')}
                className="w-4 h-4 mr-2"
              />
              <label htmlFor="hardForWelshNo" className="ml-2">No</label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="improvements" className="block text-lg font-semibold mb-2">
            How can we improve support for Welsh Language?
          </label>
          <textarea
            id="improvements"
            name="improvements"
            value={formState.welshLanguage.improvements}
            onChange={handleTextChange}
            className="input-field w-full"
            rows={4}
            placeholder="Describe how your work could better support or promote the Welsh language"
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step5" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form1Step6;