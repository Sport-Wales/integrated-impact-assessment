// src/pages/Form1/Step1.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step1 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

	const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

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
		setFormState(prev => ({ ...prev, [name]: value }));

		// Sync to FormContext immediately so SaveButton and localStorage
		// always reflect what the user has typed, not just what was committed on Next.
		if (['title', 'leadName', 'leadRole', 'otherPeople', 'workDetails'].includes(name)) {
			updateFormData({ [name]: value });
		} else if (name === 'affectedGroups') {
			updateFormData({ form1: { ...formData.form1, affectedGroups: value } });
		}
	};

	const handleNext = async () => {
		// Build updated data
		const updatedData = {
			title: formState.title,
			leadName: formState.leadName,
			leadRole: formState.leadRole,
			otherPeople: formState.otherPeople,
			workDetails: formState.workDetails,
			form1: {
				...formData.form1,
				affectedGroups: formState.affectedGroups,
			}
		};

		// Merge data + mark step complete in one pass; returns the exact
		// merged snapshot so the DB save payload is never stale.
		const dataToSave = commitStep(0, updatedData);

		// Save the accurate snapshot to the database in background (non-blocking).
		try {
			const result = await apiService.saveAssessment(dataToSave);
			
			// On first successful DB save: re-key localStorage entry under the real DB id
			if (!formData.assessmentId && result?.id) {
				confirmDbSave(result.id);
			}
		} catch (err) {
			// Silent fail — data is safe in localStorage
			console.warn('[AutoSave] Could not save to database:', err.message);
		}

		// Navigate to next step
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
			{isReadOnly && (
				<p className="mb-6 text-sm text-gray-500">
					{formData.status === 'signed_off' ? 'This assessment has been signed off and cannot be edited.' : 'You have view-only access to this assessment.'}
				</p>
			)}
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
						readOnly={isReadOnly}
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
						readOnly={isReadOnly}
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
						readOnly={isReadOnly}
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
						readOnly={isReadOnly}
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
						readOnly={isReadOnly}
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
						readOnly={isReadOnly}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={4}
					/>
				</div>

				<div className="mt-12 flex justify-between">
					<PrevButton backLink="/form-introduction" />
					{!isReadOnly
						? <NextButton label="Next: Known impacts" onClick={handleNext} />
						: <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">Back to My Assessments</button>
					}
				</div>
			</div>
		</div>
	);
};

export default Form1Step1;