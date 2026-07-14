import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Gauge,
  HardDrive,
  Heart,
  Monitor,
  Scale
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import LaptopImage from './LaptopImage';

const ResultCard = ({ result, isFavorite, onToggleFavorite, onCompare }) => {
  const { laptop, finalScore, matchReasons, tradeOffs } = result;

  return (
    <article className="group overflow-hidden rounded-[26px] border border-[#e0e7e3] bg-white shadow-[0_14px_42px_rgba(32,55,43,0.065)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_22px_55px_rgba(32,55,43,0.10)]">
      <div className="grid lg:grid-cols-[330px_1fr]">
        <div className="relative flex min-h-[340px] flex-col border-b border-[#e5ebe7] bg-[#f1f5f2] p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <div className="absolute right-4 top-4 z-10 flex min-w-16 flex-col items-center rounded-[16px] bg-primary-600 px-3 py-2.5 text-white shadow-[0_9px_22px_rgba(22,184,101,0.25)]">
            <span className="text-2xl font-black leading-none tracking-[-0.04em]">{finalScore}</span>
            <span className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-primary-50">Điểm</span>
          </div>

          <div className="relative flex min-h-48 flex-1 items-center justify-center overflow-hidden rounded-[20px] border border-white/80 bg-white/45 p-4">
            <div className="pointer-events-none absolute inset-x-10 bottom-6 h-16 rounded-full bg-primary-100/55 blur-2xl" />
            <LaptopImage
              laptop={laptop}
              className="relative h-48 w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-[1.03]"
              fallbackClassName="relative h-48 w-full"
            />
          </div>

          <div className="pt-5">
            <div className="mb-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-primary-700">{laptop.brand}</div>
            <Link to={`/laptops/${laptop.id}`} className="line-clamp-2 text-xl font-black leading-7 tracking-[-0.025em] text-[#172019] transition hover:text-primary-700">
              {laptop.name}
            </Link>
            <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#101713]">{formatCurrency(laptop.price)}</div>
          </div>
        </div>

        <div className="flex flex-col p-5 sm:p-7 lg:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-[16px] border border-[#e5ebe7] bg-[#fafcfb] p-3.5">
              <Cpu className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" strokeWidth={1.7} aria-hidden="true" />
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#829087]">Bộ xử lý</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-[#27352c]">{laptop.cpu}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[16px] border border-[#e5ebe7] bg-[#fafcfb] p-3.5">
              <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" strokeWidth={1.7} aria-hidden="true" />
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#829087]">RAM / SSD</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-[#27352c]">{laptop.ram}GB / {laptop.ssd}GB</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[16px] border border-[#e5ebe7] bg-[#fafcfb] p-3.5">
              <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" strokeWidth={1.7} aria-hidden="true" />
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#829087]">Card đồ họa</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-[#27352c]">{laptop.gpu}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-[16px] border border-[#e5ebe7] bg-[#fafcfb] p-3.5">
              <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" strokeWidth={1.7} aria-hidden="true" />
              <div className="min-w-0">
                <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-[#829087]">Màn hình</span>
                <span className="mt-1 block text-sm font-bold leading-5 text-[#27352c]">{laptop.screen}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 grid flex-1 gap-4 xl:grid-cols-2">
            {matchReasons && matchReasons.length > 0 && (
              <div className="rounded-[18px] border border-primary-100 bg-primary-50/55 p-4">
                <h3 className="flex items-center gap-2 text-sm font-black text-[#16472f]">
                  <CheckCircle2 className="h-4 w-4 text-primary-600" strokeWidth={1.8} aria-hidden="true" />
                  Lý do phù hợp
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {matchReasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm leading-5 text-[#4f6257]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-500" aria-hidden="true" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tradeOffs && tradeOffs.length > 0 && (
              <div className="rounded-[18px] border border-amber-200/80 bg-amber-50/55 p-4">
                <h3 className="flex items-center gap-2 text-sm font-black text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600" strokeWidth={1.8} aria-hidden="true" />
                  Điểm cần cân nhắc
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {tradeOffs.map((tradeoff, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm leading-5 text-amber-900/75">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                      {tradeoff}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 grid gap-2.5 border-t border-[#e9eeeb] pt-5 sm:grid-cols-[1fr_auto_auto]">
            <Link to={`/laptops/${laptop.id}`} className="btn btn-primary gap-2 text-sm shadow-[0_9px_20px_rgba(37,200,117,0.20)]">
              Xem chi tiết
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => onToggleFavorite(laptop)}
              aria-pressed={isFavorite}
              className={`btn gap-2 border text-sm ${
                isFavorite
                  ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                  : 'border-[#dfe7e2] bg-white text-[#57665d] hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} strokeWidth={1.8} aria-hidden="true" />
              {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
            </button>
            <button
              type="button"
              onClick={() => onCompare(laptop)}
              className="btn btn-outline gap-2 text-sm"
            >
              <Scale className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              So sánh
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ResultCard;
