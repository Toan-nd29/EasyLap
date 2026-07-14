import { Laptop } from 'lucide-react';

const BrandLogo = ({ compact = false, className = '' }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span className={`${compact ? 'h-7 w-7' : 'h-9 w-9'} inline-flex items-center justify-center rounded-lg bg-primary-50 text-primary-500`}>
      <Laptop className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2.4} />
    </span>
    <span className={`${compact ? 'text-lg' : 'text-xl'} font-extrabold tracking-[-0.04em] text-primary-500`}>
      EasyLap
    </span>
  </span>
);

export default BrandLogo;
