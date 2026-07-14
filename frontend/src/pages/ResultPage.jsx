import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import userApi from '../api/userApi';
import {
  ArrowRight,
  ClipboardList,
  Cpu,
  HardDrive,
  Info,
  Layers,
  Monitor,
  RotateCcw,
  Scale,
  Sparkles,
  Target
} from 'lucide-react';

const getStoredResult = () => {
  const stored = sessionStorage.getItem('quizResult');
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error('Failed to parse quizResult', err);
    sessionStorage.removeItem('quizResult');
    return null;
  }
};

const ResultPage = () => {
  const navigate = useNavigate();
  const [result] = useState(getStoredResult);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await userApi.getFavorites();
        if (res.success) {
          setFavorites((res.favorites || []).map(f => f.laptop_id));
        }
      } catch (err) {
        console.error('Could not load favorites', err);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (laptop) => {
    const isFav = favorites.includes(laptop.id);
    try {
      if (isFav) {
        await userApi.removeFavorite(laptop.id);
        setFavorites(favorites.filter(id => id !== laptop.id));
      } else {
        await userApi.addFavorite(laptop.id);
        setFavorites([...favorites, laptop.id]);
      }
    } catch (err) {
      console.error('Toggle favorite error', err);
    }
  };

  const handleCompare = (laptop) => {
    const stored = localStorage.getItem('compareList');
    const list = stored ? JSON.parse(stored) : [];
    if (list.find(l => l.id === laptop.id)) return;
    if (list.length >= 3) {
      alert('Chỉ có thể so sánh tối đa 3 máy!');
      return;
    }
    list.push(laptop);
    localStorage.setItem('compareList', JSON.stringify(list));
    if (window.confirm('Đã thêm vào danh sách so sánh. Chuyển đến trang so sánh?')) {
      navigate('/compare');
    }
  };

  if (!result) {
    return (
      <main className="relative flex min-h-[calc(100vh-64px)] items-center justify-center overflow-hidden bg-[#f5f8f6] px-4 py-12">
        <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-white blur-3xl" />
        <section className="relative w-full max-w-lg rounded-[28px] border border-[#e1e8e4] bg-white p-7 text-center shadow-[0_24px_70px_rgba(32,55,43,0.10)] sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] border border-primary-100 bg-primary-50 text-primary-700 shadow-[0_10px_24px_rgba(37,200,117,0.12)]">
            <ClipboardList className="h-8 w-8" strokeWidth={1.6} aria-hidden="true" />
          </div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.17em] text-primary-700">Tư vấn EasyLap</p>
          <h1 className="text-2xl font-black tracking-[-0.035em] text-[#111a14] sm:text-3xl">Chưa có kết quả gợi ý</h1>
          <p className="mx-auto mt-4 max-w-sm leading-7 text-[#66756c]">
            Hoàn thành bài tư vấn ngắn để nhận danh sách laptop phù hợp với nhu cầu của bạn.
          </p>
          <Link to="/quiz" className="btn btn-primary mt-8 w-full gap-2 shadow-[0_10px_24px_rgba(37,200,117,0.22)]">
            Làm Quiz ngay
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </section>
      </main>
    );
  }

  const { userGroup, summary, recommendedConfig, recommendations } = result;
  const configItems = recommendedConfig ? [
    { key: 'cpu', label: 'Bộ xử lý', value: recommendedConfig.cpu, icon: Cpu },
    { key: 'ram', label: 'Bộ nhớ RAM', value: recommendedConfig.ram, icon: Layers },
    { key: 'ssd', label: 'Ổ cứng', value: recommendedConfig.ssd, icon: HardDrive },
    { key: 'gpu', label: 'Card đồ họa', value: recommendedConfig.gpu, icon: Monitor }
  ].filter(item => item.value) : [];

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f5f8f6] py-8 sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-[36rem] h-96 w-96 rounded-full bg-white blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="relative mb-7 overflow-hidden rounded-[28px] border border-[#dfe8e2] bg-white shadow-[0_20px_60px_rgba(32,55,43,0.08)] sm:mb-8">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-primary-400 to-primary-600" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-50 blur-2xl" />
          <div className="relative grid items-center gap-7 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1fr_auto] lg:px-12">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-primary-700">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
                Phân tích hoàn tất
              </div>
              <h1 className="text-3xl font-black tracking-[-0.04em] text-[#101713] sm:text-4xl">Kết quả gợi ý của bạn</h1>
              {summary && <p className="mt-4 max-w-3xl text-base leading-7 text-[#607067] sm:text-lg">{summary}</p>}
              {userGroup && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#dfe8e2] bg-[#f8faf9] px-4 py-2 text-sm text-[#536159]">
                  <Target className="h-4 w-4 text-primary-600" strokeWidth={1.8} aria-hidden="true" />
                  Nhóm người dùng: <span className="font-extrabold text-[#172019]">{userGroup}</span>
                </div>
              )}
            </div>
            <div className="hidden h-28 w-28 items-center justify-center rounded-[28px] border border-primary-100 bg-primary-50 text-primary-600 shadow-[0_14px_34px_rgba(37,200,117,0.13)] lg:flex">
              <Sparkles className="h-12 w-12" strokeWidth={1.35} aria-hidden="true" />
            </div>
          </div>
        </section>

        {recommendedConfig && (
          <section className="mb-10 rounded-[26px] border border-[#e1e8e4] bg-white p-5 shadow-[0_14px_42px_rgba(32,55,43,0.06)] sm:p-7 lg:p-8">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-primary-50 text-primary-700">
                <Cpu className="h-5 w-5" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.15em] text-primary-700">Thông số mục tiêu</p>
                <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-[#172019] sm:text-2xl">Cấu hình khuyến nghị</h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {configItems.map(({ key, label, value, icon: Icon }) => (
                <div key={key} className="rounded-[18px] border border-[#e2e9e5] bg-[#f8faf9] p-4 transition hover:border-primary-200 hover:bg-primary-50/60 sm:p-5">
                  <Icon className="mb-4 h-5 w-5 text-primary-600" strokeWidth={1.7} aria-hidden="true" />
                  <div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#7a8880]">{label}</div>
                  <div className="mt-1.5 font-extrabold leading-6 text-[#213027]">{value}</div>
                </div>
              ))}
            </div>

            {recommendedConfig.note && (
              <div className="mt-5 flex items-start gap-3 rounded-[18px] border border-amber-200/80 bg-amber-50/70 p-4 text-sm leading-6 text-amber-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
                <p><strong>Lưu ý:</strong> {recommendedConfig.note}</p>
              </div>
            )}
          </section>
        )}

        <section>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary-700">Danh sách đề xuất</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#111a14] sm:text-3xl">Laptop phù hợp nhất với bạn</h2>
            </div>
            {!!recommendations?.length && (
              <span className="rounded-full border border-[#dfe8e2] bg-white px-4 py-2 text-sm font-bold text-[#65746b] shadow-sm">
                {recommendations.length} lựa chọn
              </span>
            )}
          </div>

          <div className="space-y-5 sm:space-y-6">
            {recommendations && recommendations.map((rec, idx) => (
              <ResultCard
                key={rec.laptop?.id || idx}
                result={rec}
                isFavorite={favorites.includes(rec.laptop?.id)}
                onToggleFavorite={handleToggleFavorite}
                onCompare={handleCompare}
              />
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col justify-center gap-3 border-t border-[#dfe7e2] pt-8 sm:flex-row sm:flex-wrap">
          <Link to="/quiz" className="btn btn-outline gap-2 px-7">
            <RotateCcw className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Làm lại Quiz
          </Link>
          <Link to="/laptops" className="btn btn-secondary gap-2 px-7">
            <Monitor className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            Xem tất cả Laptop
          </Link>
          <Link to="/compare" className="btn btn-primary gap-2 px-7 shadow-[0_10px_24px_rgba(37,200,117,0.20)]">
            <Scale className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
            So sánh máy đã chọn
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ResultPage;
