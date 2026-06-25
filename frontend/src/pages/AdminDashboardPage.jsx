import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import laptopApi from '../api/laptopApi';
import quizApi from '../api/quizApi';
import { Laptop, HelpCircle, LayoutDashboard } from 'lucide-react';
import Loading from '../components/Loading';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ laptops: 0, questions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [lapRes, quizRes] = await Promise.allSettled([
          laptopApi.getAll(),
          quizApi.getAllQuestions()
        ]);
        setStats({
          laptops: lapRes.status === 'fulfilled' ? (lapRes.value.data || []).length : 0,
          questions: quizRes.status === 'fulfilled' ? (quizRes.value.data || []).length : 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <LayoutDashboard className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="card text-center">
            <Laptop className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.laptops}</div>
            <div className="text-gray-600">Laptop trong hệ thống</div>
            <Link to="/admin/laptops" className="btn btn-primary mt-4 w-full">Quản lý Laptop</Link>
          </div>
          <div className="card text-center">
            <HelpCircle className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.questions}</div>
            <div className="text-gray-600">Câu hỏi Quiz</div>
            <Link to="/admin/quiz" className="btn btn-primary mt-4 w-full">Quản lý Quiz</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
