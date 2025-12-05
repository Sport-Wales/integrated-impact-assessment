// src/pages/Form1/Step3.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';
import NextButton from "../../components/ui/NextButton";
import PrevButton from "../../components/ui/PrevButton";

const Form1Step3 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, completeStep } = useFormContext();

	// Initialize form state with data from context or defaults
	const [formState, setFormState] = useState({
		impactOnProtectedCharacteristics: formData.form1?.impactOnProtectedCharacteristics || {
			age: { impact: ['neutral'], reason: '', improvement: '' },
			disability: { impact: ['neutral'], reason: '', improvement: '' },
			genderReassignment: { impact: ['neutral'], reason: '', improvement: '' },
			marriageCivilPartnership: { impact: ['neutral'], reason: '', improvement: '' },
			pregnancyMaternity: { impact: ['neutral'], reason: '', improvement: '' },
			race: { impact: ['neutral'], reason: '', improvement: '' },
			religionBelief: { impact: ['neutral'], reason: '', improvement: '' },
			sex: { impact: ['neutral'], reason: '', improvement: '' },
			sexualOrientation: { impact: ['neutral'], reason: '', improvement: '' },
		}
	});

	// Currently visible characteristic (collapsed view)
	const [visibleCharacteristic, setVisibleCharacteristic] = useState(null);

	// Redirect if form type is not set
	useEffect(() => {
		if (!formData.formType) {
			navigate('/form-selection');
		}
	}, [formData.formType, navigate]);

	// Handle change for impact radio buttons
	const handleImpactChange = (characteristic, value) => {
		const currentImpact = formState.impactOnProtectedCharacteristics[characteristic].impact;
		let updatedImpact = [...currentImpact];
		if (updatedImpact.includes(value)) {
			updatedImpact = updatedImpact.filter(impact => impact !== value);
		} else {
			updatedImpact.push(value);
		}

		setFormState(prev => ({
			...prev,
			impactOnProtectedCharacteristics: {
				...prev.impactOnProtectedCharacteristics,
				[characteristic]: {
					...prev.impactOnProtectedCharacteristics[characteristic],
					impact: updatedImpact,
				}
			}
		}));
	};

	// Handle change for text inputs
	const handleTextChange = (characteristic, field, value) => {
		setFormState(prev => ({
			...prev,
			impactOnProtectedCharacteristics: {
				...prev.impactOnProtectedCharacteristics,
				[characteristic]: {
					...prev.impactOnProtectedCharacteristics[characteristic],
					[field]: value
				}
			}
		}));
	};

	// Toggle visibility of a characteristic's details
	const toggleCharacteristic = (characteristic) => {
		if (visibleCharacteristic === characteristic) {
			setVisibleCharacteristic(null);
		} else {
			setVisibleCharacteristic(characteristic);
		}
	};

	const handleNext = () => {
		// Update the global form data
		updateFormData({
			form1: {
				...formData.form1,
				impactOnProtectedCharacteristics: formState.impactOnProtectedCharacteristics
			}
		});

		completeStep(2);
		navigate('/form1/step4');
	};

	// Define the characteristics
	const characteristics = [
		{ id: 'age', label: 'Age' },
		{ id: 'disability', label: 'Disability' },
		{ id: 'genderReassignment', label: 'Gender reassignment' },
		{ id: 'marriageCivilPartnership', label: 'Marriage/civil partnership' },
		{ id: 'pregnancyMaternity', label: 'Pregnancy/maternity' },
		{ id: 'race', label: 'Race' },
		{ id: 'religionBelief', label: 'Religion/belief' },
		{ id: 'sex', label: 'Sex' },
		{ id: 'sexualOrientation', label: 'Sexual orientation' },
	];

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
				currentStep={2}
				completedSteps={formData.completedSteps?.form1 || []}
				onStepClick={handleStepClick}
			/>

			<h2 className="text-3xl font-bold mb-8">
				People
			</h2>
			<p className="mb-1">This section covers impacts of your work on equality and people’s protected characteristics.</p>
			<p className="mb-1">Protected characteristics are a way of describing things that can lead to discrimination.</p>
			<p className="mb-1">Everybody has protected characteristics. So, avoiding harm to them and promoting equality helps everyone that our work affects.</p>
			<h3 className="text-xl font-bold mb-4">Resources</h3>
			<h3 className="text-xl font-bold mb-4">How to complete this section</h3>
			<p className="mb-1">Think about how your piece of work could affect different groups. Select each protected characteristic affected and:</p>
			<ul className="list-disc pl-6 mb-8">
				<li>select whether the impact is positive (will help people), or negative (might discriminate),</li>
				<li>describe how your piece of work affects people with this characteristic,</li>
				<li>if the impact is negative, say how you'll try to avoid this.</li>
			</ul>
			<p className="mb-1">You only need to fill out the sections for characteristics affected by this piece of work.</p>
			<p className="mb-1">You can skip characteristics not affected. They will appear as 'Neutral' when you submit this form).</p>
			<div className="bg-white rounded-lg shadow p-6 mb-8">
				<h3 className="text-xl font-bold mb-4">Protected Characteristics (Equality Act 2010)</h3>

				<div className="space-y-4">
					{characteristics.map((char) => (
						<div key={char.id} className="border rounded-lg overflow-hidden">
							<button
								className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
								onClick={() => toggleCharacteristic(char.id)}
							>
								<div className="flex items-center">
									<span className="font-semibold text-lg">{char.label}</span>
									{formState.impactOnProtectedCharacteristics[char.id].impact.includes('positive') && (
										<span className="ml-4 px-2 py-1 text-xs rounded-full bg-gray-200">
											Positive
										</span>
									)}
									{formState.impactOnProtectedCharacteristics[char.id].impact.includes('negative') && (
										<span className="ml-4 px-2 py-1 text-xs rounded-full bg-gray-200">
											Negative
										</span>
									)}
									{formState.impactOnProtectedCharacteristics[char.id].impact.includes('neutral') && (
										<span className="ml-4 px-2 py-1 text-xs rounded-full bg-gray-200">
											Neutral
										</span>
									)}
								</div>
								<svg
									className={`w-5 h-5 transition-transform ${visibleCharacteristic === char.id ? 'transform rotate-180' : ''}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
								</svg>
							</button>

							{visibleCharacteristic === char.id && (
								<div className="p-4 border-t">
									<div className="mb-4">
										<label className="block text-lg font-semibold mb-2">Will this be positive, negative, or neutral?</label>
										<div className="flex space-x-4">
											<label className="inline-flex items-center">
												<input
													type="checkbox"
													name={`impact-${char.id}`}
													value="positive"
													checked={formState.impactOnProtectedCharacteristics[char.id].impact.includes('positive')}
													onChange={() => handleImpactChange(char.id, 'positive')}
													className="w-4 h-4 mr-2"
												/>
												<span>Positive</span>
											</label>
											<label className="inline-flex items-center">
												<input
													type="checkbox"
													name={`impact-${char.id}`}
													value="negative"
													checked={formState.impactOnProtectedCharacteristics[char.id].impact.includes('negative')}
													onChange={() => handleImpactChange(char.id, 'negative')}
													className="w-4 h-4 mr-2"
												/>
												<span>Negative</span>
											</label>
											<label className="inline-flex items-center">
												<input
													type="checkbox"
													name={`impact-${char.id}`}
													value="neutral"
													checked={formState.impactOnProtectedCharacteristics[char.id].impact.includes('neutral')}
													onChange={() => handleImpactChange(char.id, 'neutral')}
													className="w-4 h-4 mr-2"
												/>
												<span>Neutral</span>
											</label>
										</div>
									</div>

									<div className="mb-4">
										<label htmlFor={`reason-${char.id}`} className="block text-lg font-semibold mb-2">
											Why?
										</label>
										<textarea
											id={`reason-${char.id}`}
											value={formState.impactOnProtectedCharacteristics[char.id].reason}
											onChange={(e) => handleTextChange(char.id, 'reason', e.target.value)}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg"
											rows={1}
										/>
									</div>

									<div>
										<label htmlFor={`improvement-${char.id}`} className="block text-lg font-semibold mb-2">
											How can we improve things?
										</label>
										<textarea
											id={`improvement-${char.id}`}
											value={formState.impactOnProtectedCharacteristics[char.id].improvement}
											onChange={(e) => handleTextChange(char.id, 'improvement', e.target.value)}
											className="w-full px-4 py-2 border border-gray-300 rounded-lg"
											rows={1}
										/>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<PrevButton backLink="/form1/step2" />
				<NextButton label="Next: Wellbeing and future generations" onClick={handleNext} />
			</div>
		</div>
	);
};

export default Form1Step3;