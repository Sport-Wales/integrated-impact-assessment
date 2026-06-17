// src/pages/Form1/Step7.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step7 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

	const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

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
		const updated = { ...formState.environmentalImpact, [field]: value };
		setFormState(prev => ({ ...prev, environmentalImpact: updated }));
		// Sync to FormContext immediately so SaveButton always has current data
		updateFormData({ form1: { ...formData.form1, environmentalImpact: updated } });
	};

	const handleTextChange = (e) => {
		const { name, value } = e.target;
		const updated = { ...formState.environmentalImpact, [name]: value };
		setFormState(prev => ({ ...prev, environmentalImpact: updated }));
		// Sync to FormContext immediately so SaveButton always has current data
		updateFormData({ form1: { ...formData.form1, environmentalImpact: updated } });
	};

	const handleNext = () => {
		const updatedData = {
			form1: {
				...formData.form1,
				environmentalImpact: formState.environmentalImpact
			}
		};

		const dataToSave = commitStep(6, updatedData);

		navigate('/form1/step8');

		apiService.saveAssessment(dataToSave)
			.then(result => {
				if (!formData.assessmentId && result?.id) {
					confirmDbSave(result.id);
				}
			})
			.catch(err => {
				console.warn('[AutoSave] Could not save to database:', err.message);
			});
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<ProgressBar
				steps={form1Steps}
				currentStep={6}
				completedSteps={formData.completedSteps?.form1 || []}
				formType={formData.formType}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Environment and biodiversity
			</h2>
			{isReadOnly && (
				<p className="mb-6 text-sm text-gray-500">
					{formData.status === 'signed_off' ? 'This assessment has been signed off and cannot be edited.' : 'You have view-only access to this assessment.'}
				</p>
			)}

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
								className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
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
								className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
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
							readOnly={isReadOnly}
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
									className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
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
									className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
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
						readOnly={isReadOnly}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
						placeholder="Describe any changes that could reduce harm and increase environmental benefits"
					/>
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<PrevButton backLink="/form1/step6" />
				{!isReadOnly
					? <NextButton label="Next: Submission" onClick={handleNext} />
					: <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">Back to My Assessments</button>
				}
			</div>
		</div>
	);
};

export default Form1Step7;