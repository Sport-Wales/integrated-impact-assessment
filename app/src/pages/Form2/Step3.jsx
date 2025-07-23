import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form2Steps } from './constants';

const Form2Step3 = () => {
  const navigate = useNavigate();
  const {formData, updateFormData, completeStep } = useFormContext();

  const [formState, setFormState] = useState({
    environmentAndBiodiversity: formData.form2?.environmentAndBiodiversity || '',
    environmentAndBiodiversityNotApplicable: formData.form2?.environmentAndBiodiversityNotApplicable || 'false',
  });

  useEffect(() =>{
  if (!formData.formType){
    navigate('/form-selection');
  }
  }, [formData.formType, navigate]);


  const handleTextChange = (e) => {
    const {value} = e.target;
    setFormState(prev => ({
      ...prev,
      environmentAndBiodiversity: value,
      environmentAndBiodiversityNotApplicable: 'false',
    }));
  };

  const handleRadioChange = () => {
    setFormState(prev => ({
      ...prev,
      environmentAndBiodiversity: '',
      environmentAndBiodiversityNotApplicable: 'true'
    }));
  };

  const handleNext = () => {
    updateFormData({
        form2: {
            ...formData.form2,
            environmentAndBiodiversity: formState.environmentAndBiodiversity,
            environmentAndBiodiversityNotApplicable: formState.environmentAndBiodiversityNotApplicable,
        }
    });

	completeStep(1);

    navigate('/form2/step4')
  };

  const handleStepClick = (stepIndex) => {
    // Navigate to the appropriate step
    switch(stepIndex) {
      case 0:
        // Current step - do nothing
        break;
      case 1:
        navigate('/form2/step2');
        break;
      case 2:
        navigate('/form2/step3');
        break;
      case 3:
        navigate('/form2/step4');
        break;
      default:
        break;
    }
  };

  return(
    <div className='max-w-4xl mx-auto px-4 py-12'>
		<ProgressBar 
        steps={form2Steps} 
        currentStep={1} 
        completedSteps={formData.completedSteps?.form2 || []} 
        onStepClick={handleStepClick} 
      />
      <h2 className='text-3xl font-bold mb-8'>
        Step 2: Your Impact
      </h2>

    <div className='space-y-6'>
       <p className='font-sm text-gray-600 mb-2'>
          In this section you should read the short background about each area and detail your approach to any positive or negative impacts. If there is no impact you can click the box for ‘not applicable’.
       </p>

      <div>
        <label htmlFor="environmentAndBiodiversity" className='block font-lg font-semibold mb-2'>
          Environment and Biodiversity
        </label>
        <p className='font-sm text-gray-600 mb-2'>
          Write about how this work will impact on the environment
        </p>
        <textarea 
        id="environmentAndBiodiversity"
        name="environmentAndBiodiversity" 
        value={formState.environmentAndBiodiversity}
        onChange={handleTextChange}
        className='w-full px-4 py-2 border border-gray-300 rounded-lg'
        rows={1}
        />
      </div>

      <div className='space-y-6'>
        <div className='flex items-center'>
          <input
          type="radio" 
          id="environmentAndBiodiversityNotApplicable"
          name="environmentAndBiodiversityNotApplicable"
          value="true"
          checked={formState.environmentAndBiodiversityNotApplicable === "true"}
          onChange={handleRadioChange}
          className='w-4 h-4 mr-2'
           />
           <label htmlFor="environmentAndBiodiversityNotApplicable"> Not applicable</label>
        </div>
      </div>
    </div>

    <div className='mt-12 flex justify-between'>
      <Link to="/form2/step2" className='inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'>
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

export default Form2Step3;