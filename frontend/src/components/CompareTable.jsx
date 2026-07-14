import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Cpu,
  ExternalLink,
  Gamepad2,
  HardDrive,
  MemoryStick,
  Monitor,
  MoveHorizontal,
  ShieldCheck,
  Weight,
  Wrench,
  X,
  XCircle,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import LaptopImage from './LaptopImage';

const specifications = [
  { label: 'CPU', key: 'cpu', icon: Cpu },
  { label: 'RAM', key: 'ram', icon: MemoryStick, suffix: 'GB' },
  { label: 'Ổ cứng SSD', key: 'ssd', icon: HardDrive, suffix: 'GB' },
  { label: 'Card đồ họa', key: 'gpu', icon: Gamepad2 },
  { label: 'Màn hình', key: 'screen', icon: Monitor },
  { label: 'Khối lượng', key: 'weight', icon: Weight, suffix: 'kg' },
  { label: 'Bảo hành', key: 'warranty', icon: ShieldCheck },
  { label: 'Khả năng nâng cấp', key: 'upgradeable', icon: Wrench, boolean: true },
];

const renderSpecificationValue = (value, specification) => {
  if (specification.boolean) {
    return value ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Có
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
        Không
      </span>
    );
  }

  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-400">Chưa cập nhật</span>;
  }

  return specification.suffix ? `${value} ${specification.suffix}` : value;
};

const CompareTable = ({ laptops, onRemove }) => {
  if (!laptops || laptops.length === 0) return null;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500 sm:hidden">
        <MoveHorizontal className="h-4 w-4 text-primary-600" aria-hidden="true" />
        Vuốt ngang để xem toàn bộ bảng so sánh
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(30,55,43,0.08)]">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-max border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 z-20 w-36 min-w-36 border-b border-r border-slate-200 bg-slate-50 px-4 py-5 align-bottom sm:w-48 sm:min-w-48 sm:px-5"
                >
                  <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-500">
                    Tiêu chí
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800">Thông số chi tiết</p>
                </th>

                {laptops.map((laptop) => (
                  <th
                    key={laptop.id}
                    scope="col"
                    className="w-60 min-w-60 border-b border-slate-200 bg-white px-4 py-5 align-top sm:w-72 sm:min-w-72 sm:px-6"
                  >
                    <div className="relative flex h-full flex-col">
                      <button
                        type="button"
                        onClick={() => onRemove(laptop.id)}
                        className="absolute right-0 top-0 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        title="Xóa khỏi so sánh"
                        aria-label={`Xóa ${laptop.name} khỏi so sánh`}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>

                      <div className="mb-4 flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-[#edf5f0] p-4">
                        <LaptopImage
                          laptop={laptop}
                          fallbackClassName="h-full w-full"
                          iconClassName="h-6 w-6"
                        />
                      </div>

                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary-700">
                        {laptop.brand || 'Laptop'}
                      </p>
                      <Link
                        to={`/laptops/${laptop.id}`}
                        className="mt-1 line-clamp-2 min-h-11 text-base font-extrabold leading-snug text-slate-950 transition-colors hover:text-primary-700"
                      >
                        {laptop.name}
                      </Link>
                      <p className="mt-2 text-lg font-extrabold text-slate-900">
                        {laptop.price === null || laptop.price === undefined
                          ? 'Chưa cập nhật giá'
                          : formatCurrency(laptop.price)}
                      </p>

                      <Link
                        to={`/laptops/${laptop.id}`}
                        className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                      >
                        Xem chi tiết
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {specifications.map((specification, rowIndex) => {
                const Icon = specification.icon;

                return (
                  <tr key={specification.key} className="group">
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 w-36 min-w-36 border-r border-slate-200 bg-slate-50/95 px-4 py-4 font-bold text-slate-700 backdrop-blur sm:w-48 sm:min-w-48 sm:px-5 ${rowIndex < specifications.length - 1 ? 'border-b' : ''}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary-100 bg-primary-50 text-primary-700">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="leading-snug">{specification.label}</span>
                      </span>
                    </th>

                    {laptops.map((laptop) => (
                      <td
                        key={laptop.id}
                        className={`w-60 min-w-60 bg-white px-4 py-4 font-medium leading-6 text-slate-700 transition-colors group-hover:bg-primary-50/30 sm:w-72 sm:min-w-72 sm:px-6 ${rowIndex < specifications.length - 1 ? 'border-b border-slate-100' : ''}`}
                      >
                        {renderSpecificationValue(laptop[specification.key], specification)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareTable;
