import React from "react";

const SaveButton = () => {

	const onClick = () => {

		// where logic will go 
	}


	return (
		<button
			className="inline-flex hover:bg-cyan-700 hover:border-[--color-sw-blue] items-center px-3 py-2 rounded-md text-sm bg-[--color-sw-blue]  text-white font-medium transition-colors duration-200 hover:bg-opacity-90"
			onClick={onClick}
		>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			aria-hidden="true"
			role="img"
			stroke="currentColor"
			className="h-4 w-4 mr-2 fill-current"
		>		
			<path
				d="M7 4h8.3c.4 0 .8.16 1.06.44l3.2 3.2c.28.28.44.66.44 1.06V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
				fill="currentColor"
			/>
			<rect
				x="6.75"
				y="6.75"
				width="9.5"
				height="4"
				rx="0.6"
				className="fill-[--color-sw-blue]"
			/>
		</svg>
		Save
		</button>
	);
};

export default SaveButton;