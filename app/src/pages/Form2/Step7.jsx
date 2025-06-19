import { useState, useEffect } from 'react'
import { data, Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form2Steps } from './constants';

const Form2Step7 = () => {
  const navigate = useNavigate();
  const {formData, updateFormData, completeStep} = useFormContext();

  const [formState, setFormState] = useState({
    reviewDate: formData.form2?.reviewDate || '',
  });

const [isSubmitting, setIsSubmitting] = useState(false);
const [submitSuccess, setSubmitSuccess] = useState(false);
const [submitError, setSubmitError] = useState(null);

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

  const handleSubmit = async () => {
    // Update the global form data first
    updateFormData({
      form2: {
        ...formData.form2,
      }
	  
    });

	completeStep(3);
	setIsSubmitting(true);
  setSubmitError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was a problem submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

return (

  <div className="max-w-4xl mx-auto px-4 py-12">
    <ProgressBar 
        steps={form2Steps} 
        currentStep={3} 
        completedSteps={formData.completedSteps?.form2 || []} 
        onStepClick={handleStepClick} 
      />
	<h2 className="text-3xl font-bold mb-8">
      Step 3: Final Review
    </h2>

    {submitSuccess ? (
        <div className='bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8'> 
        <div className='flex items-center'>
            <div className='flex-shrink-0'>
                <svg className='h-8 w-8 text-green-500 ' fill='none' viewBox='0 0 24 24' stroke='currentColour'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth="2" d="MS 13l4 4L19 7"/>
                </svg>
            </div>
            <div className='ml-4'>
                <h3 className='text-lg font-medium text-green-8080'>Assessment successfully submitted!</h3>
                <p className='text-green-700 mt-2'>
                    Your Integrated Impact Assessment has been successfully submitted. You can now view your assessment in the completed assessments section.
                </p>
                <div className='mt-4'>
                    <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    </div>
    ) : (

    <div className="space-y-6">
      <div>
        <label htmlFor="reviewDate" className="block text-lg mb-2">
        When do you want to review this assessment?
        </label>
        <input
          type="date"
          id="reviewDate"
          name="reviewDate"
          value={formState.reviewDate}
          onChange={handleChange}
          className="input-field w-full my-4"
          rows={4}
        />
        <p className='font-sm text-gray-600 mb-2'> You will be automatically issued with a review notice after 12 months.</p>
      </div>
      {submitError && (
        <div className="mb-6 p-4  bg-red-50 border-l-4 border-red-500 text-red-700">
            <p className="font-medium"> Submission Error</p>
            <p>{submitError}</p>
        </div>
      )}
    </div>
    )}
    <div className='mt-12 flex justify-between'>
        <Link to ="/form2/step6" className='inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'>
        Prev
        </Link>
        {!submitSuccess && (
          <button
            className="inline-flex items-center px-6 py-2 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Assessment'
            )}
          </button>
        )}
    </div>
  </div>
    );
};

export default Form2Step7;