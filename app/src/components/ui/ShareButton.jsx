
import React from "react";

const ShareButton = () => {
  const onClick = () => {
    // where logic will go
  };

  return (
    <button
      className="inline-flex hover:bg-cyan-700 items-center px-3 py-2 rounded-md text-sm bg-[--color-sw-blue] text-white font-medium transition-colors duration-200 hover:bg-opacity-90"
      onClick={onClick}
    >
      {/* Share icon (stroke-only, inherits currentColor = white) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        aria-hidden="true"
        role="img"
        stroke="currentColor"
        className="h-4 w-4 mr-2"
        fill="none"
      >
        {/* circles (nodes) */}
        <circle cx="17.25" cy="6.75" r="1.75" strokeWidth="2.5" />
        <circle cx="6.75"  cy="12.00" r="1.75" strokeWidth="2.5" />
        <circle cx="17.75" cy="17.25" r="1.75" strokeWidth="2.5" />

        {/* links */}
        <path d="M8.3 11.2 L15.2 7.9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8.3 12.8 L15.6 16.1" strokeWidth="2.5" strokeLinecap="round" />
      </svg>

      Share
    </button>
  );
};

export default ShareButton;
