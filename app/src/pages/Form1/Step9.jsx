// src/pages/Form1/Step9.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';

const Form1Step9 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, completeStep } = useFormContext();

	// Initialize form state with data from context or defaults
	const [formState, setFormState] = useState({
		unexpectedHappened: formData.form1?.unexpectedHappened || '',
		needToChangeAnything: formData.form1?.needToChangeAnything || '',
	});

	// State for submission result
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [allStepsError, setAllStepsError] = useState(null);

	// Redirect if form type is not set
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
		const completedStepsLength = formData.completedSteps?.form1.length;
		const totalSteps = form1Steps.length - 1;

		if (completedStepsLength !== totalSteps) {
			setAllStepsError("All steps must be completed before submitting.");
			return;
		} else {
			setAllStepsError(null);
		}

		setIsSubmitting(true);

		// Update the global form data first
		updateFormData({
			form1: {
				...formData.form1,
				unexpectedHappened: formState.unexpectedHappened,
				needToChangeAnything: formState.needToChangeAnything,
			}
		});

		setSubmitError(null);

		try {
			// In a real application, you would send the data to your backend
			// For now, we'll simulate a successful submission after a delay
			await new Promise(resolve => setTimeout(resolve, 1500));

			setSubmitSuccess(true);

			// After successful submission, you might want to:
			// 1. Show a success message (which we're doing with submitSuccess state)
			// 2. Optionally reset the form (uncommenting the line below would do that)
			// resetFormData();

			// 3. Redirect to a completion page or back to the beginning
			// setTimeout(() => navigate('/'), 3000);
		} catch (error) {
			console.error('Error submitting form:', error);
			setSubmitError('There was a problem submitting your assessment. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStepClick = (stepIndex) => {
		// Navigate to the appropriate step
		switch (stepIndex) {
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
				currentStep={8}
				completedSteps={formData.completedSteps?.form1 || []}
				onStepClick={handleStepClick}
			/>

			{allStepsError && (
				<div className="mb-6 p-8 bg-red-50 border-l-4 border-red-500 text-red-700">
					<p className="font-large font-bold">Please Complete All Steps</p>
					<p>{allStepsError}</p>
				</div>
			)}

			<h2 className="text-3xl font-bold mb-8">
				Step 9: Final Review
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
				<div className="bg-white rounded-lg shadow p-6 mb-8">
					<div className="mb-6">
						<label htmlFor="unexpectedHappened" className="block text-lg font-semibold mb-2">
							Did anything unexpected happen?
						</label>
						<p className="text-sm text-gray-600 mb-2">Good or bad</p>
						<textarea
							id="unexpectedHappened"
							name="unexpectedHappened"
							value={formState.unexpectedHappened}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							rows={1}
							placeholder="Describe any unexpected outcomes or impacts that emerged during the assessment process"
						/>
					</div>

					<div className="mb-6">
						<label htmlFor="needToChangeAnything" className="block text-lg font-semibold mb-2">
							Do we need to change anything because of this?
						</label>
						<textarea
							id="needToChangeAnything"
							name="needToChangeAnything"
							value={formState.needToChangeAnything}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							rows={1}
							placeholder="Describe any adjustments or changes needed based on the findings"
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
				<Link to="/form1/step8" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
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

export default Form1Step9;