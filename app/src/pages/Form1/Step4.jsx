// src/pages/Form1/Step4.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step4 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, completeStep } = useFormContext();

  // Single text field for well-being response
  const [wellBeingResponse, setWellBeingResponse] = useState(
    formData.form1?.wellBeingResponse || ''
  );

  // Collapsible sections state
  const [showGoals, setShowGoals] = useState(true);
  const [showWaysOfWorking, setShowWaysOfWorking] = useState(false);

  // Redirect if form type is not set
  useEffect(() => {
    if (!formData.formType) {
      navigate('/form-selection');
    }
  }, [formData.formType, navigate]);

  const handleNext = () => {
    // Update the global form data
    updateFormData({
      form1: {
        ...formData.form1,
        wellBeingResponse: wellBeingResponse
      }
    });
    completeStep(6); // This is step 7 in the sequence (index 6)
    navigate('/form1/step5');
  };

  const handleStepClick = (stepIndex) => {
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

  const wellBeingGoals = [
    { label: 'Prosperity', description: 'Good jobs, fair pay, low carbon impact.' },
    { label: 'Resilience', description: 'Strong environment and nature.' },
    { label: 'Health', description: 'Better physical and mental well-being.' },
    { label: 'Cohesive Communities', description: 'Safe, connected places to live.' },
    { label: 'Global Responsibility', description: 'Helping beyond Wales.' },
    { label: 'Culture & Welsh Language*', description: 'Encouraging culture, arts, and Welsh language.' },
    { label: 'Equality', description: 'Everyone getting fair chances.' },
  ];

  const waysOfWorking = [
    { 
      title: 'Long Term', 
      description: 'The importance of balancing short-term needs with the need to safeguard the long-term needs.' 
    },
    { 
      title: 'Collaboration', 
      description: 'Acting in collaboration with any other organisation (or different parts of the body itself) that could help the body to meet its well-being objectives.' 
    },
    { 
      title: 'Involvement', 
      description: 'The importance of involving people with an interest in achieving the well-being goals and ensuring that those people reflect the diversity of the area which the body serves.' 
    },
    { 
      title: 'Prevention', 
      description: 'How acting to prevent problems occurring or getting worse may help public bodies meet their objectives.' 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <ProgressBar 
        steps={form1Steps} 
        currentStep={3} 
        completedSteps={formData.completedSteps?.form1 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Well-being for future generations
      </h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <p className="text-lg mb-4">
          This section covers impacts of your work on Well-being for future generations.
        </p>
        <p className="text-lg mb-4">
          Look through the lists below of well-being goals and our (Sport Wales') ways of working.
        </p>
        <p className="text-lg mb-4">
          Then think about how your piece of work relates to those goals, and the ways of working you'll use.
        </p>
        <p className="text-lg font-semibold">
          In the text box say:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>if your work will help achieve it,</li>
          <li>how it will help,</li>
          <li>what can be done to improve its contribution.</li>
        </ul>

        {/* Resources */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-bold mb-2">Resources</h3>
          <a href="#" className="text-blue-600 underline hover:text-blue-800">
            Well-being goals fact sheet
          </a>
        </div>

        {/* Well-being Goals - Collapsible */}
        <div className="border rounded-lg overflow-hidden mb-4">
          <button 
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setShowGoals(!showGoals)}
          >
            <h3 className="text-xl font-bold">Well-being goals</h3>
            <svg 
              className={`w-5 h-5 transition-transform ${showGoals ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showGoals && (
            <div className="p-4 border-t">
              <ul className="space-y-3">
                {wellBeingGoals.map((goal, index) => (
                  <li key={index}>
                    <strong>{goal.label}</strong> – {goal.description}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                <p className="text-sm">
                  <strong>*Note:</strong> We have a legal public duty to support Welsh language use. 
                  This means there is an additional Welsh language section in this form. You can add 
                  more details about any impacts your work has on Welsh language use there.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ways of Working - Collapsible */}
        <div className="border rounded-lg overflow-hidden mb-6">
          <button 
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
            onClick={() => setShowWaysOfWorking(!showWaysOfWorking)}
          >
            <h3 className="text-xl font-bold">Ways of working</h3>
            <svg 
              className={`w-5 h-5 transition-transform ${showWaysOfWorking ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showWaysOfWorking && (
            <div className="p-4 border-t">
              <div className="space-y-4">
                {waysOfWorking.map((way, index) => (
                  <div key={index}>
                    <h4 className="font-bold mb-1">{way.title}</h4>
                    <p className="text-gray-700">{way.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Text Box */}
        <div>
          <label htmlFor="wellBeingResponse" className="block text-lg font-semibold mb-2">
            Your response
          </label>
          <textarea
            id="wellBeingResponse"
            value={wellBeingResponse}
            onChange={(e) => setWellBeingResponse(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={10}
            placeholder="Describe how your work relates to the well-being goals and the ways of working you'll use. Include whether it will help achieve the goals, how it will help, and what can be done to improve its contribution."
          />
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form1/step6" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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
  );
};

export default Form1Step4;