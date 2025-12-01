import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';
import ProgressBar from '../../components/ProgressBar';
import { form1Steps } from './constants';

const Form1Step6 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData, completeStep } = useFormContext();

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
		setFormState(prev => ({
			...prev,
			socioEconomicImpact: {
				...prev.socioEconomicImpact,
				[field]: value
			}
		}));
	};

	const handleTextChange = (e) => {
		const { name, value } = e.target;
		setFormState(prev => ({
			...prev,
			socioEconomicImpact: {
				...prev.socioEconomicImpact,
				[name]: value
			}
		}));
	};

	const handleNext = () => {
		// Update the global form data
		updateFormData({
			form1: {
				...formData.form1,
				socioEconomicImpact: formState.socioEconomicImpact
			}
		});

		completeStep(5);
		navigate('/form1/step7');
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
				currentStep={5}
				completedSteps={formData.completedSteps?.form1 || []}
				onStepClick={handleStepClick}
			/>

			<h2 className="text-3xl font-bold mb-8">
				Socio-economic impact
			</h2>

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
								className="w-4 h-4 mr-2"
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
								className="w-4 h-4 mr-2"
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
									className="w-4 h-4 mr-2"
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
									className="w-4 h-4 mr-2"
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
						className="w-full px-4 py-2 border border-gray-300 rounded-lg"
						rows={3}
						placeholder="Describe any changes that could improve socio-economic opportunities or address inequalities"
					/>
				</div>
			</div>

			<div className="mt-12 flex justify-between">
				<Link to="/form1/step5" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
					</svg>
					Prev
				</Link>
				<button
					className="inline-flex items-center px-6 py-2 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
					onClick={handleNext}
				>
					Next: Environment and biodiversity
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default Form1Step6;