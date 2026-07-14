import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cpu,
  HardDrive,
  Heart,
  MemoryStick,
  Trash2,
} from 'lucide-react';
import userApi from '../api/userApi';
import ErrorMessage from '../components/ErrorMessage';
import LaptopImage from '../components/LaptopImage';
import { formatCurrency } from '../utils/formatCurrency';

const FavoritesSkeleton = () => (
  <div className="space-y-4" aria-label="Đang tải danh sách laptop yêu thích">
    {[0, 1, 2].map((item) => (
      <div
        key={item}
        className="animate-pulse rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_36px_rgba(30,55,43,0.06)]"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="h-44 w-full rounded-2xl bg-slate-100 sm:h-32 sm:w-40" />
          <div className="flex-1 space-y-3">
            <div className="h-3 w-20 rounded-full bg-slate-100" />
            <div className="h-5 w-2/3 rounded-full bg-slate-200" />
            <div className="h-4 w-28 rounded-full bg-slate-100" />
          </div>
          <div className="h-11 w-full rounded-xl bg-slate-100 sm:w-32" />
        </div>
      </div>
    ))}
  </div>
);

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await userApi.getFavorites();
        if (res.success) {
          setFavorites(res.favorites || []);
        } else {
          setError('Không thể tải danh sách yêu thích.');
        }
      } catch (err) {
        setError(err.message || 'Lỗi kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (laptopId) => {
    try {
      await userApi.removeFavorite(laptopId);
      setFavorites((previous) => previous.filter((favorite) => {
        const favoriteLaptopId = favorite.laptop_id ?? favorite.laptops?.id ?? favorite.id;
        return favoriteLaptopId !== laptopId;
      }));
    } catch (err) {
      console.error('Remove favorite error', err);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7faf8] pb-16">
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between md:py-10 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-700 shadow-sm">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                Không gian cá nhân
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Laptop yêu thích
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Lưu lại những lựa chọn phù hợp để dễ dàng xem lại và cân nhắc.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-white px-2 font-extrabold text-primary-700 shadow-sm">
              {loading ? '—' : favorites.length}
            </span>
            laptop đã lưu
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading ? (
          <FavoritesSkeleton />
        ) : favorites.length === 0 ? (
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(30,55,43,0.07)] sm:px-12 sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-100 bg-primary-50 text-primary-600">
              <Heart className="h-9 w-9" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950">
              Chưa có laptop yêu thích
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Khám phá kho laptop và nhấn biểu tượng trái tim để lưu lại những mẫu bạn quan tâm.
            </p>
            <Link
              to="/laptops"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,184,101,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-[0_14px_28px_rgba(22,184,101,0.28)]"
            >
              Khám phá laptop
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => {
              const laptop = favorite.laptops || favorite;
              const laptopId = favorite.laptop_id ?? laptop.id;

              return (
                <article
                  key={laptopId}
                  className="group rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_12px_36px_rgba(30,55,43,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(30,55,43,0.1)] sm:p-5"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-44 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-[#edf5f0] p-4 sm:h-32 sm:w-40">
                      <LaptopImage
                        laptop={laptop}
                        fallbackClassName="h-full w-full"
                        iconClassName="h-6 w-6"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary-700">
                        {laptop.brand || 'Laptop'}
                      </p>
                      <Link
                        to={`/laptops/${laptopId}`}
                        className="mt-1 block text-lg font-extrabold leading-snug text-slate-950 transition-colors hover:text-primary-700 sm:text-xl"
                      >
                        {laptop.name}
                      </Link>
                      <p className="mt-2 text-lg font-extrabold text-slate-900">
                        {laptop.price === null || laptop.price === undefined
                          ? 'Chưa cập nhật giá'
                          : formatCurrency(laptop.price)}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                        {laptop.cpu && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
                            <Cpu className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                            {laptop.cpu}
                          </span>
                        )}
                        {laptop.ram && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
                            <MemoryStick className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                            {laptop.ram}GB RAM
                          </span>
                        )}
                        {laptop.ssd && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5">
                            <HardDrive className="h-3.5 w-3.5 text-primary-600" aria-hidden="true" />
                            {laptop.ssd}GB SSD
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:flex-col">
                      <Link
                        to={`/laptops/${laptopId}`}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 sm:flex-none"
                      >
                        Chi tiết
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(laptopId)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:flex-none"
                        aria-label={`Bỏ lưu ${laptop.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        Bỏ lưu
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default FavoritesPage;
