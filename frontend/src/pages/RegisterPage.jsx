import { useState } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, Mail, ShieldCheck, UserRound, UserRoundPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register(email, password, fullName);
      if (res.success) {
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.message || 'Đăng ký thất bại, vui lòng thử lại');
      }
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = 'block h-13 w-full rounded-[18px] border border-[#dce5df] bg-[#f7faf8] pl-12 pr-4 text-[15px] text-[#172019] shadow-inner shadow-black/[0.015] outline-none transition placeholder:text-[#9aa69f] hover:border-[#cbd8d0] focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100/60';
  const iconClassName = 'pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91a098] transition-colors group-focus-within:text-primary-600';

  return (
    <section className="relative">
      <header className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] border border-primary-100 bg-primary-50 text-primary-600 shadow-[0_10px_28px_rgba(37,200,117,0.12)]">
          <UserRoundPlus className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary-600">
          Bắt đầu cùng EasyLap
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#172019]">
          Tạo tài khoản
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#718078]">
          Lưu lựa chọn và nhận gợi ý laptop phù hợp với nhu cầu của bạn.
        </p>
      </header>

      <div className="mb-4" aria-live="polite">
        <ErrorMessage message={error} />
      </div>

      {success && (
        <div className="mb-4 flex items-start gap-3 rounded-[18px] border border-primary-200 bg-primary-50 px-4 py-3.5 text-sm font-semibold leading-5 text-primary-800" role="status">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" strokeWidth={1.9} />
          <span>{success}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="register-full-name" className="mb-2 block text-sm font-bold text-[#34463b]">
            Họ và tên
          </label>
          <div className="group relative">
            <UserRound className={iconClassName} strokeWidth={1.8} />
            <input
              id="register-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className={inputClassName}
              placeholder="Nguyễn Văn A"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="mb-2 block text-sm font-bold text-[#34463b]">
            Email
          </label>
          <div className="group relative">
            <Mail className={iconClassName} strokeWidth={1.8} />
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputClassName}
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="register-password" className="block text-sm font-bold text-[#34463b]">
              Mật khẩu
            </label>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#829088]">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-500" strokeWidth={1.8} />
              Tối thiểu 6 ký tự
            </span>
          </div>
          <div className="group relative">
            <LockKeyhole className={iconClassName} strokeWidth={1.8} />
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClassName}
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label htmlFor="register-confirm-password" className="mb-2 block text-sm font-bold text-[#34463b]">
            Xác nhận mật khẩu
          </label>
          <div className="group relative">
            <LockKeyhole className={iconClassName} strokeWidth={1.8} />
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClassName}
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="mt-1 h-14 w-full !rounded-[18px] shadow-[0_12px_28px_rgba(37,200,117,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(37,200,117,0.3)]"
          isLoading={isSubmitting}
        >
          <span className="inline-flex items-center gap-2">
            Tạo tài khoản
            <ArrowRight className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-[#e4ebe7]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa69f]">Hoặc</span>
        <span className="h-px flex-1 bg-[#e4ebe7]" />
      </div>

      <div className="text-center">
        <p className="mb-3 text-sm text-[#718078]">Đã có tài khoản?</p>
        <Link
          to="/login"
          className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-[18px] border border-[#dce5df] bg-white px-5 text-sm font-extrabold text-[#34463b] shadow-[0_8px_24px_rgba(32,55,43,0.05)] transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
        >
          Đăng nhập
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.9} />
        </Link>
      </div>
    </section>
  );
};

export default RegisterPage;
