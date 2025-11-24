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
    welshLanguage: formData.form1?.welshLanguage || {
      supportWelshLanguage: 'no',
      hardForWelshSpeakers: 'no',
      improvements: '',
      positiveImpact: '',
      negativeImpact: '',
      neutralImpact: '',
      increasePositiveEffects: '',
      decreaseAdverseEffects: '',
    }
  });

  // State for showing/hiding policy questions
  const [showPolicyQuestions, setShowPolicyQuestions] = useState(false);

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
        Impacts on Welsh language
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <p className="text-lg mb-6">
          This section covers impacts of your work on Welsh language use.
        </p>

        {/* Our public duty to Welsh language */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-lg mb-2">Our public duty to Welsh language</h3>
          <p className="text-gray-700">
            Note: part of our public duty to well-being for future generations also includes promoting Welsh culture and language.
          </p>
        </div>

        {/* Will this support the Welsh language? */}
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

        {/* Could it make things harder for Welsh speakers? */}
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

        {/* How can we improve support for Welsh language speakers? */}
        <div className="mb-8">
          <label htmlFor="improvements" className="block text-lg font-semibold mb-2">
            How can we improve support for Welsh language speakers?
          </label>
          <textarea
            id="improvements"
            name="improvements"
            value={formState.welshLanguage.improvements}
            onChange={handleTextChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
            placeholder="Describe how your work could better support or promote the Welsh language"
          />
        </div>

        {/* Important notice for policy work */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <h3 className="font-bold text-lg mb-2">Important: writing a new policy, reviewing an existing policy or making significant changes to a policy level or strategy level area of work</h3>
          <p className="text-gray-700 mb-2">
            Contact Sport Wales' Regulatory Compliance Lead as early as possible if your work is on a new or existing policy and involves a consultation process.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:ian.blackburn@sport.wales" className="text-sw-blue underline hover:text-sw-blue-dark">
              ian.blackburn@sport.wales
            </a>
          </p>
          <p className="text-gray-700">
            They can advise you how to make sure we comply with the Welsh Language Standard and regulations (2016).
          </p>
        </div>

        {/* Collapsible Policy Questions Section */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <button 
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setShowPolicyQuestions(!showPolicyQuestions)}
          >
            <div>
              <h3 className="text-lg font-bold">Additional policy questions</h3>
              <p className="text-sm text-gray-600 mt-1">
                If your work involves writing or changing a policy, answer these questions
              </p>
            </div>
            <svg 
              className={`w-5 h-5 transition-transform ${showPolicyQuestions ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showPolicyQuestions && (
            <div className="p-6 border-t space-y-6">
              <p className="text-gray-700 mb-4">
                To meet our public duty you must answer these questions and explain your reasoning:
              </p>

              {/* Question 1 */}
              <div>
                <label htmlFor="positiveImpact" className="block text-lg font-semibold mb-2">
                  1. How does the policy have a positive impact on the Welsh language?
                </label>
                <textarea
                  id="positiveImpact"
                  name="positiveImpact"
                  value={formState.welshLanguage.positiveImpact}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe positive impacts on Welsh language"
                />
              </div>

              {/* Question 2 */}
              <div>
                <label htmlFor="negativeImpact" className="block text-lg font-semibold mb-2">
                  2. How does the policy have a negative impact on the Welsh language?
                </label>
                <textarea
                  id="negativeImpact"
                  name="negativeImpact"
                  value={formState.welshLanguage.negativeImpact}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe negative impacts on Welsh language"
                />
              </div>

              {/* Question 3 */}
              <div>
                <label htmlFor="neutralImpact" className="block text-lg font-semibold mb-2">
                  3. How does the policy have a neutral impact on the Welsh language?
                </label>
                <textarea
                  id="neutralImpact"
                  name="neutralImpact"
                  value={formState.welshLanguage.neutralImpact}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe neutral impacts on Welsh language"
                />
              </div>

              {/* Question 4 */}
              <div>
                <label htmlFor="increasePositiveEffects" className="block text-lg font-semibold mb-2">
                  4. How could the decision be made so that it has a positive, or increased positive effects on the Welsh language?
                </label>
                <textarea
                  id="increasePositiveEffects"
                  name="increasePositiveEffects"
                  value={formState.welshLanguage.increasePositiveEffects}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe how to increase positive effects"
                />
              </div>

              {/* Question 5 */}
              <div>
                <label htmlFor="decreaseAdverseEffects" className="block text-lg font-semibold mb-2">
                  5. How could the decision be made so that it does not have adverse effects, or so that it has decreased adverse effects on the Welsh language?
                </label>
                <textarea
                  id="decreaseAdverseEffects"
                  name="decreaseAdverseEffects"
                  value={formState.welshLanguage.decreaseAdverseEffects}
                  onChange={handleTextChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Describe how to decrease adverse effects"
                />
              </div>
            </div>
          )}
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
          Next: Socio-economic impact
        </button>
      </div>
    </div>
  );
};

export default Form1Step5;