// src/pages/Form1/Step3.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form1Step3 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData } = useFormContext();

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    impactOnProtectedCharacteristics: formData.form1?.impactOnProtectedCharacteristics || {
      age: { impact: 'neutral', reason: '', improvement: '' },
      disability: { impact: 'neutral', reason: '', improvement: '' },
      genderReassignment: { impact: 'neutral', reason: '', improvement: '' },
      marriageCivilPartnership: { impact: 'neutral', reason: '', improvement: '' },
      pregnancyMaternity: { impact: 'neutral', reason: '', improvement: '' },
      race: { impact: 'neutral', reason: '', improvement: '' },
      religionBelief: { impact: 'neutral', reason: '', improvement: '' },
      sex: { impact: 'neutral', reason: '', improvement: '' },
      sexualOrientation: { impact: 'neutral', reason: '', improvement: '' },
    }
  });

  // Currently visible characteristic (collapsed view)
  const [visibleCharacteristic, setVisibleCharacteristic] = useState(null);

  // Redirect if form type is not set
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  // Handle change for impact radio buttons
  const handleImpactChange = (characteristic, value) => {
    setFormState(prev => ({
      ...prev,
      impactOnProtectedCharacteristics: {
        ...prev.impactOnProtectedCharacteristics,
        [characteristic]: {
          ...prev.impactOnProtectedCharacteristics[characteristic],
          impact: value
        }
      }
    }));
  };

  // Handle change for text inputs
  const handleTextChange = (characteristic, field, value) => {
    setFormState(prev => ({
      ...prev,
      impactOnProtectedCharacteristics: {
        ...prev.impactOnProtectedCharacteristics,
        [characteristic]: {
          ...prev.impactOnProtectedCharacteristics[characteristic],
          [field]: value
        }
      }
    }));
  };

  // Toggle visibility of a characteristic's details
  const toggleCharacteristic = (characteristic) => {
    if (visibleCharacteristic === characteristic) {
      setVisibleCharacteristic(null);
    } else {
      setVisibleCharacteristic(characteristic);
    }
  };

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      form1: {
        ...formData.form1,
        impactOnProtectedCharacteristics: formState.impactOnProtectedCharacteristics
      }
    });

    // Navigate to the next step
    navigate('/form1/step4');
  };

  // Define the characteristics
  const characteristics = [
    { id: 'age', label: 'Age' },
    { id: 'disability', label: 'Disability' },
    { id: 'genderReassignment', label: 'Gender reassignment' },
    { id: 'marriageCivilPartnership', label: 'Marriage/civil partnership' },
    { id: 'pregnancyMaternity', label: 'Pregnancy/maternity' },
    { id: 'race', label: 'Race' },
    { id: 'religionBelief', label: 'Religion/belief' },
    { id: 'sex', label: 'Sex' },
    { id: 'sexualOrientation', label: 'Sexual orientation' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
          <div className="bg-sw-red h-3 rounded-full" style={{ width: '33%' }}></div>
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
            <div className="text-xs text-center">Understanding Impact</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-sw-red flex items-center justify-center text-white text-sm mb-1">
              3
            </div>
            <div className="text-xs text-center">Impact on People</div>
          </div>
          {/* Additional steps would be displayed here */}
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-8">
        Step 3: Impact on People
      </h2>

      <div className="mb-6">
        <p className="text-lg">
          Think about how your project affects different groups. For each protected characteristic, 
          consider whether your work will have a positive, negative, or neutral impact, explain why, 
          and suggest improvements.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Protected Characteristics (Equality Act 2010)</h3>

        <div className="space-y-4">
          {characteristics.map((char) => (
            <div key={char.id} className="border rounded-lg overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
                onClick={() => toggleCharacteristic(char.id)}
              >
                <div className="flex items-center">
                  <span className="font-semibold text-lg">{char.label}</span>
                  <span className="ml-4 px-2 py-1 text-xs rounded-full bg-gray-200">
                    {formState.impactOnProtectedCharacteristics[char.id].impact === 'positive' && 'Positive'}
                    {formState.impactOnProtectedCharacteristics[char.id].impact === 'negative' && 'Negative'}
                    {formState.impactOnProtectedCharacteristics[char.id].impact === 'neutral' && 'Neutral'}
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform ${visibleCharacteristic === char.id ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {visibleCharacteristic === char.id && (
                <div className="p-4 border-t">
                  <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">Will this be positive, negative, or neutral?</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`impact-${char.id}`}
                          value="positive"
                          checked={formState.impactOnProtectedCharacteristics[char.id].impact === 'positive'}
                          onChange={() => handleImpactChange(char.id, 'positive')}
                          className="w-4 h-4 mr-2"
                        />
                        <span>Positive</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`impact-${char.id}`}
                          value="negative"
                          checked={formState.impactOnProtectedCharacteristics[char.id].impact === 'negative'}
                          onChange={() => handleImpactChange(char.id, 'negative')}
                          className="w-4 h-4 mr-2"
                        />
                        <span>Negative</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`impact-${char.id}`}
                          value="neutral"
                          checked={formState.impactOnProtectedCharacteristics[char.id].impact === 'neutral'}
                          onChange={() => handleImpactChange(char.id, 'neutral')}
                          className="w-4 h-4 mr-2"
                        />
                        <span>Neutral</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor={`reason-${char.id}`} className="block text-lg font-semibold mb-2">
                      Why?
                    </label>
                    <textarea
                      id={`reason-${char.id}`}
                      value={formState.impactOnProtectedCharacteristics[char.id].reason}
                      onChange={(e) => handleTextChange(char.id, 'reason', e.target.value)}
                      className="input-field w-full"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label htmlFor={`improvement-${char.id}`} className="block text-lg font-semibold mb-2">
                      How can we improve things?
                    </label>
                    <textarea
                      id={`improvement-${char.id}`}
                      value={formState.impactOnProtectedCharacteristics[char.id].improvement}
                      onChange={(e) => handleTextChange(char.id, 'improvement', e.target.value)}
                      className="input-field w-full"
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step2" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form1Step3;