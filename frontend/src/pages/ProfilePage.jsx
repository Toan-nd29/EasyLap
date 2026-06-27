import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user, fetchCurrentUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!fullName.trim()) {
      setError('Tên không được để trống');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await userApi.updateProfile({ full_name: fullName });
      if (res.success) {
        setSuccess('Cập nhật thành công!');
        fetchCurrentUser();
      } else {
        setError(res.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        </div>

        <div className="card">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 select-none">
              {(user?.full_name || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{user?.full_name || 'Người dùng'}</div>
              <div className="text-gray-500">{user?.email}</div>
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                {user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ErrorMessage message={error} />
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <div className="text-green-700 text-sm">{success}</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <input
                type="text"
                value={user?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Lưu thay đổi
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
