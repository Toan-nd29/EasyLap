import React, { useState } from 'react';
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
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-8">Đăng nhập hệ thống</h2>
      </div>

      <ErrorMessage message={error} />

      <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
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
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
            Đăng nhập
          </Button>
        </div>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Chưa có tài khoản?</span>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/register" className="w-full flex justify-center btn btn-outline">
            Đăng ký tài khoản mới
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
