import React from "react";

const NextButton = ({ label, onClick }) => {
	return (
		<button
			className="inline-flex hover:bg-cyan-700 items-center px-6 py-2 rounded-md text-sm bg-[--color-sw-blue] text-white font-medium transition-colors duration-200 hover:bg-opacity-90"
			onClick={onClick}
		>
			{label}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				className="h-4 w-4 ml-2"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="3"
					d="M9 5l7 7-7 7"
				/>
			</svg>
		</button>
	);
};

export default NextButton;