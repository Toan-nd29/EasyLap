import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
      <div className="text-red-700 text-sm whitespace-pre-line">{message}</div>
    </div>
  );
};

export default ErrorMessage;
