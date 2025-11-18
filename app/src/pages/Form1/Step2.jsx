// src/pages/Form1/Step2.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step2 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, completeStep } = useFormContext();

	const [formState, setFormState] = useState({
		existingKnowledge: formData.form1?.existingKnowledge || '',
		missingInfo: formData.form1?.missingInfo || 'no',
		missingInfoDetails: formData.form1?.missingInfoDetails || '',
	});

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

	const handleNext = () => {
		// Update the global form data
		updateFormData({
			form1: {
				...formData.form1,
				existingKnowledge: formState.existingKnowledge,
				missingInfo: formState.missingInfo,
				missingInfoDetails: formState.missingInfoDetails,
			}
		});

		completeStep(1);
		navigate('/form1/step3');
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
				currentStep={1}
				completedSteps={formData.completedSteps?.form1 || []}
				onStepClick={handleStepClick}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Known impacts and strategies
			</h2>

			<div className="space-y-6">
				<div>
					<label htmlFor="existingKnowledge" className="block text-lg font-semibold mb-2">
						What do you already know?
					</label>
					<p className="text-gray-600 mb-2">
						What strategies for improving the impact of work like this do we already know?
					</p>
					<p className="text-gray-600 mb-2">
						This could be:
					</p>
					<ul className="text-gray-600 list-disc pl-6 mb-8">
						<li>things you or colleagues learnt from previous pieces of work,</li>
						<li>things discovered in past impact assessments</li>
					</ul>
					<textarea
						id="existingKnowledge"
						name="existingKnowledge"
						value={formState.existingKnowledge}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
					/>
				</div>

				<div>
					<label htmlFor="missingInfo" className="block text-lg font-semibold mb-2">
						Is there information you don’t have that could help this work?
					</label>
					<div className="space-y-2 my-4">
						<div className="flex items-center">
							<input
								type="radio"
								id="missingInfoYes"
								name="missingInfo"
								value="yes"
								checked={formState.missingInfo === 'yes'}
								onChange={handleChange}
								className="w-4 h-4 mr-2"
							/>
							<label htmlFor="missingInfoYes">Yes</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								id="missingInfoNo"
								name="missingInfo"
								value="no"
								checked={formState.missingInfo === 'no'}
								onChange={handleChange}
								className="w-4 h-4 mr-2"
							/>
							<label htmlFor="missingInfoNo">No, or unsure</label>
						</div>
					</div>
				</div>

				{formState.missingInfo === 'yes' && (
					<div>
						<label htmlFor="missingInfoDetails" className="block text-lg font-semibold mb-2">
							What could help you find out missing information?
						</label>
						<p className="text-gray-600 mb-2">
							This could be:
						</p>
						<ul className="text-gray-600 list-disc pl-6 mb-8">
							<li>looking up data,</li>
							<li>reviewing past impact assessments,</li>
							<li>talking to people and groups representing those affected by this work</li>
						</ul>
						<textarea
							id="missingInfoDetails"
							name="missingInfoDetails"
							value={formState.missingInfoDetails}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							rows={3}
						/>
					</div>
				)}

				<div className="mt-12 flex justify-between">
					<Link to="/form1/step1" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
						Prev
					</Link>
					<button
						className="inline-flex items-center px-6 py-1 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
						onClick={handleNext}
					>
						Next: People
					</button>
				</div>
			</div>
		</div>
	);
};

export default Form1Step2;