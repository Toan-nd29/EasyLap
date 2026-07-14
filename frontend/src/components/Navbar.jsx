import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Menu, Settings, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import BrandLogo from './BrandLogo';

const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/quiz', label: 'Quiz', protected: true },
  { to: '/laptops', label: 'Laptop', protected: true },
  { to: '/compare', label: 'So sánh', protected: true }
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleNavItems = NAV_ITEMS.filter(item => !item.protected || isAuthenticated);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e7ece9] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-5 sm:px-8 xl:px-12">
        <Link to="/" aria-label="EasyLap - Trang chủ" className="shrink-0">
          <BrandLogo compact />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {visibleNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `relative px-4 py-6 text-sm font-semibold transition-colors ${
                isActive ? 'text-primary-600' : 'text-[#536159] hover:text-[#101713]'
              }`}
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && <span className="absolute inset-x-4 bottom-[17px] h-0.5 rounded-full bg-primary-500" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              {user?.role === ROLES.ADMIN && (
                <Link to="/admin" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#536159] hover:bg-[#f3f6f4]"><Settings className="h-4 w-4" /> Admin</Link>
              )}
              <Link to="/profile" className="inline-flex h-10 items-center gap-2 rounded-full border border-[#cfd9d3] bg-white px-4 text-sm font-bold text-[#34463b] transition hover:border-primary-300 hover:text-primary-700"><UserRound className="h-4 w-4" /> Hồ sơ</Link>
              <button onClick={handleLogout} className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#536159] transition hover:bg-[#f3f6f4] hover:text-[#101713]"><LogOut className="h-4 w-4" /> Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex h-10 items-center gap-2 px-2 text-sm font-semibold text-[#536159] hover:text-primary-700"><LogIn className="h-4 w-4" /> Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary min-h-10 px-5 text-sm">Đăng ký</Link>
            </>
          )}
        </div>

        <button type="button" onClick={() => setIsMobileMenuOpen(value => !value)} className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e1e8e4] text-[#34463b] md:hidden" aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}>
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[#e7ece9] bg-white px-5 py-5 shadow-xl md:hidden">
          <nav className="grid gap-1">
            {visibleNavItems.map(item => <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3 text-sm font-bold ${isActive ? 'bg-primary-50 text-primary-700' : 'text-[#536159]'}`}>{item.label}</NavLink>)}
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="rounded-xl px-4 py-3 text-sm font-bold text-[#536159]">Hồ sơ của tôi</Link>
                <Link to="/favorites" className="rounded-xl px-4 py-3 text-sm font-bold text-[#536159]">Laptop yêu thích</Link>
                <Link to="/history" className="rounded-xl px-4 py-3 text-sm font-bold text-[#536159]">Lịch sử Quiz</Link>
                <button onClick={handleLogout} className="mt-2 flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Đăng xuất</button>
              </>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3"><Link to="/login" className="btn btn-outline text-sm">Đăng nhập</Link><Link to="/register" className="btn btn-primary text-sm">Đăng ký</Link></div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
