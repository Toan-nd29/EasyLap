import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Scale, Trash2 } from 'lucide-react';
import CompareTable from '../components/CompareTable';

const getStoredCompareList = () => {
  const stored = localStorage.getItem('compareList');
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    return parsed.filter(Boolean);
  } catch (err) {
    console.error('Failed to parse compareList', err);
    localStorage.removeItem('compareList');
    return [];
  }
};

const ComparePage = () => {
  const [compareList, setCompareList] = useState(getStoredCompareList);

  const handleRemove = (laptopId) => {
    const updated = compareList.filter((laptop) => laptop.id !== laptopId);
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
  };

  const handleClear = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7faf8] pb-16">
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between md:py-10 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-700 shadow-sm">
              <Scale className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                Chọn đúng, mua thông minh
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                So sánh laptop
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Đặt thông số cạnh nhau để nhanh chóng nhận ra lựa chọn phù hợp nhất.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
              <div className="flex gap-1.5" aria-hidden="true">
                {[0, 1, 2].map((position) => (
                  <span
                    key={position}
                    className={`h-2.5 w-7 rounded-full ${position < compareList.length ? 'bg-primary-500' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
              {compareList.length}/3 máy
            </div>

            {compareList.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {compareList.length < 2 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(30,55,43,0.07)] sm:px-12 sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-100 bg-primary-50 text-primary-600">
              <Scale className="h-9 w-9" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950">
              {compareList.length === 0 ? 'Bắt đầu bảng so sánh' : 'Chọn thêm một laptop'}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              {compareList.length === 0
                ? 'Bạn cần chọn ít nhất 2 laptop để đối chiếu thông số và tìm ra lựa chọn tốt nhất.'
                : 'Bạn đã chọn 1 laptop. Thêm ít nhất một mẫu nữa để bắt đầu so sánh chi tiết.'}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/laptops"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,184,101,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Thêm từ danh sách laptop
              </Link>
              <Link
                to="/result"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                Xem kết quả Quiz
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <CompareTable laptops={compareList} onRemove={handleRemove} />
        )}
      </section>
    </main>
  );
};

export default ComparePage;
