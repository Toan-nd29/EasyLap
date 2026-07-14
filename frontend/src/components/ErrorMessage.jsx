import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3.5 shadow-[0_8px_22px_rgba(185,28,28,0.05)]">
      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-red-500 shadow-sm">
        <AlertCircle className="h-4 w-4" />
      </span>
      <div className="pt-1 text-sm font-medium leading-6 text-red-700 whitespace-pre-line">{message}</div>
    </div>
  );
};

export default ErrorMessage;
