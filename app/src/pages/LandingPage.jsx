// page 1
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useFormContext } from '../context/FormContext';

const LandingPage = () => {
	const { resetFormData } = useFormContext();

	const [showWhySection, setShowWhySection] = useState(false);
	const [showWhenSection, setShowWhenSection] = useState(false);
	const [showFullIIADetails, setShowFullIIADetails] = useState(false);
	const [showShortIIADetails, setShowShortIIADetails] = useState(false);

	useEffect(() => {
		resetFormData();
	}, [resetFormData]);

	// bug fix: FormSelection not loading. Quick and dirty solution:
	const handleStart = () => {
		window.location.href = '/form-selection';
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<h2 className="sw-heading-primary text-3xl font-bold mb-8">
				Integrated Impact Assessments (IIA)
			</h2>

			<div className="space-y-6">
				<p className="text-lg">
					Integrated Impact Assessments (IIA) are a tool to help make sure our work supports as many people as possible.
				</p>

				<div className="mb-6">
					<p className="text-lg mb-4">
						The aims of an Integrated Impact Assessment are to make sure we:
					</p>
					<ul className="space-y-2 ml-6">
						<li className="flex items-start">
							<span className="text-green-500 mr-2 text-xl">✅</span>
							<span>do better work and make better decisions so our work benefits more people</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 text-xl">✅</span>
							<span>support fairness and equality for all communities</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 text-xl">✅</span>
							<span>protect the environment for future generations</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 text-xl">✅</span>
							<span>strengthen the Welsh language and culture</span>
						</li>
						<li className="flex items-start">
							<span className="text-green-500 mr-2 text-xl">✅</span>
							<span>meet our legal and ethical responsibilities as a public body (Public Duties)</span>
						</li>
					</ul>
				</div>

				{/* Why we have impact assessments - Collapsible */}
				<div className="border rounded-lg overflow-hidden">
					<button 
						className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
						onClick={() => setShowWhySection(!showWhySection)}
					>
						<h3 className="text-xl font-bold">Why we have impact assessments</h3>
						<svg 
							className={`w-5 h-5 transition-transform ${showWhySection ? 'transform rotate-180' : ''}`} 
							fill="none" 
							stroke="currentColor" 
							viewBox="0 0 24 24" 
							xmlns="http://www.w3.org/2000/svg"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
						</svg>
					</button>
					
					{showWhySection && (
						<div className="p-4 border-t space-y-4">
							<p className="text-lg">
								At Sport Wales, we're committed to making a real difference to people in our communities.
							</p>
							<p className="text-lg">
								<a href="#" className="text-sw-blue underline font-semibold hover:text-sw-blue-dark">
									Our vision and strategy
								</a> states Sport Wales' aim is to create an active nation where everyone can have a lifetime enjoyment of sport.
							</p>
							<p className="text-lg">
								Every piece of work, project or policy you work on has the potential to improve lives. Considering how your piece of work impacts people at the start helps
							</p>
							<p className="text-lg">
								Over time, our records of these assessments help us use what you learnt. That helps us provide more opportunities for everyone to enjoy sport.
							</p>
						</div>
					)}
				</div>

				{/* When to do an impact assessment - Collapsible */}
				<div className="border rounded-lg overflow-hidden">
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
										<p className="text-gray-700">
											Full integrated impact assessments are for when you have a significant piece of work, policy or programme. They help you to predict and plan for your work's impacts relating to each of our{' '}
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
											This is a simplified impact assessment with generalised questions.
										</p>
										<p className="text-gray-700">
											These assessments are helpful when you want to understand how your piece of work affects the community, but it doesn't impact our Public Duties.
										</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>

				<div className="mt-8 flex justify-center">
					<button
						onClick={handleStart}
						className="inline-flex items-center px-6 py-2 rounded-md text-lg bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
					>
						Next: Select an impact assessment
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;