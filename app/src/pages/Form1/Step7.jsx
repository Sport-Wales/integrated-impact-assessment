// src/pages/Form1/Step7.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step7 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  // Initialize form state with data from context or defaults
  const [formState, setFormState] = useState({
    wellBeingGoals: formData.form1?.wellBeingGoals || {
      prosperity: { helps: 'no', how: '', improvements: '' },
      resilience: { helps: 'no', how: '', improvements: '' },
      health: { helps: 'no', how: '', improvements: '' },
      cohesiveCommunities: { helps: 'no', how: '', improvements: '' },
      globalResponsibility: { helps: 'no', how: '', improvements: '' },
      cultureAndWelshLanguage: { helps: 'no', how: '', improvements: '' },
      equality: { helps: 'no', how: '', improvements: '' },
    }
  });

  // Currently visible goal (collapsed view)
  const [visibleGoal, setVisibleGoal] = useState(null);

  // Redirect if form type is not set
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  // Handle change for 'helps' radio buttons
  const handleHelpsChange = (goal, value) => {
    setFormState(prev => ({
      ...prev,
      wellBeingGoals: {
        ...prev.wellBeingGoals,
        [goal]: {
          ...prev.wellBeingGoals[goal],
          helps: value
        }
      }
    }));
  };

  // Handle change for text inputs
  const handleTextChange = (goal, field, value) => {
    setFormState(prev => ({
      ...prev,
      wellBeingGoals: {
        ...prev.wellBeingGoals,
        [goal]: {
          ...prev.wellBeingGoals[goal],
          [field]: value
        }
      }
    }));
  };

  // Toggle visibility of a goal's details
  const toggleGoal = (goal) => {
    if (visibleGoal === goal) {
      setVisibleGoal(null);
    } else {
      setVisibleGoal(goal);
    }
  };

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      form1: {
        ...formData.form1,
        wellBeingGoals: formState.wellBeingGoals
      }
    });
	completeStep(6);
    navigate('/form1/step8');
  };

  // Define the goals
  const goals = [
    { id: 'prosperity', label: 'Prosperity', description: 'Good jobs, fair pay, low carbon impact' },
    { id: 'resilience', label: 'Resilience', description: 'Strong environment and nature' },
    { id: 'health', label: 'Health', description: 'Better physical and mental well-being' },
    { id: 'cohesiveCommunities', label: 'Cohesive Communities', description: 'Safe, connected places to live' },
    { id: 'globalResponsibility', label: 'Global Responsibility', description: 'Helping beyond Wales' },
    { id: 'cultureAndWelshLanguage', label: 'Culture & Welsh Language', description: 'Encouraging culture, arts, and Welsh language' },
    { id: 'equality', label: 'Equality', description: 'Everyone getting fair chances' },
  ];

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
        currentStep={6} 
        completedSteps={formData.completedSteps?.form1 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Step 7: Well-being & Future Generations
      </h2>

      <div className="mb-6">
        <p className="text-lg">
          For each goal, answer whether your work will help achieve it, how it will help, and what can be done to improve its contribution.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Well-being Goals</h3>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border rounded-lg overflow-hidden">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
                onClick={() => toggleGoal(goal.id)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{goal.label}</span>
                  <span className="text-sm text-gray-600">{goal.description}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4 px-2 py-1 text-xs rounded-full bg-gray-200">
                    {formState.wellBeingGoals[goal.id].helps === 'yes' ? 'Yes' : 'No'}
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${visibleGoal === goal.id ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>

              {visibleGoal === goal.id && (
                <div className="p-4 border-t">
                  <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">Will this help?</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`helps-${goal.id}`}
                          value="yes"
                          checked={formState.wellBeingGoals[goal.id].helps === 'yes'}
                          onChange={() => handleHelpsChange(goal.id, 'yes')}
                          className="w-4 h-4 mr-2"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`helps-${goal.id}`}
                          value="no"
                          checked={formState.wellBeingGoals[goal.id].helps === 'no'}
                          onChange={() => handleHelpsChange(goal.id, 'no')}
                          className="w-4 h-4 mr-2"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>                    
                  {formState.wellBeingGoals[goal.id].helps === 'yes' &&(
                    <div>
                    <div className="mb-4">
                    <label htmlFor={`how-${goal.id}`} className="block text-lg font-semibold mb-2">
                      How?
                    </label>
                    <textarea
                      id={`how-${goal.id}`}
                      value={formState.wellBeingGoals[goal.id].how}
                      onChange={(e) => handleTextChange(goal.id, 'how', e.target.value)}
                      className="input-field w-full"
                      rows={3}
                      placeholder={`Explain how your work will help with ${goal.label}`}
                    />
                  </div>

                  <div>
                    <label htmlFor={`improvements-${goal.id}`} className="block text-lg font-semibold mb-2">
                      What can we do to improve things?
                    </label>
                    <textarea
                      id={`improvements-${goal.id}`}
                      value={formState.wellBeingGoals[goal.id].improvements}
                      onChange={(e) => handleTextChange(goal.id, 'improvements', e.target.value)}
                      className="input-field w-full"
                      rows={3}
                      placeholder="Suggest improvements to maximize positive impact"
                    />
                  </div>
                  </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step6" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form1Step7;