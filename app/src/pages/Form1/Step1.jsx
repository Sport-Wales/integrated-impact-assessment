// src/pages/Form1/Step1.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step1 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, completeStep } = useFormContext();

	const [formState, setFormState] = useState({
		title: formData.title || '',
		leadName: formData.leadName || '',
		leadRole: formData.leadRole || '',
		otherPeople: formData.otherPeople || '',
		workDetails: formData.workDetails || '',
		affectedGroups: formData.form1?.affectedGroups || '',
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
			title: formState.title,
			leadName: formState.leadName,
			leadRole: formState.leadRole,
			otherPeople: formState.otherPeople,
			workDetails: formState.workDetails,
			form1: {
				...formData.form1,
				affectedGroups: formState.affectedGroups,
			}
		});

		// Mark this step as completed
		completeStep(0);

		// Navigate to the next step
		navigate('/form1/step2');
	};

	// Handle clicking on a step in the progress bar
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
			{/* Progress Bar */}
			<ProgressBar
				steps={form1Steps}
				currentStep={0}
				completedSteps={formData.completedSteps?.form1 || []}
				onStepClick={handleStepClick}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Enter basic details
			</h2>
			{/* <p className="mb-1">On this page you’ll:</p>
			<ul className="list-disc pl-6 mb-8">
				<li>identify the work you’re assessing the impacts of,</li>
				<li>say who is involved,</li>
				<li>describe the piece of work,</li>
			</ul> */}

			<div className="bg-white rounded-lg shadow p-6 space-y-6">
				<div>

					<label htmlFor="title" className="block text-lg font-semibold mb-2">
						Give this assessment a title
					</label>
					<p className="text-sm text-gray-600 mb-2">This should be something that identifies the work you’re assessing the impacts of</p>
					<input
						type="text"
						id="title"
						name="title"
						value={formState.title}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						required
					/>
				</div>

				<div>
					<label htmlFor="leadName" className="block text-lg font-semibold mb-2">
						Who is leading this assessment?
					</label>
					<p className="text-sm text-gray-600 mb-2">Your name and role</p>
					<input
						type="text"
						id="leadName"
						name="leadName"
						value={formState.leadName}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						required
						placeholder="Name"
					/>
				</div>

				<div className="mt-4">
					<input
						type="text"
						id="leadRole"
						name="leadRole"
						value={formState.leadRole}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						required
						placeholder="Role"
					/>
				</div>

				<div>
					<label htmlFor="otherPeople" className="block text-lg font-semibold mb-2">
						Who else is involved?
					</label>
					<p className="text-sm text-gray-600 mb-2">
						These people will be able to access to this assessment. Colleague, participants, or representatives you’re talking to about this work’s impact
					</p>
					<input
						type="text"
						id="otherPeople"
						name="otherPeople"
						value={formState.otherPeople}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
					/>
				</div>

				<div>
					<label htmlFor="workDetails" className="block text-lg font-semibold mb-2">
						What is this piece of work about?
					</label>
					<p className="text-sm text-gray-600 mb-2">
						Describe what you’re working on in a few sentences.
					</p>
					<textarea
						id="workDetails"
						name="workDetails"
						value={formState.workDetails}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={4}
					/>
				</div>

				<div>
					<label htmlFor="affectedGroups" className="block text-lg font-semibold mb-2">
						Who will be affected?
					</label>
					<p className="text-sm text-gray-600 mb-2">
						For example: staff, members of the public, athletes, Sport Wales’ partners, etc.
					</p>
					<textarea
						id="affectedGroups"
						name="affectedGroups"
						value={formState.affectedGroups}
						onChange={handleChange}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={4}
					/>
				</div>

				<div className="mt-12 flex justify-between">
					<PrevButton backLink="/form-introduction" />
					<NextButton label="Next: Known impacts" onClick={handleNext} />
				</div>
			</div>
		</div>
	);
};

export default Form1Step1;