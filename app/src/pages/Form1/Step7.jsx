// src/pages/Form1/Step7.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step7 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, completeStep } = useFormContext();

	// Initialize form state with data from context or defaults
	const [formState, setFormState] = useState({
		environmentalImpact: formData.form1?.environmentalImpact || {
			helpNatureAndEnvironment: 'no',
			howItHelps: '',
			harmNature: 'no',
			improvements: '',
		}
	});

	// Redirect if form type is not set
	useEffect(() => {
		if (!formData.formType) {
			navigate('/form-selection');
		}
	}, [formData.formType, navigate]);

	const handleRadioChange = (field, value) => {
		setFormState(prev => ({
			...prev,
			environmentalImpact: {
				...prev.environmentalImpact,
				[field]: value
			}
		}));
	};

	const handleTextChange = (e) => {
		const { name, value } = e.target;
		setFormState(prev => ({
			...prev,
			environmentalImpact: {
				...prev.environmentalImpact,
				[name]: value
			}
		}));
	};

	const handleNext = () => {
		// Update the global form data
		updateFormData({
			form1: {
				...formData.form1,
				environmentalImpact: formState.environmentalImpact
			}
		});

		completeStep(6);
		navigate('/form1/step8');
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
				currentStep={6}
				completedSteps={formData.completedSteps?.form1 || []}
				onStepClick={handleStepClick}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Environment and biodiversity
			</h2>

			<div className="bg-white rounded-lg shadow p-6 mb-8">
				<p className="text-lg mb-6">
					This section covers impacts of your work on the environment and biodiversity.
				</p>

				{/* First Question */}
				<div className="mb-6">
					<label className="block text-lg font-semibold mb-4">
						Will this help the natural environment or biodiversity?
					</label>
					<div className="space-y-2">
						<div className="flex items-center">
							<input
								type="radio"
								id="helpNatureYes"
								name="helpNatureAndEnvironment"
								value="yes"
								checked={formState.environmentalImpact.helpNatureAndEnvironment === 'yes'}
								onChange={() => handleRadioChange('helpNatureAndEnvironment', 'yes')}
								className="w-4 h-4 mr-2"
							/>
							<label htmlFor="helpNatureYes" className="ml-2">Yes</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								id="helpNatureNo"
								name="helpNatureAndEnvironment"
								value="no"
								checked={formState.environmentalImpact.helpNatureAndEnvironment === 'no'}
								onChange={() => handleRadioChange('helpNatureAndEnvironment', 'no')}
								className="w-4 h-4 mr-2"
							/>
							<label htmlFor="helpNatureNo" className="ml-2">No</label>
						</div>
					</div>
				</div>

				{/* Conditional: If Yes - Show description field */}
				{formState.environmentalImpact.helpNatureAndEnvironment === 'yes' && (
					<div className="mb-6">
						<label htmlFor="howItHelps" className="block text-lg font-semibold mb-2">
							Describe how your work positively impacts the environment or biodiversity
						</label>
						<textarea
							id="howItHelps"
							name="howItHelps"
							value={formState.environmentalImpact.howItHelps}
							onChange={handleTextChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							rows={3}
							placeholder="Describe how your work positively impacts the environment or biodiversity"
						/>
					</div>
				)}

				{/* Conditional: If No - Show follow-up question */}
				{formState.environmentalImpact.helpNatureAndEnvironment === 'no' && (
					<div className="mb-6">
						<label className="block text-lg font-semibold mb-4">
							Could it harm the natural environment or biodiversity?
						</label>
						<div className="space-y-2">
							<div className="flex items-center">
								<input
									type="radio"
									id="harmNatureYes"
									name="harmNature"
									value="yes"
									checked={formState.environmentalImpact.harmNature === 'yes'}
									onChange={() => handleRadioChange('harmNature', 'yes')}
									className="w-4 h-4 mr-2"
								/>
								<label htmlFor="harmNatureYes" className="ml-2">Yes</label>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									id="harmNatureNo"
									name="harmNature"
									value="no"
									checked={formState.environmentalImpact.harmNature === 'no'}
									onChange={() => handleRadioChange('harmNature', 'no')}
									className="w-4 h-4 mr-2"
								/>
								<label htmlFor="harmNatureNo" className="ml-2">No</label>
							</div>
						</div>
					</div>
				)}

				{/* Final text box - always shown */}
				<div className="mb-6">
					<label htmlFor="improvements" className="block text-lg font-semibold mb-2">
						Is there anything about your work that could change to reduce harm and increase environmental benefits?
					</label>
					<textarea
						id="improvements"
						name="improvements"
						value={formState.environmentalImpact.improvements}
						onChange={handleTextChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
						placeholder="Describe any changes that could reduce harm and increase environmental benefits"
					/>
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<PrevButton backLink="/form1/step6" />
				<NextButton label="Next: Submission" onClick={handleNext} />
			</div>
		</div>
	);
};

export default Form1Step7;