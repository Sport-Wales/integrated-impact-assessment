import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getReviewAvailability } from '../../utils/reviewGate';

// formData is optional so ProgressBar still works if a caller doesn't pass it,
// but every step page in the app does — it's what lets the Review step stay
// locked (greyed out, unclickable) until getReviewAvailability() says it's due.
const ProgressBar = ({ steps, currentStep, completedSteps = [], formType, formData }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reviewGate = formData ? getReviewAvailability(formData) : null;
  const reviewLockedTooltip = !reviewGate ? null
    : !reviewGate.isSubmitted
      ? 'This assessment must be submitted before it can be reviewed.'
      : !reviewGate.isAvailable
        ? `Review will be available from ${reviewGate.availableFrom.toLocaleDateString('en-GB')}.`
        : null;

  const handleStepClick = (index, isLocked) => {
    if (isLocked) return;
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
              const isLocked    = step.id === 'review' && reviewLockedTooltip && !isCompleted;

              return (
                <div
                  key={step.id}
                  title={isLocked ? reviewLockedTooltip : step.description}
                  className={`flex flex-col items-center overflow-hidden ${isLocked ? 'text-gray-400' : 'text-[--color-sw-blue]'}`}
                >
                  <button
                    onClick={() => handleStepClick(index, isLocked)}
                    disabled={isLocked}
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full mb-2
                      transition-all duration-200
                      ${
                        isLocked
                          ? 'bg-gray-200 mt-1 text-gray-400 cursor-not-allowed'
                          : isCurrent
                            ? 'bg-[--color-sw-red] mt-1 text-white ring-4 ring-[--color-sw-red-light]'
                            : isCompleted
                              ? 'bg-[--color-sw-green] mt-1 text-white hover:opacity-80'
                              : 'bg-[--color-sw-blue] mt-1 text-[--color-white] hover:bg-cyan-700'
                      }
                    `}
                  >
                    {isLocked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm2-2a3 3 0 016 0v2H7V7z" clipRule="evenodd" />
                      </svg>
                    ) : isCompleted ? (
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