import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form2Step5 = () => {
  const navigate = useNavigate();
  const {formData, updateFormData} = useFormContext();

  const [formState, setFormState] = useState({
    wellbeingOfFutureGenerations: formData.form2?.wellbeingOfFutureGenerations || {
      prosperity: '',
      resilience: '',
      health: '',
      cohesiveCommunities: '',
      globalResponsibility: '',
      cultureAndWelshLanguage: '',
      equality: '',
    },
    wellbeingOfFutureGenerationsNotApplicable: formData.form2?.wellbeingOfFutureGenerationsNotApplicable || 'false',
  });

  const [visibleWellbeingGoal, setVisibleWellbeingGoal] = useState(null);

  useEffect(() =>{
   if(!formData.formType){
    navigate('/form-selection');
   }
  },[formData.formType, navigate])

    const handleWellbeingChange = (goals, value) => {
    setFormState(prev => ({
      ...prev,
      wellbeingOfFutureGenerations: {
        ...prev.wellbeingOfFutureGenerations,
        [goals]: {
          ...prev.wellbeingOfFutureGenerations[goals],
          applicable: value
        }
      }
    }));
  };

    // Handle change for text inputs
  const handleTextChange = (goals, field, value) => {
    setFormState(prev => ({
      ...prev,
      wellbeingOfFutureGenerations: {
        ...prev.wellbeingOfFutureGenerations,
        [goals]: {
          ...prev.wellbeingOfFutureGenerations[goals],
          [field]: value
        }
      }
    }));
  };

  const toggleGoals = (goals) => {
    if (visibleWellbeingGoal === goals) {
      setVisibleWellbeingGoal(null);
    } else {
      setVisibleWellbeingGoal(goals);
    }
  };

  const handleNext = () => {
    updateFormData({
        form2:{
          ...formData.form2,
          wellbeingOfFutureGenerations: formState.wellbeingOfFutureGenerations,
          wellbeingOfFutureGenerationsNotApplicable: formState.wellbeingOfFutureGenerationsNotApplicable,
        }
    });
    navigate('/form2/step6')
  };


  const goals = [
    { id: 'prosperity', label: 'Prosperity' },
    { id: 'resilience', label: 'Resilience' },
    { id: 'health', label: 'Health' },
    { id: 'cohesiveCommunities', label: 'Cohesive Communities' },
    { id: 'globalResponsibility', label: 'Global Responsibility' },
    { id: 'cultureAndWelshLanguage', label: 'Culture And Welsh Language' },
    { id: 'equality', label: 'Equality' },
  ];



  return(
    <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold mb-8">
        Step 2: Your Impact
      </h2>

      <div className="mb-6">
        <p className="text-lg">
          In this section you should read the short background about each area and detail your approach to any positive or negative impacts. If there is no impact you can click the box for ‘not applicable’. 
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Well-being of Future Generations</h3>
        <p className='font-sm text-gray-600 mb-4'>
          Write about how this work will impact on any of the Wellbeing goals of the Future Generations Act:</p>
          <p className='font-sm text-gray-600 mb-4'>
          <ul className='ml-7 list-disc'>
            <li>Prosperity (Good jobs, fair pay, low carbon impact)</li>
            <li>Resilience (Strong environment and nature)</li>
            <li>Health (Better physical and mental well-being)</li>
            <li>Cohesive Communities (Safe, connected places to live)</li>
            <li>Global Responsibility (Helping beyond Wales)</li>
            <li>Culture & Welsh Language (Encouraging culture, arts, and Welsh language)</li>
            <li>Equality (Everyone getting fair chances)</li>
          </ul>
        </p>

      <div className="space-y-4">
        {goals.map((char) => (
          <div key={char.id} className='border rounded-lg overflow-hidden'>
            <button
            className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
                onClick={() => toggleGoals(char.id)}
            >
            <div className="flex items-center">
                  <span className="font-semibold text-lg">{char.label}</span>
                </div>
                <svg 
                  className={`w-5 h-5 transition-transform ${visibleWellbeingGoal === char.id ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {visibleWellbeingGoal === char.id && (
                <div className="p-4 border-t">
                  <div className="mb-4">
                    <div className="flex space-x-4">
                  <div className="mb-4 w-full">
                    <textarea
                      id={`reason-${char.id}`}
                      value={formState.wellbeingOfFutureGenerations[char.id].reason}
                      onChange={(e) => handleTextChange(char.id, 'reason', e.target.value)}
                      className="mt-2 input-field w-full"
                      rows={3}
                    />
                      </div>                      
                    </div>
                  </div>
                <div className='space-y-6'>
                  <div className='flex items-center'>
                    <input 
                    type="radio" 
                    id="wellbeingOfFutureGenerationsNotApplicable"
                    name="wellbeingOfFutureGenerations"
                    value="false"
                    checked={formState.wellbeingOfFutureGenerations[char.id].applicable === "false"}
                    onChange={() => handleWellbeingChange(char.id, 'false')}
                    className='w-4 h-4 mr-2'
                    />
                    <label htmlFor="wellbeingOfFutureGenerationsNotApplicable"> Not applicable</label>
                  </div>
                 </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex justify-between">
        <Link to="/form2/step4" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form2Step5;