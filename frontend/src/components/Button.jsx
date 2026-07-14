const Button = ({ children, variant = 'primary', className = '', isLoading = false, disabled, ...props }) => {
  const baseClasses = 'btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline shadow-[0_4px_14px_rgba(32,55,43,0.04)]',
    danger: 'border border-red-600 bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.16)] hover:bg-red-700',
    ghost: 'border border-transparent bg-transparent text-[#66736b] hover:bg-[#eef2ef] hover:text-[#26372d]'
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
        <svg className="h-4 w-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className={isLoading ? 'opacity-80' : ''}>{children}</span>
    </button>
  );
};

export default Button;
