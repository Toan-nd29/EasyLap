import { useState } from 'react';
import { ArrowRight, LockKeyhole, LogIn, Mail, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/quiz');
      } else {
        setError(res.message || 'Email hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError(err.message || 'Email hoặc mật khẩu không đúng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative">
      <header className="mb-7 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-[20px] border border-primary-100 bg-primary-50 text-primary-600 shadow-[0_10px_28px_rgba(37,200,117,0.12)]">
          <LogIn className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary-600">
          Tài khoản EasyLap
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#172019]">
          Đăng nhập
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#718078]">
          Tiếp tục hành trình tìm chiếc laptop phù hợp nhất với bạn.
        </p>
      </header>

      <div className="mb-5" aria-live="polite">
        <ErrorMessage message={error} />
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold text-[#34463b]">
            Email
          </label>
          <div className="group relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91a098] transition-colors group-focus-within:text-primary-600" strokeWidth={1.8} />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="block h-14 w-full rounded-[18px] border border-[#dce5df] bg-[#f7faf8] pl-12 pr-4 text-[15px] text-[#172019] shadow-inner shadow-black/[0.015] outline-none transition placeholder:text-[#9aa69f] hover:border-[#cbd8d0] focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100/60"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <label htmlFor="login-password" className="block text-sm font-bold text-[#34463b]">
              Mật khẩu
            </label>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#829088]">
              <ShieldCheck className="h-3.5 w-3.5 text-primary-500" strokeWidth={1.8} />
              Bảo mật an toàn
            </span>
          </div>
          <div className="group relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#91a098] transition-colors group-focus-within:text-primary-600" strokeWidth={1.8} />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="block h-14 w-full rounded-[18px] border border-[#dce5df] bg-[#f7faf8] pl-12 pr-4 text-[15px] text-[#172019] shadow-inner shadow-black/[0.015] outline-none transition placeholder:text-[#9aa69f] hover:border-[#cbd8d0] focus:border-primary-400 focus:bg-white focus:ring-4 focus:ring-primary-100/60"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="h-14 w-full !rounded-[18px] shadow-[0_12px_28px_rgba(37,200,117,0.24)] hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(37,200,117,0.3)]"
          isLoading={isSubmitting}
        >
          <span className="inline-flex items-center gap-2">
            Đăng nhập
            <ArrowRight className="h-4.5 w-4.5" strokeWidth={2} />
          </span>
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-[#e4ebe7]" />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9aa69f]">Hoặc</span>
        <span className="h-px flex-1 bg-[#e4ebe7]" />
      </div>

      <div className="text-center">
        <p className="mb-3 text-sm text-[#718078]">Chưa có tài khoản?</p>
        <Link
          to="/register"
          className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-[18px] border border-[#dce5df] bg-white px-5 text-sm font-extrabold text-[#34463b] shadow-[0_8px_24px_rgba(32,55,43,0.05)] transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
        >
          Tạo tài khoản mới
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.9} />
        </Link>
      </div>
    </section>
  );
};

export default LoginPage;
