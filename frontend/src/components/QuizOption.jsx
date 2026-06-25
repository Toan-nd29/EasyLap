import React from 'react';

const QuizOption = ({ label, selected, onClick, isMultiple }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex items-center
        ${selected 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-200 hover:border-primary-200 hover:bg-gray-50'
        }
      `}
    >
      <div className={`
        flex-shrink-0 flex items-center justify-center mr-4 transition-colors duration-200
        ${isMultiple ? 'w-6 h-6 rounded' : 'w-6 h-6 rounded-full'}
        ${selected ? 'bg-primary-500 border-primary-500' : 'bg-white border-2 border-gray-300'}
      `}>
        {selected && (
          <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 20 20">
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
          </svg>
        )}
      </div>
      <div className="text-gray-800 font-medium">{label}</div>
    </div>
  );
};

export default QuizOption;
