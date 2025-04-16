// src/pages/Form1/Step1.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

const Form1Step1 = () => {
	const navigate = useNavigate();
	const { formData, updateFormData } = useFormContext();

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
			workDetails: formState.workDetails,
			form1: {
				...formData.form1,
				affectedGroups: formState.affectedGroups,
			}
		});

		// Navigate to the next step
		navigate('/form1/step2');
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<div className="bg-white rounded-lg shadow-sm p-6 mb-8">
				<div className="sw-progress-container">
					<div className="sw-progress-bar" style={{ width: '11%' }}></div>
				</div>

				<div className="sw-step-indicator">
					<div className="sw-step">
						<div className="sw-step-circle sw-step-active">1</div>
						<div className="sw-step-title">Basic Details</div>
					</div>
					{/* Additional steps would be displayed here */}
				</div>
			</div>

			<h2 className="sw-heading-primary text-3xl font-bold mb-8">
				Step 1: Basic Details
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
						What is this piece of work about?
					</label>
					<p className="text-sm text-gray-600 mb-2">
						Explain your project, plan, or idea in a few sentences
					</p>
					<textarea
						id="workDetails"
						name="workDetails"
						value={formState.workDetails}
						onChange={handleChange}
						className="sw-textarea"
						rows={4}
					/>
				</div>

				<div>
					<label htmlFor="affectedGroups" className="sw-label">
						Who will be affected?
					</label>
					<p className="text-sm text-gray-600 mb-2">
						e.g., staff, public, athletes, partners
					</p>
					<textarea
						id="affectedGroups"
						name="affectedGroups"
						value={formState.affectedGroups}
						onChange={handleChange}
						className="sw-textarea"
						rows={4}
					/>
				</div>

				<div className="mt-12 flex justify-between">
					<Link to="/form-introduction" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
						Prev
					</Link>
					<button
						className="inline-flex items-center px-6 py-1 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
						onClick={handleNext}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default Form1Step1;