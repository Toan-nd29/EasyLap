import React from 'react';

const Button = ({ children, variant = 'primary', className = '', isLoading = false, disabled, ...props }) => {
  const baseClasses = 'btn relative transition-all duration-200 flex items-center justify-center font-medium';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm hover:shadow',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300',
    outline: 'border-2 border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  };

  const disabledClasses = disabled || isLoading 
    ? 'opacity-60 cursor-not-allowed transform-none' 
    : '';

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className={isLoading ? 'opacity-80' : ''}>{children}</span>
    </button>
  );
};

export default Button;
