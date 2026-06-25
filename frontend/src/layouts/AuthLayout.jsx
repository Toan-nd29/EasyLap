import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Laptop } from 'lucide-react';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <Laptop className="h-10 w-10 text-primary-600" />
          <span className="text-3xl font-bold text-gray-900 tracking-tight">EasyLap</span>
        </div>
        <h2 className="mt-2 text-center text-sm text-gray-600">
          Chọn đúng, mua chuẩn - Tìm laptop hoàn hảo cho bạn
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
