import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock3, Heart, History, Laptop, Mail, Pencil, Save, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const ProfilePage = () => {
  const { user, fetchCurrentUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState({ favorites: null, history: null });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFullName(user?.full_name || '');
  }, [user?.full_name]);

  useEffect(() => {
    let isMounted = true;
    const loadSummary = async () => {
      const [favoriteResponse, historyResponse] = await Promise.allSettled([
        userApi.getFavorites(),
        userApi.getHistory()
      ]);
      if (!isMounted) return;
      setSummary({
        favorites: favoriteResponse.status === 'fulfilled' && favoriteResponse.value.success
          ? (favoriteResponse.value.favorites || favoriteResponse.value.data || []).length
          : null,
        history: historyResponse.status === 'fulfilled' && historyResponse.value.success
          ? (historyResponse.value.history || historyResponse.value.data || []).length
          : null
      });
    };
    loadSummary();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!fullName.trim()) {
      setError('Tên không được để trống.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await userApi.updateProfile({ full_name: fullName.trim() });
      if (response.success) {
        setSuccess('Tên hiển thị đã được cập nhật.');
        await fetchCurrentUser();
        setIsEditing(false);
      } else {
        setError(response.message || 'Cập nhật thất bại.');
      }
    } catch (requestError) {
      setError(requestError.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = user?.full_name || 'Người dùng EasyLap';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map(part => part.charAt(0).toUpperCase())
    .join('') || '?';
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f4f7f5] py-10 sm:py-14">
      <div className="mx-auto max-w-[1360px] px-5 sm:px-8 xl:px-12">
        <section className="relative overflow-hidden rounded-[26px] border border-[#e1e8e4] bg-white px-6 py-8 shadow-[0_12px_40px_rgba(32,55,43,0.06)] sm:px-10 lg:px-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-50 blur-3xl" />
          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-[#eef7f2] bg-gradient-to-br from-[#c8f4dc] via-[#eefaf3] to-[#d8f1f3] text-3xl font-black text-primary-800 shadow-inner">
                  {initials}
                </div>
                <button type="button" onClick={() => setIsEditing(true)} aria-label="Chỉnh sửa hồ sơ" className="absolute bottom-0 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-white shadow-md transition hover:bg-primary-600">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
              <div>
                <p className="mb-1 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-600">Hồ sơ cá nhân</p>
                <h1 className="text-3xl font-black tracking-[-0.04em] text-[#263a4e] sm:text-4xl">{displayName}</h1>
                <p className="mt-3 flex items-center gap-2 text-sm text-[#6f7e8b]"><Mail className="h-4 w-4" /> {user?.email}</p>
                <span className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.06em] ${isAdmin ? 'bg-violet-50 text-violet-700' : 'bg-primary-50 text-primary-700'}`}>
                  <UserRound className="h-3.5 w-3.5" /> {isAdmin ? 'Quản trị viên' : 'Người dùng'}
                </span>
              </div>
            </div>

            <button type="button" onClick={() => { setIsEditing(true); setSuccess(''); setError(''); }} className="btn btn-outline self-start border-primary-400 px-6 text-primary-600 md:self-auto">
              <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa tên
            </button>
          </div>
        </section>

        {(isEditing || error || success) && (
          <section className="mt-6 rounded-[22px] border border-[#e1e8e4] bg-white p-6 shadow-[0_10px_30px_rgba(32,55,43,0.05)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div><h2 className="text-xl font-black text-[#263a4e]">Chỉnh sửa thông tin</h2><p className="mt-1 text-sm text-[#728078]">Bạn có thể thay đổi tên hiển thị của tài khoản.</p></div>
              {isEditing && <button type="button" onClick={() => { setIsEditing(false); setFullName(user?.full_name || ''); setError(''); }} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e1e8e4] text-[#66736b]"><X className="h-4 w-4" /></button>}
            </div>

            {error && <div className="mt-5"><ErrorMessage message={error} /></div>}
            {success && <div className="mt-5 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800">{success}</div>}

            {isEditing && (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                <div>
                  <label htmlFor="profile-full-name" className="mb-2 block text-sm font-extrabold text-[#405047]">Họ và tên</label>
                  <input id="profile-full-name" type="text" value={fullName} onChange={event => setFullName(event.target.value)} className="h-12 w-full rounded-xl border border-[#dbe4de] bg-[#f8faf9] px-4 text-sm outline-none focus:border-primary-300 focus:bg-white" placeholder="Nhập họ và tên" />
                </div>
                <Button type="submit" isLoading={isSubmitting} className="h-12 px-7"><Save className="mr-2 h-4 w-4" /> Lưu thay đổi</Button>
              </form>
            )}
          </section>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link to="/favorites" className="group relative min-h-[250px] overflow-hidden rounded-[26px] border border-[#e1e8e4] bg-white p-8 shadow-[0_12px_36px_rgba(32,55,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_44px_rgba(32,55,43,0.09)] sm:p-10">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f5f3] text-[#78877e] transition group-hover:bg-primary-50 group-hover:text-primary-600"><Laptop className="h-6 w-6" /></span>
            <h2 className="mt-8 text-2xl font-black tracking-[-0.03em] text-[#263a4e]">Laptop Yêu Thích</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#71808c]">Xem lại danh sách {summary.favorites ?? ''} laptop bạn đã đánh dấu quan tâm.</p>
            <span className="absolute bottom-8 right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"><ChevronRight className="h-5 w-5" /></span>
          </Link>

          <Link to="/history" className="group relative min-h-[250px] overflow-hidden rounded-[26px] border border-[#dfe9e4] bg-gradient-to-br from-[#f3fbf7] to-[#eaf8f2] p-8 shadow-[0_12px_36px_rgba(32,55,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_44px_rgba(32,55,43,0.09)] sm:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary-100/60 blur-3xl" />
            <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white text-primary-500 shadow-sm"><History className="h-6 w-6" /></span>
            <h2 className="relative mt-8 text-2xl font-black tracking-[-0.03em] text-[#263a4e]">Lịch Sử Quiz</h2>
            <p className="relative mt-3 max-w-md text-sm leading-6 text-[#71808c]">Xem lại {summary.history ?? ''} kết quả chẩn đoán nhu cầu để tìm laptop phù hợp.</p>
            <span className="absolute bottom-8 right-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-600 opacity-0 shadow-sm transition group-hover:translate-x-1 group-hover:opacity-100"><ChevronRight className="h-5 w-5" /></span>
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-[#e3e9e5] bg-white px-6 py-5 text-sm text-[#67756c]">
          <Clock3 className="h-5 w-5 text-primary-500" />
          <span>Thông tin tài khoản được đồng bộ an toàn với dữ liệu EasyLap hiện có.</span>
          <Link to="/favorites" className="ml-auto inline-flex items-center gap-1 font-bold text-primary-700 hover:text-primary-800"><Heart className="h-4 w-4" /> Xem mục đã lưu</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
