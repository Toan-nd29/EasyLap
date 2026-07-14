import { Link } from 'react-router-dom';
import { Cpu, HardDrive, Heart, Monitor, Scale } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import LaptopImage from './LaptopImage';

const LaptopCard = ({ laptop, isFavorite, onToggleFavorite, onCompare }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e4eae6] bg-white shadow-[0_10px_30px_rgba(32,55,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(32,55,43,0.10)]">
    <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f3f6f4] p-6">
      <div className="absolute inset-x-8 bottom-6 h-12 rounded-full bg-primary-100/35 blur-2xl" />
      <LaptopImage laptop={laptop} fallbackClassName="relative h-full w-full" />
      <button
        type="button"
        aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        onClick={event => { event.preventDefault(); onToggleFavorite?.(laptop); }}
        className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white shadow-sm transition ${isFavorite ? 'border-red-100 text-red-500' : 'border-[#e3e9e5] text-[#819087] hover:text-red-500'}`}
      >
        <Heart className={`h-4.5 w-4.5 ${isFavorite ? 'fill-current' : ''}`} />
      </button>
    </div>

    <div className="flex flex-1 flex-col p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-700">{laptop.brand}</span>
        {laptop.upgradeable && <span className="rounded-full bg-primary-50 px-2 py-1 text-[10px] font-bold text-primary-700">Dễ nâng cấp</span>}
      </div>
      <Link to={`/laptops/${laptop.id}`} className="line-clamp-2 min-h-[52px] text-lg font-extrabold leading-6 tracking-[-0.02em] text-[#172019] transition hover:text-primary-700">
        {laptop.name}
      </Link>
      <div className="mt-2 text-xl font-black tracking-[-0.025em] text-[#101713]">{formatCurrency(laptop.price)}</div>

      <div className="mt-5 grid gap-2.5 border-t border-[#edf1ef] pt-4 text-xs text-[#657269]">
        <div className="flex items-center gap-2"><Cpu className="h-4 w-4 shrink-0 text-primary-500" /><span className="truncate">{laptop.cpu}</span></div>
        <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 shrink-0 text-primary-500" /><span className="truncate">{laptop.ram}GB RAM · {laptop.ssd}GB SSD</span></div>
        <div className="flex items-center gap-2"><Monitor className="h-4 w-4 shrink-0 text-primary-500" /><span className="truncate">{laptop.screen}</span></div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
        <Link to={`/laptops/${laptop.id}`} className="btn btn-primary min-h-10 px-4 text-sm">Xem chi tiết</Link>
        <button type="button" onClick={event => { event.preventDefault(); onCompare?.(laptop); }} aria-label="Thêm vào so sánh" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe7e2] text-[#59685f] transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
          <Scale className="h-4 w-4" />
        </button>
      </div>
    </div>
  </article>
);

export default LaptopCard;
