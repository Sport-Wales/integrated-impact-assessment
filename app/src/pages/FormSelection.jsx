import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

const FormSelection = () => {
	const navigate = useNavigate();
	const { formData, updateFormData } = useFormContext();
	const [selectedForm, setSelectedForm] = useState(formData.formType || null);

	const handleFormSelect = (formType) => {
		setSelectedForm(formType);
		updateFormData({ formType });
	};

	const handleContinue = () => {
		if (selectedForm) {
			navigate('/form-introduction');
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<h2 className="sw-heading-primary text-3xl font-bold mb-8">
				Select an Integrated Impact Assessment form
			</h2>

			<div>
				<p className="text-lg mb-6">
					Select a form to continue.
				</p>

				<div className="space-y-6 mt-8">
					{/* Option 1 - Full IIA */}
					<div className="flex items-start space-x-3">
						<input
							type="radio"
							id="form1"
							name="formSelection"
							checked={selectedForm === 'form1'}
							onChange={() => handleFormSelect('form1')}
							className="w-5 h-5 mt-1"
						/>
						<label htmlFor="form1" className="text-lg cursor-pointer">
							<span className="font-semibold">Full Integrated Impact Assessment</span> – you must select this if you are writing a paper for the Sport Wales Board.
						</label>
					</div>

					{/* Option 2 - Short IIA */}
					<div className="flex items-start space-x-3">
						<input
							type="radio"
							id="form3"
							name="formSelection"
							checked={selectedForm === 'form3'}
							onChange={() => handleFormSelect('form3')}
							className="w-5 h-5 mt-1"
						/>
						<label htmlFor="form3" className="text-lg cursor-pointer">
							<span className="font-semibold">Short Integrated Impact Assessment</span>
						</label>
					</div>
				</div>

				<div className="mt-12 flex justify-between">
					<Link to="/" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
						</svg>
						Prev
					</Link>
					<button
						className={`inline-flex items-center px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${selectedForm ? 'bg-sw-red text-white hover:bg-red-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
						onClick={handleContinue}
						disabled={!selectedForm}
					>
						Next: Preparing for your integrated impact assessment
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FormSelection;