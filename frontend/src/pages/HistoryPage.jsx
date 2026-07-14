import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  History as HistoryIcon,
  Laptop,
  Sparkles,
} from 'lucide-react';
import userApi from '../api/userApi';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatCurrency';

const formatAttemptDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Không rõ thời gian';

  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const HistorySkeleton = () => (
  <div className="space-y-4" aria-label="Đang tải lịch sử Quiz">
    {[0, 1, 2].map((item) => (
      <div
        key={item}
        className="animate-pulse rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_12px_36px_rgba(30,55,43,0.06)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="h-7 w-32 rounded-full bg-primary-50" />
            <div className="h-4 w-2/3 rounded-full bg-slate-200" />
            <div className="h-3 w-1/2 rounded-full bg-slate-100" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await userApi.getHistory();
        if (res.success) {
          setHistory(res.history || []);
        } else {
          setError('Không thể tải lịch sử Quiz.');
        }
      } catch (err) {
        setError(err.message || 'Lỗi kết nối máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleExpanded = (id) => {
    setExpanded((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#f7faf8] pb-16">
      <section className="border-b border-slate-200/70 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-end md:justify-between md:py-10 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-700 shadow-sm">
              <HistoryIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">
                Hành trình lựa chọn
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Lịch sử Quiz
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Xem lại kết quả và các mẫu laptop đã được đề xuất cho bạn.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="flex h-8 min-w-8 items-center justify-center rounded-xl bg-white px-2 font-extrabold text-primary-700 shadow-sm">
              {loading ? '—' : history.length}
            </span>
            lần làm Quiz
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} />
          </div>
        )}

        {loading ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-[0_18px_50px_rgba(30,55,43,0.07)] sm:px-12 sm:py-20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-primary-100 bg-primary-50 text-primary-600">
              <Sparkles className="h-9 w-9" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-950">
              Chưa có lịch sử Quiz
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
              Hoàn thành bài Quiz để nhận gợi ý laptop phù hợp với nhu cầu và ngân sách của bạn.
            </p>
            <Link
              to="/quiz"
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,184,101,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-700"
            >
              Làm Quiz ngay
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((attempt) => {
              const isExpanded = Boolean(expanded[attempt.id]);
              const recommendations = attempt.recommendations || [];

              return (
                <article
                  key={attempt.id}
                  className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_36px_rgba(30,55,43,0.06)] transition duration-300 hover:border-primary-200 hover:shadow-[0_18px_42px_rgba(30,55,43,0.1)]"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-800">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            {attempt.user_group || 'Kết quả Quiz'}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                            <CalendarDays className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            {formatAttemptDate(attempt.created_at)}
                          </span>
                        </div>

                        {attempt.summary && (
                          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
                            {attempt.summary}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleExpanded(attempt.id)}
                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                        aria-expanded={isExpanded}
                        aria-controls={`recommendations-${attempt.id}`}
                      >
                        {isExpanded ? 'Thu gọn' : `Xem ${recommendations.length} gợi ý`}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded && recommendations.length > 0 && (
                    <div
                      id={`recommendations-${attempt.id}`}
                      className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6"
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-extrabold text-slate-800">
                          Laptop được gợi ý
                        </h2>
                        <span className="text-xs font-semibold text-slate-400">
                          {recommendations.length} lựa chọn
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        {recommendations.map((recommendation) => (
                          <div
                            key={recommendation.id}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                              <Laptop className="h-5 w-5" aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <Link
                                to={`/laptops/${recommendation.laptop_id}`}
                                className="block truncate text-sm font-bold text-slate-900 transition-colors hover:text-primary-700"
                              >
                                {recommendation.laptops?.name || 'Laptop'}
                              </Link>
                              {recommendation.laptops?.price && (
                                <p className="mt-0.5 text-xs font-medium text-slate-500">
                                  {formatCurrency(recommendation.laptops.price)}
                                </p>
                              )}
                            </div>
                            <div className="shrink-0 rounded-xl bg-primary-50 px-3 py-2 text-center">
                              <p className="text-lg font-extrabold leading-none text-primary-700">
                                {recommendation.final_score ?? '—'}
                              </p>
                              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary-700/70">
                                điểm
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default HistoryPage;
