// src/context/FormContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
	// Get form data from localStorage if available
	const getInitialState = () => {
		const savedFormData = localStorage.getItem('formData');
		return savedFormData ? JSON.parse(savedFormData) : {
			formType: null, // 'form1', 'form2', or 'form3'

			// Common fields for all forms
			title: '',
			leadName: '',
			leadRole: '',
			otherPeople: '',
			workDetails: '',

			// Form 1 fields
			form1: {
				affectedGroups: '',
				existingKnowledge: '',
				missingInfo: 'no',
				missingInfoDetails: '',
				impactOnProtectedCharacteristics: {
					age: { impact: 'neutral', reason: '', improvement: '' },
					disability: { impact: 'neutral', reason: '', improvement: '' },
					genderReassignment: { impact: 'neutral', reason: '', improvement: '' },
					marriageCivilPartnership: { impact: 'neutral', reason: '', improvement: '' },
					pregnancyMaternity: { impact: 'neutral', reason: '', improvement: '' },
					race: { impact: 'neutral', reason: '', improvement: '' },
					religionBelief: { impact: 'neutral', reason: '', improvement: '' },
					sex: { impact: 'neutral', reason: '', improvement: '' },
					sexualOrientation: { impact: 'neutral', reason: '', improvement: '' },
				},
				socioEconomicImpact: {
					helpPeopleWithFewerOpportunities: 'no',
					createProblems: 'no',
					improvements: '',
				},
				environmentalImpact: {
					helpNatureAndEnvironment: 'no',
					harmNature: 'no',
					improvements: '',
				},
				welshLanguage: {
					supportWelshLanguage: 'no',
					hardForWelshSpeakers: 'no',
					improvements: '',
				},
				wellBeingGoals: {
					prosperity: { helps: 'no', how: '', improvements: '' },
					resilience: { helps: 'no', how: '', improvements: '' },
					health: { helps: 'no', how: '', improvements: '' },
					cohesiveCommunities: { helps: 'no', how: '', improvements: '' },
					globalResponsibility: { helps: 'no', how: '', improvements: '' },
					cultureAndWelshLanguage: { helps: 'no', how: '', improvements: '' },
					equality: { helps: 'no', how: '', improvements: '' },
				},
				actionsAndNextSteps: '',
				reviewDate: '',
				responsiblePerson: '',
				finalReview: '',
				unexpectedHappened: '',
				needToChangeAnything: '',
			},

			// Form 2 fields
			form2: {
				impactOnPeople: '',
				impactOnPeopleNotApplicable: false,
				socioEconomicImpact: '',
				socioEconomicImpactNotApplicable: false,
				environmentAndBiodiversity: '',
				environmentAndBiodiversityNotApplicable: false,
				welshLanguage: '',
				welshLanguageNotApplicable: false,
				wellbeingOfFutureGenerations: {
					prosperity: '',
					resilience: '',
					health: '',
					cohesiveCommunities: '',
					globalResponsibility: '',
					cultureAndWelshLanguage: '',
					equality: '',
				},
				wellbeingOfFutureGenerationsNotApplicable: false,
				actionsAndNextSteps: '',
				reviewDate: '',
			},

			// Form 3 fields
			form3: {
				assessment: '',
				review: '',
			}
		};
	};

	const [formData, setFormData] = useState(getInitialState);

	// Save form data to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('formData', JSON.stringify(formData));
	}, [formData]);

	// Update form data
	const updateFormData = (newData) => {
		setFormData(prevData => ({
			...prevData,
			...newData
		}));
	};

	// Update a specific section of the form data
	const updateFormSection = (formType, section, data) => {
		setFormData(prevData => ({
			...prevData,
			[formType]: {
				...prevData[formType],
				[section]: data
			}
		}));
	};

	// Reset form data
	const resetFormData = () => {
		localStorage.removeItem('formData');
		setFormData(getInitialState());
	};

	return (
		<FormContext.Provider value={{
			formData,
			updateFormData,
			updateFormSection,
			resetFormData
		}}>
			{children}
		</FormContext.Provider>
	);
};