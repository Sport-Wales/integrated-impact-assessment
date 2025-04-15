// src/pages/Form3/Step1.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form3Step1 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData } = useFormContext();

	const [formState, setFormState] = useState({
		title: formData.title || '',
		leadName: formData.leadName || '',
		leadRole: formData.leadRole || '',
		otherPeople: formData.otherPeople || '',
		workDetails: formData.workDetails || '',
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
			workDetails: formState.workDetails
		});

		// Navigate to the next step
		navigate('/form3/step2');
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
				<div className="sw-progress-container">
					<div className="sw-progress-bar" style={{ width: '33%' }}></div>
				</div>

				<div className="sw-step-indicator">
					<div className="sw-step">
						<div className="sw-step-circle sw-step-active">1</div>
						<div className="sw-step-title">About your project</div>
					</div>
					<div className="sw-step">
						<div className="sw-step-circle sw-step-incomplete">2</div>
						<div className="sw-step-title">Your assessment</div>
					</div>
					<div className="sw-step">
						<div className="sw-step-circle sw-step-incomplete">3</div>
						<div className="sw-step-title">Final review</div>
					</div>
				</div>
			</div>

			<h2 className="sw-heading-primary text-3xl font-bold mb-8">
				Step 1: About your project
			</h2>

			<div className="space-y-6">
				<div>
					<label htmlFor="title" className="sw-label">
						Give this assessment a title
					</label>
					<input
						type="text"
						id="title"
						name="title"
						value={formState.title}
						onChange={handleChange}
						className="sw-input"
						required
					/>
				</div>

				<div>
					<label htmlFor="leadName" className="sw-label">
						Who is leading this assessment?
					</label>
					<p className="text-sm text-gray-600 mb-2">Your name and role</p>
					<input
						type="text"
						id="leadName"
						name="leadName"
						value={formState.leadName}
						onChange={handleChange}
						className="sw-input"
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
						className="sw-input"
						required
						placeholder="Role"
					/>
				</div>

				<div>
					<label htmlFor="otherPeople" className="sw-label">
						Who else is involved?
					</label>
					<p className="text-sm text-gray-600 mb-2">
						Other people helping. These will also be given access to this assessment
					</p>
					<input
						type="text"
						id="otherPeople"
						name="otherPeople"
						value={formState.otherPeople}
						onChange={handleChange}
						className="sw-input"
					/>
				</div>

				<div>
					<label htmlFor="workDetails" className="sw-label">
						Use this section to detail this work
					</label>
					<p className="text-sm text-gray-600 mb-2">
						Provide any background, objectives, past work, insight or research
					</p>
					<textarea
						id="workDetails"
						name="workDetails"
						value={formState.workDetails}
						onChange={handleChange}
						className="sw-textarea"
						rows={6}
					/>
				</div>

				<div className="mt-12 flex justify-between">
					<Link to="/form-introduction" className="sw-button sw-button-neutral">
						Prev
					</Link>
					<button
						className="sw-button sw-button-primary"
						onClick={handleNext}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default Form3Step1;