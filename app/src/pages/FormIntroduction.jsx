// page 3
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

const FormIntroduction = () => {
	const navigate = useNavigate();
	const { formData } = useFormContext();

	// Check if Full IIA is selected
	const isFullIIA = formData.formType === 'form1';

	const handleStart = () => {
		// Direct to the appropriate first step based on form type
		if (formData.formType === 'form1') {
			navigate('/form1/step1');
		} else if (formData.formType === 'form2') {
			navigate('/form2/step1');
		} else if (formData.formType === 'form3') {
			navigate('/form3/step1');
		} else {
			// If no form type selected, go back to selection
			navigate('/form-selection');
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<h2 className="sw-heading-primary text-3xl font-bold mb-8">
				Preparing for your Integrated Impact Assessment
			</h2>

			<div className="space-y-8">
				{/* What you'll need section */}
				<div>
					<h3 className="text-xl font-bold mb-4">What you'll need</h3>
					
					<p className="text-lg mb-3">
						To set up the form you'll need to have ready:
					</p>
					<ul className="list-disc ml-6 space-y-2 mb-4">
						<li className="text-lg">a title for your piece of work,</li>
						<li className="text-lg">the names of the person leading this impact assessment and colleagues involved,</li>
						<li className="text-lg">a description of your piece of work</li>
						<li className="text-lg">a list of groups your piece of work could impact (for example: the public, athletes, staff, etc.).</li>
					</ul>

					<p className="text-lg mb-3">
						It's helpful to have ready data or things learnt from previous work such as:
					</p>
					<ul className="list-disc ml-6 space-y-2">
						<li className="text-lg">past impact assessments,</li>
						<li className="text-lg">reports,</li>
						<li className="text-lg">surveys.</li>
					</ul>

					<p className="text-lg mt-3">
						You'll find links to help with this in guides and resources.
					</p>
				</div>

				{/* Who to involve section */}
				<div>
					<h3 className="text-xl font-bold mb-4">Who to involve</h3>
					
					<p className="text-lg mb-3">
						It is possible to complete an Integrated Impact Assessment on your own. But, it is usually faster and more effective to work on it as a small team.
					</p>

					<p className="text-lg mb-3">
						It can help to involve or talk to colleagues:
					</p>
					<ul className="list-disc ml-6 space-y-2">
						<li className="text-lg">with experience of the type of work or project you're planning,</li>
						<li className="text-lg">who have worked with people or groups your piece of work could impact,</li>
						<li className="text-lg">with knowledge or experience of the needs of people or groups your work could impact.</li>
					</ul>
				</div>

				{/* Completing the form section */}
				<div>
					<h3 className="text-xl font-bold mb-4">Completing the form</h3>
					
					<p className="text-lg mb-3">
						The form guides you through each step, providing information and examples to help you.
					</p>

					<p className="text-lg mb-3">
						Each section:
					</p>
					<ul className="list-disc ml-6 space-y-2">
						<li className="text-lg">describes the public duty we have to consider impacts for,</li>
						<li className="text-lg">links to fact sheets and data to help you assess the impacts.</li>
					</ul>

					{isFullIIA && (
						<p className="text-lg mt-3">
							You can complete the sections in any order. You can skip questions or sections if there are no expected impacts. Those impacts will be marked as 'neutral'.
						</p>
					)}
				</div>

				{/* Setting up a review date section */}
				<div>
					<h3 className="text-xl font-bold mb-4">Setting up a review date</h3>
					
					<p className="text-lg mb-3">
						When you submit the form you'll need to set a review date. This should be when you expect your piece of work to finish.
					</p>

					<p className="text-lg">
						The review will let you compare the impacts you expected with what you learnt during the piece of work.
					</p>
				</div>

				{/* Guides and resources section */}
				<div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
					<h3 className="text-xl font-bold mb-4">Guides and resources</h3>
					
					<ul className="space-y-3">
						<li>
							<a href="#" className="text-sw-blue underline font-semibold hover:text-sw-blue-dark text-lg">
								Past Sport Wales Integrated Impact Assessments.
							</a>
						</li>
						<li>
							<a href="#" className="text-sw-blue underline font-semibold hover:text-sw-blue-dark text-lg">
								Guides and fact sheets
							</a>
						</li>
						<li>
							<a href="#" className="text-sw-blue underline font-semibold hover:text-sw-blue-dark text-lg">
								Descriptions of our Public Duties.
							</a>
						</li>
						<li>
							<a href="#" className="text-sw-blue underline font-semibold hover:text-sw-blue-dark text-lg">
								Summaries of data about people and groups affected by our work
							</a>
						</li>
					</ul>
				</div>

				{/* Navigation buttons */}
				<div className="mt-12 flex justify-between">
					<Link to="/form-selection" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
						</svg>
						Prev
					</Link>
					<button
						className="inline-flex items-center px-6 py-2 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
						onClick={handleStart}
					>
						Next: Enter basic details
						<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FormIntroduction;