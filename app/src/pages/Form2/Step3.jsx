import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ui/ProgressBar';
import { form2Steps } from './constants'; 

const Form2Step3 = () => {
  const navigate = useNavigate();
  const { formData, updateFormData, resetFormData } = useFormContext();

  const [formState, setFormState] = useState({
    review: formData.form2?.review || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

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

  const handleSubmit = async () => {
    // Update the global form data first
    updateFormData({
      form2: {
        ...formData.form2,
        review: formState.review,
      }
    });

    // Simulate submission process
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // In a real application, you would send the data to your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
      
      // Optionally reset the form data after successful submission
      // resetFormData();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was a problem submitting your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle clicking on a step in the progress bar
  const handleStepClick = (stepIndex) => {
    // Navigate to the appropriate step
    switch(stepIndex) {
      case 0:
        navigate('/form2/step1');
        break;
      case 1:
        navigate('/form2/step2');
        break;
      case 2:
        // Current step - do nothing
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <ProgressBar 
        steps={form2Steps} 
        currentStep={2} 
        completedSteps={formData.completedSteps?.form2 || []} 
        onStepClick={handleStepClick} 
      />

      <h2 className="text-3xl font-bold mb-8">
        Final Review
      </h2>

      {submitSuccess ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-green-800">Assessment successfully submitted!</h3>
              <p className="text-green-700 mt-2">
                Your Integrated Impact Assessment has been successfully submitted. You can now view your assessment in the completed assessments section.
              </p>
              <div className="mt-4">
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
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="review" className="block text-lg font-semibold mb-2">
              Use this space to detail the outcome of your work. What were the positive and negative impacts? Did you have to take any actions?
            </label>
            <textarea
              id="review"
              name="review"
              value={formState.review}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              rows={6}
              placeholder="Describe the outcomes, impacts, and any actions taken"
            />
          </div>
          
          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Submission Error</p>
              <p>{submitError}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 flex justify-between">
        <Link to="/form2/step2" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </Link>
        {!submitSuccess && (
          <button
            className="inline-flex items-center px-6 py-2 rounded-md text-sm bg-[--color-sw-red] text-white font-medium transition-colors duration-200 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default Form2Step3;