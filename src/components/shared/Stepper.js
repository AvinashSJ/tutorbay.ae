import React from 'react';

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
              index < currentStep 
                ? 'bg-primaryColor text-white' 
                : index === currentStep 
                  ? 'bg-primaryColor text-white' 
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {index < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="text-sm mt-2 font-medium text-gray-600">{step}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 ${
                index < currentStep 
                  ? 'bg-primaryColor' 
                  : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper; 