import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { usePreserveId } from '../../hooks/usePreserveId';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step6 = () => {
	const navigate = useNavigate();
	const { navigateWithId } = usePreserveId();
	const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

	const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

	// Initialize form state with data from context or defaults
	const [formState, setFormState] = useState({
		socioEconomicImpact: formData.form1?.socioEconomicImpact || {
			helpPeopleWithFewerOpportunities: 'no',
			howItHelps: '',
			makeThingsHarder: 'no',
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
		const updated = { ...formState.socioEconomicImpact, [field]: value };
		setFormState(prev => ({ ...prev, socioEconomicImpact: updated }));
		// Sync to FormContext immediately so SaveButton always has current data
		updateFormData({ form1: { ...formData.form1, socioEconomicImpact: updated } });
	};

	const handleTextChange = (e) => {
		const { name, value } = e.target;
		const updated = { ...formState.socioEconomicImpact, [name]: value };
		setFormState(prev => ({ ...prev, socioEconomicImpact: updated }));
		// Sync to FormContext immediately so SaveButton always has current data
		updateFormData({ form1: { ...formData.form1, socioEconomicImpact: updated } });
	};

	const handleNext = async () => {
		const updatedData = {
			form1: {
				...formData.form1,
				socioEconomicImpact: formState.socioEconomicImpact
			}
		};

		commitStep(5, updatedData);

		const ft = formData.formType;
		const cs = formData.completedSteps?.[ft] || [];
		const savePayload = {
			...formData,
			...updatedData,
			completedSteps: { ...formData.completedSteps, [ft]: cs.includes(5) ? cs : [...cs, 5].sort((a, b) => a - b) },
		};

		try {
			const result = await apiService.saveAssessment(savePayload);
			if (!formData.assessmentId && result?.id) confirmDbSave(result.id);
		} catch (err) {
			console.warn('[AutoSave] Could not save to database:', err.message);
		}

		navigateWithId('/form1/step7');
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<ProgressBar
				steps={form1Steps}
				currentStep={5}
				completedSteps={formData.completedSteps?.form1 || []}
				formType={formData.formType}
				formData={formData}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Socio-economic impact
			</h2>
			{isReadOnly && (
				<p className="mb-6 text-sm text-gray-500">
					{formData.status === 'signed_off' ? 'This assessment has been submitted and cannot be edited.' : 'You have view-only access to this assessment.'}
				</p>
			)}

			<div className="bg-white rounded-lg shadow p-6 mb-8">
				<p className="text-lg mb-6">
					This section covers impacts of your work on socio-economic disadvantage.
				</p>

				{/* First Question */}
				<div className="mb-6">
					<label className="block text-lg font-semibold mb-4">
						Will your work help people with fewer socio-economic opportunities?
					</label>
					<div className="space-y-2">
						<div className="flex items-center">
							<input
								type="radio"
								id="helpYes"
								name="helpPeopleWithFewerOpportunities"
								value="yes"
								checked={formState.socioEconomicImpact.helpPeopleWithFewerOpportunities === 'yes'}
								onChange={() => handleRadioChange('helpPeopleWithFewerOpportunities', 'yes')}
								className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
							/>
							<label htmlFor="helpYes" className="ml-2">Yes</label>
						</div>
						<div className="flex items-center">
							<input
								type="radio"
								id="helpNo"
								name="helpPeopleWithFewerOpportunities"
								value="no"
								checked={formState.socioEconomicImpact.helpPeopleWithFewerOpportunities === 'no'}
								onChange={() => handleRadioChange('helpPeopleWithFewerOpportunities', 'no')}
								className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
							/>
							<label htmlFor="helpNo" className="ml-2">No</label>
						</div>
					</div>
				</div>

				{/* Conditional: If Yes - Show description field */}
				{formState.socioEconomicImpact.helpPeopleWithFewerOpportunities === 'yes' && (
					<div className="mb-6">
						<label htmlFor="howItHelps" className="block text-lg font-semibold mb-2">
							Describe how your work helps people with fewer socio-economic opportunities
						</label>
						<textarea
							id="howItHelps"
							name="howItHelps"
							value={formState.socioEconomicImpact.howItHelps}
							onChange={handleTextChange}
							readOnly={isReadOnly}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg"
							rows={3}
							placeholder="Describe how your work helps people with fewer socio-economic opportunities"
						/>
					</div>
				)}

				{/* Conditional: If No - Show follow-up question */}
				{formState.socioEconomicImpact.helpPeopleWithFewerOpportunities === 'no' && (
					<div className="mb-6">
						<label className="block text-lg font-semibold mb-4">
							Could it make things harder for people with lower socio-economic opportunities?
						</label>
						<div className="space-y-2">
							<div className="flex items-center">
								<input
									type="radio"
									id="harderYes"
									name="makeThingsHarder"
									value="yes"
									checked={formState.socioEconomicImpact.makeThingsHarder === 'yes'}
									onChange={() => handleRadioChange('makeThingsHarder', 'yes')}
									className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
								/>
								<label htmlFor="harderYes" className="ml-2">Yes</label>
							</div>
							<div className="flex items-center">
								<input
									type="radio"
									id="harderNo"
									name="makeThingsHarder"
									value="no"
									checked={formState.socioEconomicImpact.makeThingsHarder === 'no'}
									onChange={() => handleRadioChange('makeThingsHarder', 'no')}
									className={`w-4 h-4 mr-2${isReadOnly ? ' pointer-events-none' : ''}`}
								/>
								<label htmlFor="harderNo" className="ml-2">No</label>
							</div>
						</div>
					</div>
				)}

				{/* Final text box - always shown */}
				<div className="mb-6">
					<label htmlFor="improvements" className="block text-lg font-semibold mb-2">
						Is there anything about your work that could change to improve socio-economic opportunities or address inequalities?
					</label>
					<textarea
						id="improvements"
						name="improvements"
						value={formState.socioEconomicImpact.improvements}
						onChange={handleTextChange}
						readOnly={isReadOnly}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
						placeholder="Describe any changes that could improve socio-economic opportunities or address inequalities"
					/>
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<PrevButton onPrev={() => navigateWithId('/form1/step5')} />
				{!isReadOnly
					? <NextButton label="Next: Environment and biodiversity" onClick={handleNext} />
					: <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">Back to My Assessments</button>
				}
			</div>
		</div>
	);
};

export default Form1Step6;