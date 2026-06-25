import React, { useState } from 'react';
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
    
    // Validation
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
        // Optionally navigate immediately or show message then navigate
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

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-8">Tạo tài khoản mới</h2>
      </div>

      <ErrorMessage message={error} />
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-4">
          <div className="text-green-700 text-sm">{success}</div>
        </div>
      )}

      <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
          <div className="mt-1">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Nguyễn Văn A"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <div className="mt-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <div className="mt-1">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
          <div className="mt-1">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
            Đăng ký
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Đã có tài khoản?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/login" className="w-full flex justify-center btn btn-outline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
