// src/pages/FormIntroduction.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

const FormIntroduction = () => {
	const navigate = useNavigate();
	const { formData } = useFormContext();

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
				Why complete an IIA
			</h2>

			<div className="space-y-6">
				<p className="text-lg">
					The <strong>Integrated Impact Assessment (IIA)</strong> helps us ensure that our
					decisions are thoughtful, inclusive, and aligned with our values. It's
					not about ticking boxes—it's about maximizing the positive impact of
					our work while identifying and addressing any challenges.
				</p>

				<p className="text-lg">
					We will guide you through each step, providing information and good
					examples to help you.
				</p>

				<ul className="space-y-4 mt-8 ml-6">
					<li className="text-lg">
						<span className="text-sw-blue underline font-semibold cursor-pointer">
							Before you start, you might find it useful to read some existing Sport Wales IIA's.
						</span>
					</li>
					<li className="text-lg">
						<span className="text-sw-blue underline font-semibold cursor-pointer">
							Training on completing an Integrated Impact Assessment is available here.
						</span>
					</li>
					<li className="text-lg">
						<span className="text-sw-blue underline font-semibold cursor-pointer">
							More information about our Public Duties and research and insight to help you.
						</span>
					</li>
				</ul>

				<div className="mt-12 flex justify-between">
					<Link to="/form-selection" className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50">
						Prev
					</Link>
					<button
						className="inline-flex items-center px-6 py-1 rounded-md text-sm bg-sw-red text-white font-medium transition-colors duration-200 hover:bg-red-700"
						onClick={handleStart}
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default FormIntroduction;