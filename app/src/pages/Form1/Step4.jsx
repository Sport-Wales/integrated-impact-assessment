// src/pages/Form1/Step4.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import { usePreserveId } from '../../hooks/usePreserveId';
import { apiService } from '../../services/api';
import ProgressBar from '../../components/ui/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step4 = () => {
	const navigate = useNavigate();
	const { navigateWithId } = usePreserveId();
	const { formData, updateFormData, commitStep, confirmDbSave } = useFormContext();

	const isReadOnly = formData.status === 'signed_off' || formData.userRole === 'view';

	// Single text field for well-being response
	const [wellBeingResponse, setWellBeingResponse] = useState(
		formData.form1?.wellBeingResponse || ''
	);

	// Collapsible sections state
	const [showGoals, setShowGoals] = useState(true);
	const [showWaysOfWorking, setShowWaysOfWorking] = useState(false);

	// Redirect if form type is not set
	useEffect(() => {
		if (!formData.formType) {
			navigate('/form-selection');
		}
	}, [formData.formType, navigate]);

	const handleNext = async () => {
		const updatedData = {
			form1: {
				...formData.form1,
				wellBeingResponse: wellBeingResponse
			}
		};

		commitStep(3, updatedData);

		const ft = formData.formType;
		const cs = formData.completedSteps?.[ft] || [];
		const savePayload = {
			...formData,
			...updatedData,
			completedSteps: { ...formData.completedSteps, [ft]: cs.includes(3) ? cs : [...cs, 3].sort((a, b) => a - b) },
		};

		try {
			const result = await apiService.saveAssessment(savePayload);
			if (!formData.assessmentId && result?.id) confirmDbSave(result.id);
		} catch (err) {
			console.warn('[AutoSave] Could not save to database:', err.message);
		}

		navigateWithId('/form1/step5');
	};

	const wellBeingGoals = [
		{ label: 'Prosperity', description: 'Good jobs, fair pay, low carbon impact.' },
		{ label: 'Resilience', description: 'Strong environment and nature.' },
		{ label: 'Health', description: 'Better physical and mental well-being.' },
		{ label: 'Cohesive Communities', description: 'Safe, connected places to live.' },
		{ label: 'Global Responsibility', description: 'Helping beyond Wales.' },
		{ label: 'Culture & Welsh Language*', description: 'Encouraging culture, arts, and Welsh language.' },
		{ label: 'Equality', description: 'Everyone getting fair chances.' },
	];

	const waysOfWorking = [
		{
			title: 'Long Term',
			description: 'The importance of balancing short-term needs with the need to safeguard the long-term needs.'
		},
		{
			title: 'Collaboration',
			description: 'Acting in collaboration with any other organisation (or different parts of the body itself) that could help the body to meet its well-being objectives.'
		},
		{
			title: 'Involvement',
			description: 'The importance of involving people with an interest in achieving the well-being goals and ensuring that those people reflect the diversity of the area which the body serves.'
		},
		{
			title: 'Prevention',
			description: 'How acting to prevent problems occurring or getting worse may help public bodies meet their objectives.'
		},
	];

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<ProgressBar
				steps={form1Steps}
				currentStep={3}
				completedSteps={formData.completedSteps?.form1 || []}
				formType={formData.formType}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Well-being for future generations
			</h2>
			{isReadOnly && (
				<p className="mb-6 text-sm text-gray-500">
					{formData.status === 'signed_off' ? 'This assessment has been signed off and cannot be edited.' : 'You have view-only access to this assessment.'}
				</p>
			)}

			<div className="bg-white rounded-lg shadow p-6 mb-6">
				<p className="text-lg mb-4">
					This section covers impacts of your work on Well-being for future generations.
				</p>
				<p className="text-lg mb-4">
					Look through the lists below of well-being goals and our (Sport Wales') ways of working.
				</p>
				<p className="text-lg mb-4">
					Then think about how your piece of work relates to those goals, and the ways of working you'll use.
				</p>
				<p className="text-lg font-semibold">
					In the text box say:
				</p>
				<ul className="list-disc ml-6 mb-4">
					<li>if your work will help achieve it,</li>
					<li>how it will help,</li>
					<li>what can be done to improve its contribution.</li>
				</ul>

				{/* Resources */}
				<div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
					<h3 className="font-bold mb-2">Resources</h3>
					<a href="#" className="text-blue-600 underline hover:text-blue-800">
						Well-being goals fact sheet
					</a>
				</div>

				{/* Well-being Goals - Collapsible */}
				<div className="border rounded-lg overflow-hidden mb-4">
					<button
						className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
						onClick={() => setShowGoals(!showGoals)}
					>
						<h3 className="text-xl font-bold">Well-being goals</h3>
						<svg
							className={`w-5 h-5 transition-transform ${showGoals ? 'transform rotate-180' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>

					{showGoals && (
						<div className="p-4 border-t">
							<ul className="space-y-3">
								{wellBeingGoals.map((goal, index) => (
									<li key={index}>
										<strong>{goal.label}</strong> – {goal.description}
									</li>
								))}
							</ul>

							<div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
								<p className="text-sm">
									<strong>*Note:</strong> We have a legal public duty to support Welsh language use.
									This means there is an additional Welsh language section in this form. You can add
									more details about any impacts your work has on Welsh language use there.
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Ways of Working - Collapsible */}
				<div className="border rounded-lg overflow-hidden mb-6">
					<button
						className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
						onClick={() => setShowWaysOfWorking(!showWaysOfWorking)}
					>
						<h3 className="text-xl font-bold">Ways of working</h3>
						<svg
							className={`w-5 h-5 transition-transform ${showWaysOfWorking ? 'transform rotate-180' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>

					{showWaysOfWorking && (
						<div className="p-4 border-t">
							<div className="space-y-4">
								{waysOfWorking.map((way, index) => (
									<div key={index}>
										<h4 className="font-bold mb-1">{way.title}</h4>
										<p className="text-gray-700">{way.description}</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Main Text Box */}
				<div>
					<label htmlFor="wellBeingResponse" className="block text-lg font-semibold mb-2">
						Your response
					</label>
					<textarea
						id="wellBeingResponse"
						value={wellBeingResponse}
						onChange={(e) => {
							setWellBeingResponse(e.target.value);
							// Sync to FormContext immediately so SaveButton always has current data
							updateFormData({ form1: { ...formData.form1, wellBeingResponse: e.target.value } });
						}}
						readOnly={isReadOnly}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={10}
						placeholder="Describe how your work relates to the well-being goals and the ways of working you'll use. Include whether it will help achieve the goals, how it will help, and what can be done to improve its contribution."
					/>
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<PrevButton onPrev={() => navigateWithId('/form1/step3')} />
				{!isReadOnly
					? <NextButton label="Next: Welsh language" onClick={handleNext} />
					: <button onClick={() => navigate('/')} className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-[--color-sw-blue] text-white hover:bg-cyan-700">Back to My Assessments</button>
				}
			</div>
		</div>
	);
};

export default Form1Step4;