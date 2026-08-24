// src/pages/Form1/Step10.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { usePreserveId } from '../../hooks/usePreserveId';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import { getReviewAvailability } from '../../utils/reviewGate';

const Form1Step10 = () => {
	const navigate = useNavigate();
	const { navigateWithId } = usePreserveId();
	const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

	const isViewOnly = formData.userRole === 'view';
	const alreadyReviewed = !!formData.reviewedAt;
	const reviewGate = getReviewAvailability(formData);
	const isReadOnly = isViewOnly || !reviewGate.isAvailable || alreadyReviewed;

	const reviewLockedMessage = !reviewGate.isSubmitted
		? 'This assessment must be submitted before it can be reviewed.'
		: !reviewGate.isAvailable
			? `Review will be available from ${reviewGate.availableFrom.toLocaleDateString('en-GB')}.`
			: alreadyReviewed
				? 'This review has already been completed.'
				: 'You have view-only access to this assessment.';

	const [formState, setFormState] = useState({
		unexpectedHappened:   formData.form1?.unexpectedHappened   || '',
		needToChangeAnything: formData.form1?.needToChangeAnything || '',
	});

	useEffect(() => {
		if (!formData.formType) {
			navigate('/form-selection');
		}
	}, [formData.formType, navigate]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormState(prev => ({ ...prev, [name]: value }));
		updateFormData({ form1: { ...formData.form1, [name]: value } });
	};

	// Save this step's data to localStorage + DB in background, then return to workspace
	const handleDone = async () => {
		const updatedData = {
			form1: {
				...formData.form1,
				unexpectedHappened:   formState.unexpectedHappened,
				needToChangeAnything: formState.needToChangeAnything,
			},
			reviewedAt: new Date().toISOString(),
		};

		commitStep(9, updatedData);

		// Write reviewedAt directly to localStorage before saving
		const localId = formData.localId;
		if (localId) {
			try {
				const raw = localStorage.getItem('iia_assessments');
				const store = raw ? JSON.parse(raw) : {};
				if (store[localId]) {
					store[localId] = { ...store[localId], reviewedAt: new Date().toISOString() };
					localStorage.setItem('iia_assessments', JSON.stringify(store));
				}
			} catch { /* safe to ignore */ }
		}

		const ft = formData.formType;
		const cs = formData.completedSteps?.[ft] || [];
		const savePayload = {
			...formData,
			...updatedData,
			completedSteps: { ...formData.completedSteps, [ft]: cs.includes(9) ? cs : [...cs, 9].sort((a, b) => a - b) },
		};

		try {
			const result = await apiService.saveAssessment(savePayload);
			if (!formData.assessmentId && result?.id) confirmDbSave(result.id);
		} catch (err) {
			console.warn('[AutoSave] Step10 DB save failed. Data is safe in localStorage.', err.message);
		}

		navigate('/');
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<ProgressBar
				steps={form1Steps}
				currentStep={9}
				completedSteps={formData.completedSteps?.form1 || []}
				formType={formData.formType}
				formData={formData}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Step 9: Final Review
			</h2>
			  <p className="mb-6 text-sm text-gray-500">
				This is a review of the project after it has been completed.

				</p>

			{isReadOnly && (
				<p className="mb-6 text-sm text-gray-500">
					{reviewLockedMessage}
				</p>
			)}

			<div className="bg-white rounded-lg shadow p-6 mb-8">
				<div className="mb-6">
					<label htmlFor="unexpectedHappened" className="block text-lg font-semibold mb-2">
						Did anything unexpected happen during your project?
					</label>
					<p className="text-sm text-gray-600 mb-2">Good or bad</p>
					<textarea
						id="unexpectedHappened"
						name="unexpectedHappened"
						value={formState.unexpectedHappened}
						onChange={handleChange}
						readOnly={isReadOnly}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
						placeholder="Describe any unexpected outcomes or impacts as a result of your project"
					/>
				</div>

				<div className="mb-6">
					<label htmlFor="needToChangeAnything" className="block text-lg font-semibold mb-2">
						Should Sport Wales make any changes based on the outcomes?
					</label>
					<textarea
						id="needToChangeAnything"
						name="needToChangeAnything"
						value={formState.needToChangeAnything}
						onChange={handleChange}
						readOnly={isReadOnly}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
						placeholder="Describe any adjustments or changes needed within Sport Wales as a result of your project based on your project's outcomes"
					/>
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<button
				onClick={() => navigateWithId('/form1/step9')}
				className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
			>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
				</svg>
				Prev
			</button>
				{!isReadOnly && (
					<button
						onClick={handleDone}
						className="inline-flex items-center px-6 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700 transition-colors duration-200"
					>
						Save & Back to My Assessments
					</button>
				)}
				{isReadOnly && (
					<button
						onClick={() => navigate('/')}
						className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700"
					>
						Back to My Assessments
					</button>
				)}
			</div>
		</div>
	);
};

export default Form1Step10;
