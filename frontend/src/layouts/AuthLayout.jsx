import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#f7faf8] px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-100/70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-[#e2e8e4]/80 blur-3xl" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <BrandLogo />
        <h2 className="mt-3 text-center text-sm text-[#66736b]">
          Chọn đúng, mua chuẩn - Tìm laptop hoàn hảo cho bạn
        </h2>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded-[24px] border border-[#dfe7e2] bg-white px-5 py-8 shadow-[0_20px_60px_rgba(32,55,43,0.10)] sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
