import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProgressBar = ({ steps, currentStep, completedSteps = [], formType }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleStepClick = (index) => {
    const id = searchParams.get('id');
    const path = `/${formType}/step${index + 1}`;
    navigate(id ? `${path}?id=${id}` : path);
  };

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
              const isCurrent   = index === currentStep;
              const isCompleted = completedSteps.includes(index) && !isCurrent;

              return (
                <div
                  key={step.id}
                  title={step.description}
                  className="flex flex-col items-center text-[--color-sw-blue] overflow-hidden"
                >
                  <button
                    onClick={() => handleStepClick(index)}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full mb-2
                      transition-all duration-200
                      ${
                        isCurrent
                          ? 'bg-[--color-sw-red] mt-1 text-white ring-4 ring-[--color-sw-red-light]'
                          : isCompleted
                            ? 'bg-[--color-sw-green] mt-1 text-white hover:opacity-80'
                            : 'bg-[--color-sw-blue] mt-1 text-[--color-white] hover:bg-cyan-700'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </button>
                  <span className="text-sm font-semibold">
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