import { Check } from 'lucide-react';

const QuizOption = ({ label, selected, onClick, isMultiple }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`
        group flex w-full items-center gap-4 rounded-[18px] border px-4 py-4 text-left
        shadow-[0_5px_18px_rgba(32,55,43,0.035)] transition-all duration-200 sm:px-5
        ${selected
          ? 'border-primary-400 bg-primary-50 text-[#123d29] shadow-[0_10px_24px_rgba(37,200,117,0.10)] ring-1 ring-primary-200'
          : 'border-[#e1e8e4] bg-white text-[#26342c] hover:-translate-y-0.5 hover:border-primary-300 hover:bg-[#fbfefc] hover:shadow-[0_10px_24px_rgba(32,55,43,0.07)]'
        }
      `}
    >
      <div className={`
        flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-200
        ${isMultiple ? 'rounded-[7px]' : 'rounded-full'}
        ${selected
          ? 'border-primary-500 bg-primary-500 text-white shadow-[0_4px_12px_rgba(37,200,117,0.24)]'
          : 'border-[#bdc9c1] bg-white text-transparent group-hover:border-primary-400'
        }
      `}>
        <Check className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </div>
      <span className="font-semibold leading-6">{label}</span>
    </button>
  );
};

export default QuizOption;
