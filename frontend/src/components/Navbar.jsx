import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Laptop, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { ROLES } from '../utils/constants';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      <Link to="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Trang chủ</Link>
      {isAuthenticated && (
        <>
          <Link to="/quiz" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Làm Quiz</Link>
          <Link to="/laptops" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Laptop</Link>
          <Link to="/compare" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">So sánh</Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Laptop className="h-8 w-8 text-primary-600" />
              <span className="font-bold text-xl tracking-tight text-gray-900">EasyLap</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-2">
              <NavLinks />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.role === ROLES.ADMIN && (
                  <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1">
                    <Settings className="w-4 h-4" /> Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-1 text-gray-600 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.full_name || 'Tài khoản'}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline text-sm py-1.5 flex items-center gap-1">
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary text-sm py-2">Đăng ký</Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <NavLinks />
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-100 my-2 pt-2"></div>
                {user?.role === ROLES.ADMIN && (
                  <Link to="/admin" className="text-purple-600 hover:text-purple-800 px-3 py-2 rounded-md font-medium flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Admin Dashboard
                  </Link>
                )}
                <Link to="/profile" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium flex items-center gap-2">
                  <User className="w-5 h-5" /> Tài khoản của tôi
                </Link>
                <Link to="/favorites" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Laptop yêu thích</Link>
                <Link to="/history" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Lịch sử Quiz</Link>
                <button onClick={handleLogout} className="w-full text-left text-red-600 hover:bg-red-50 px-3 py-2 rounded-md font-medium flex items-center gap-2 mt-2">
                  <LogOut className="w-5 h-5" /> Đăng xuất
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2 pt-2"></div>
                <Link to="/login" className="block text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md font-medium">Đăng nhập</Link>
                <Link to="/register" className="block text-primary-600 font-medium px-3 py-2">Đăng ký tài khoản mới</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
