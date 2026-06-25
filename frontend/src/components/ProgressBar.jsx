import React from 'react';

const ProgressBar = ({ current, total }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div 
        className="bg-primary-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
