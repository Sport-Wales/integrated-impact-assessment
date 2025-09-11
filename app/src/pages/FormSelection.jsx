import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

const FormSelection = () => {
	const navigate = useNavigate();
	const { formData, updateFormData } = useFormContext();
	const [selectedForm, setSelectedForm] = useState(formData.formType || null);

	// Information modal states
	const [showSignificantImpactInfo, setShowSignificantImpactInfo] = useState(false);
	const [showPublicDutiesInfo, setShowPublicDutiesInfo] = useState(false);

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
				Selecting a form
			</h2>

			<div>
				<p className="text-lg mb-6">
					There are three different IIA forms you can chose to complete, please select the option that best fits your circumstance:
				</p>

				<div className="space-y-6 mt-8">
					{/* Option 1 */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="form1"
							checked={selectedForm === 'form1'}
							onChange={() => handleFormSelect('form1')}
							className="w-5 h-5 rounded border-2 focus:ring-2 mt-1"
						/>
						<label htmlFor="form1" className="text-lg cursor-pointer">
							I'm producing a paper for the Board or Executive
						</label>
					</div>

					{/* Option 2 */}
					<div className="flex items-start space-x-3 display hidden">
						<div className='flex items-center'>
						<input
							type="checkbox"
							id="form2"
							checked={selectedForm === 'form2'}
							onChange={() => handleFormSelect('form2')}
							className="w-5 h-5 rounded border-2 focus:ring-2 mt-3"
						/>
						</div>
						<label htmlFor="form2" className="text-lg cursor-pointer">
							My work will have a{' '}
							<span>
							<button
								className="text-sw-blue underline font-semibold"
								onClick={(e) => {
									e.preventDefault();
									setShowSignificantImpactInfo(!showSignificantImpactInfo);
								}}
							>
								significant impact
								<div className='pl-1 inline-flex relative'>
									<svg xmlns="http://www.w3.org/2000/svg"fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  									<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
									</svg>
								</div>
							</button>{' '}
							</span>
						
							and is likely to affect one or more{' '}
							<span>
							<button
								className="text-sw-blue underline font-semibold"
								onClick={(e) => {
									e.preventDefault();
									setShowPublicDutiesInfo(!showPublicDutiesInfo);
								}}
							>
								public duties
								<div className='pl-1 inline-flex relative'>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
  									<path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
									</svg>
								</div>
							</button>{' '}
							</span>
							(but I'm not producing a paper for the Board or Executive)
						</label>
					</div>

					{/* Significant Impact Info */}
					{showSignificantImpactInfo && (
						<div className="ml-10 p-4 bg-blue-50 rounded-lg border border-blue-200">
							<h3 className="font-bold mb-2">What is a significant impact?</h3>
							<ul className="list-disc ml-6 space-y-2">
								<li>Who will be affected, and could this work reduce inequalities or improve well-being for specific groups or communities, including promoting the Welsh language?</li>
								<li>Does this work align with legal duties, such as the Well-being of Future Generations (Wales) Act and the Equality Act 2010, and are there any potential negative consequences for protected groups?</li>
								<li>Have you engaged with affected communities or stakeholders to understand the potential social, economic, and environmental impacts?</li>
							</ul>
						</div>
					)}

					{/* Public Duties Info */}
					{showPublicDutiesInfo && (
						<div className="ml-10 p-4 bg-blue-50 rounded-lg border border-blue-200">
							<h3 className="font-bold mb-2">What are public duties?</h3>
							<ul className="list-disc ml-6 space-y-2">
								<li>Could your project reduce inequalities or improve well-being for specific groups or communities, including promoting the Welsh language?</li>
								<li>Does your project align with legal duties, such as the Well-being of Future Generations (Wales) Act and the Equality Act 2010, and are there any potential negative consequences for protected groups?</li>
								<li>Will/have you engaged communities or stakeholders to understand the potential social, economic, and environmental impacts?</li>
							</ul>
						</div>
					)}

					{/* Option 3 */}
					<div className="flex items-start space-x-3">
						<input
							type="checkbox"
							id="form3"
							checked={selectedForm === 'form3'}
							onChange={() => handleFormSelect('form3')}
							className="w-5 h-5 rounded border-2 focus:ring-2 mt-1"
						/>
						<label htmlFor="form3" className="text-lg cursor-pointer">
							My work will have a positive impact on communities, but not impact public duties
						</label>
					</div>
				</div>

				<div className="mt-12 flex justify-between">
					<Link to="/" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
						Prev
					</Link>
					<button
						className={`inline-flex items-center px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-red-700 ${selectedForm ? ' bg-sw-red text-white' : 'bg-gray-300 text-black'}`}
						onClick={handleContinue}
						disabled={!selectedForm}
					>
						Next
					</button>
					
				</div>
			</div>
		</div>
	);
};

export default FormSelection;