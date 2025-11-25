import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

const FormSelection = () => {
	const navigate = useNavigate();
	const { formData, updateFormData } = useFormContext();
	const [selectedForm, setSelectedForm] = useState(formData.formType || null);
	const [showWhenSection, setShowWhenSection] = useState(false);
	const [showFullIIADetails, setShowFullIIADetails] = useState(false);
	const [showShortIIADetails, setShowShortIIADetails] = useState(false);	

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
							className="w-5 h-5 mt-1 flex-shrink-0"
						/>
						<label htmlFor="form1" className="text-lg cursor-pointer">
							<span className="font-semibold">Full Integrated Impact Assessment</span> - you must select this if you are writing a paper for the Sport Wales Board.
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

				{/* When to do an impact assessment - Collapsible */}
				<div className="mt-8 border rounded-lg overflow-hidden">
					<button 
						className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
						onClick={() => setShowWhenSection(!showWhenSection)}
					>
						<h3 className="text-xl font-bold">When to do an impact assessment</h3>
						<svg 
							className={`w-5 h-5 transition-transform ${showWhenSection ? 'transform rotate-180' : ''}`} 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24" 
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>
					
					{showWhenSection && (
						<div className="p-4 border-t space-y-4">
							<p className="text-lg">
								You should complete your IIA when planning or near the start of your piece of work.
							</p>
							<p className="text-lg">
								There are 2 types of assessment: full and short. Which type of assessment you do depends on the work you're doing.
							</p>
							<div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 mt-4">
								<p className="font-semibold text-gray-800">
									You must do a full IIA when you are producing a paper for the Sport Wales Board.
								</p>
							</div>

							{/* Full integrated impact assessments - Nested Collapsible */}
							<div className="border rounded-lg overflow-hidden mt-4">
								<button 
									className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 text-left"
									onClick={() => setShowFullIIADetails(!showFullIIADetails)}
								>
									<h4 className="text-lg font-semibold">Full integrated impact assessments</h4>
									<svg 
										className={`w-4 h-4 transition-transform ${showFullIIADetails ? 'transform rotate-180' : ''}`} 
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24" 
										xmlns="http://www.w3.org/2000/svg"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
									</svg>
								</button>
								
								{showFullIIADetails && (
									<div className="p-3 border-t bg-gray-50">
										<p className="text-gray-700 mb-2">
											Full integrated impact assessments are for when an impact assessment is required.  You might describe it as a piece of work, a policy or a project. These can be reviews or changes to current policies or significant changes in how we do our work. 
										</p>
										  <p className="text-gray-700">The integrated impact assessment helps you to predict and plan for your work’s impacts relating to each of our {' '}
											<a href="#" className="text-sw-blue underline hover:text-sw-blue-dark">
												Public Duties
											</a>.
										  </p>
									</div>
								)}
							</div>

							{/* Short integrated impact assessments - Nested Collapsible */}
							<div className="border rounded-lg overflow-hidden mt-2">
								<button 
									className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 text-left"
									onClick={() => setShowShortIIADetails(!showShortIIADetails)}
								>
									<h4 className="text-lg font-semibold">Short integrated impact assessments</h4>
									<svg 
										className={`w-4 h-4 transition-transform ${showShortIIADetails ? 'transform rotate-180' : ''}`} 
										fill="none" 
										stroke="currentColor" 
										viewBox="0 0 24 24" 
										xmlns="http://www.w3.org/2000/svg"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
									</svg>
								</button>
								
								{showShortIIADetails && (
									<div className="p-3 border-t bg-gray-50">
										<p className="text-gray-700 mb-2">
											This is a simplified impact assessment with generalised questions. It is an optional process when an impact assessment isn’t required but you would like to do one to improve the work.

										</p>
										<p className="text-gray-700">
											These assessments are helpful when you want to understand how your piece of work affects the community, but it doesn’t impact our Public Duties.
										</p>
									</div>
								)}
							</div>
						</div>
					)}
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