import React from "react";

const PrevButton = ({ onPrev }) => {
	return (
		<button
			onClick={onPrev}
			className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 bg-white text-gray-700 border border-[--color-sw-blue] hover:bg-gray-50"
		>
			<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
			</svg>
			Prev
		</button>
	);
};

export default PrevButton;
