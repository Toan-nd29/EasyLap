import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleHelp, Database, Laptop, LayoutDashboard, ShieldCheck } from 'lucide-react';
import laptopApi from '../api/laptopApi';
import quizApi from '../api/quizApi';
import Loading from '../components/Loading';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ laptops: 0, questions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const [laptopResult, quizResult] = await Promise.allSettled([
          laptopApi.getAll(),
          quizApi.getAllQuestions()
        ]);
        if (!isMounted) return;
        setStats({
          laptops: laptopResult.status === 'fulfilled'
            ? (laptopResult.value.pagination?.total ?? (laptopResult.value.data || []).length)
            : 0,
          questions: quizResult.status === 'fulfilled'
            ? (quizResult.value.questions || quizResult.value.data || []).length
            : 0
        });
      } catch (error) {
        console.error('Admin stats error', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  if (loading) return <Loading fullScreen />;

  const statCards = [
    {
      label: 'Laptop trong hệ thống',
      value: stats.laptops,
      icon: Laptop,
      to: '/admin/laptops',
      action: 'Quản lý laptop'
    },
    {
      label: 'Câu hỏi tư vấn',
      value: stats.questions,
      icon: CircleHelp,
      to: '/admin/quiz',
      action: 'Quản lý Quiz'
    }
  ];

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f5f8f6] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <section className="relative overflow-hidden rounded-[28px] border border-[#dfe7e2] bg-white px-7 py-9 shadow-[0_18px_48px_rgba(32,55,43,0.07)] sm:px-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-50 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div>
              <span className="eyebrow inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Khu vực quản trị</span>
              <h1 className="mt-3 text-3xl font-black tracking-[-0.04em] text-[#172019] sm:text-4xl">Tổng quan EasyLap</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#66736b]">Quản lý kho laptop và nội dung Quiz trong một không gian rõ ràng, nhất quán.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfe7e2] bg-[#f8faf9] px-4 py-2 text-xs font-extrabold text-[#536159]"><LayoutDashboard className="h-4 w-4 text-primary-500" /> Dashboard</span>
          </div>
        </section>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {statCards.map(card => {
            const Icon = card.icon;
            return (
              <article key={card.to} className="group rounded-[24px] border border-[#dfe7e2] bg-white p-7 shadow-[0_12px_34px_rgba(32,55,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_46px_rgba(32,55,43,0.09)]">
                <div className="flex items-start justify-between gap-5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"><Icon className="h-5 w-5" /></span>
                  <Database className="h-5 w-5 text-[#c1ccc5]" />
                </div>
                <div className="mt-8 text-4xl font-black tracking-[-0.045em] text-[#172019]">{card.value}</div>
                <p className="mt-2 text-sm font-semibold text-[#66736b]">{card.label}</p>
                <Link to={card.to} className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-primary-700 transition group-hover:gap-3">
                  {card.action} <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
