// src/pages/Form1/Step2.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step2 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

	const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

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
		setFormState(prev => ({ ...prev, [name]: value }));
		// Sync to FormContext immediately so SaveButton always has current data
		updateFormData({ form1: { ...formData.form1, [name]: value } });
	};

	const handleNext = async () => {
		// Build updated data
		const updatedData = {
			form1: {
				...formData.form1,
				existingKnowledge: formState.existingKnowledge,
				missingInfo: formState.missingInfo,
				missingInfoDetails: formState.missingInfoDetails,
			}
		};

		const dataToSave = commitStep(1, updatedData);

		try {
			const result = await apiService.saveAssessment(dataToSave);
			
			// Store returned ID on first save
			if (!formData.assessmentId && result?.id) {
				confirmDbSave(result.id);
			}
		} catch (err) {
			// Silent fail — data is safe in localStorage
			console.warn('[AutoSave] Could not save to database:', err.message);
		}

		// Navigate to next step
		navigate('/form1/step3');
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<ProgressBar
				steps={form1Steps}
				currentStep={1}
				completedSteps={formData.completedSteps?.form1 || []}
				formType={formData.formType}
			/>
			<h2 className="text-3xl font-bold mb-8">
				Known impacts and strategies
			</h2>
			{isReadOnly && (
				<p className="mb-6 text-sm text-gray-500">
					{formData.status === 'signed_off' ? 'This assessment has been signed off and cannot be edited.' : 'You have view-only access to this assessment.'}
				</p>
			)}
			<div className="bg-white rounded-lg shadow p-6 space-y-6">
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
						readOnly={isReadOnly}
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
								className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
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
								className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
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
							readOnly={isReadOnly}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							rows={3}
						/>
					</div>
				)}

				<div className="mt-12 flex justify-between">
					<PrevButton backLink="/form1/step1" />
					{!isReadOnly
						? <NextButton label="Next: People" onClick={handleNext} />
						: <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">Back to My Assessments</button>
					}
				</div>
			</div>
		</div>
	);
};

export default Form1Step2;