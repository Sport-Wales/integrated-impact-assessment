// src/components/ProgressBar.jsx
import React from 'react';

const ProgressBar = ({ steps, currentStep, completedSteps, onStepClick }) => {

  return (
    <div className="w-full bg-white rounded-lg shadow p-6 space-y-6 mb-8">
      <div className="max-w-4xl mx-auto">
        {/* Step counter */}
        <div className="mb-4">
          <span className="text-sm font-semibold text-[--color-sw-blue]">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="relative">
          <div className="overflow-hidden flex rounded">
            <div
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
            />
          </div>
          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;

              return (
                <div
                  key={step.id}
                  title={step.description}
                  className={`flex flex-col items-center text-[--color-sw-blue] overflow-hidden`}
                >
                  <button
                    onClick={() => onStepClick(index)}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full mb-2
                      transition-all duration-200

                      ${
                        isCurrent
                          ? 'bg-[--color-sw-red] mt-1 text-white ring-4 ring-[--color-sw-red-light]'
                          : 'bg-[--color-sw-blue] mt-1 text-[--color-white] hover:bg-cyan-700'
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                  <span className={`text-sm font-semibold`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;