import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useFormContext } from '../context/FormContext';

const LandingPage = () => {
	const { resetFormData } = useFormContext();

	// Reset form data when landing on this page to start fresh
	useEffect(() => {
		resetFormData();
	}, [resetFormData]);

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<h2 className="sw-heading-primary text-3xl font-bold mb-8">
				Why measuring impact matters
			</h2>

			<div className="space-y-6">
				<p className="text-lg">
					At Sport Wales, we're committed to making a real difference. Every
					project we work on has the potential to improve lives, create
					opportunities, and build a stronger, fairer, and more sustainable future
					for everyone in Wales.
				</p>

				<p className="text-lg">
					Essentially, we want to:
				</p>

				<ul className="space-y-2 ml-6">
					<li className="flex items-start">
						<span className="text-green-500 mr-2 text-xl">✅</span>
						<span className="font-bold">Make better decisions</span> that benefit more people
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 text-xl">✅</span>
						<span className="font-bold">Support fairness and equality</span> for all communities
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 text-xl">✅</span>
						<span className="font-bold">Protect the environment</span> for future generations
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 text-xl">✅</span>
						<span className="font-bold">Strengthen the Welsh language and culture</span>
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 text-xl">✅</span>
						<span className="font-bold">Ensure our work meets legal and ethical responsibilities</span>
					</li>
				</ul>

				<p className="text-lg">
					In addition, as a public body we have a legal responsibility to ensure
					we are working to assess, monitor and take action when our work or
					decisions make a significant impact our communities.
				</p>

				<p className="text-lg">
					So, let's work together to make sport in Wales as inclusive, impactful,
					and inspiring as possible! And make sure you are meeting your legal
					responsibilities.
				</p>

				<div className="bg-gray-100 p-6 rounded-lg border-l-4 border-sw-red mt-8">
					<p className="font-bold text-lg">Remember. This is a positive process.</p>
					<p className="font-bold text-lg">It's not about a tick-box or taking up lots of time.</p>
					<p className="font-bold text-lg">
						As well as your legal responsibility we want you to take a positive
						approach to Making an Impact.
					</p>
				</div>

				<div className="mt-8 flex justify-center">
					<Link
						to="/form-selection"
						className="sw-button sw-button-primary"
					>
						Start
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LandingPage;