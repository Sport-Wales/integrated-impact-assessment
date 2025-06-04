import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form2Step6 = () => {
    const navigate = useNavigate();
    const {formData, updateFormData} = useFormContext();

  const [formState, setFormState] = useState({
    actionsAndNextSteps: formData.form2?.actionsAndNextSteps || '',
  });

  useEffect(() => {
    if(!formData.formType){
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
    updateFormData({
        form2: {
          ...formData.form2,
          actionsAndNextSteps: formState.actionsAndNextSteps,

        }
    });
    navigate('/form2/step7')
  };

  return(
    <div className='max-w-4xl mx-auto px-4 py-12'>
      <h2 className='text-3xl font-bold mb-8'>
        Step 3: Actions and Next Steps
      </h2>

    <div className='space-y-6'>
      <p className='text-lg mb-2'>
        Detail your next steps and any actions you need to take as a result of completing this assessment.
      </p>

     <div>
      <textarea
      id="actionsAndNextSteps" 
      name="actionsAndNextSteps"
      value={formState.actionsAndNextSteps}
      onChange={handleChange}
      className='input-field w-full my-4'
      rows={4}
      />
    </div>
  </div>

  <div className='mt-12 flex justify-between'>
    <Link to="/form2/step5" className='inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'>
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

export default Form2Step6;