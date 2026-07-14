import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import LaptopListPage from './pages/LaptopListPage';
import LaptopDetailPage from './pages/LaptopDetailPage';
import ComparePage from './pages/ComparePage';
import FavoritesPage from './pages/FavoritesPage';
import HistoryPage from './pages/HistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLaptopPage from './pages/AdminLaptopPage';
import AdminQuizPage from './pages/AdminQuizPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Main routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />

            {/* Protected routes */}
            <Route path="/quiz" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
            <Route path="/result" element={<PrivateRoute><ResultPage /></PrivateRoute>} />
            <Route path="/laptops" element={<PrivateRoute><LaptopListPage /></PrivateRoute>} />
            <Route path="/laptops/:id" element={<PrivateRoute><LaptopDetailPage /></PrivateRoute>} />
            <Route path="/compare" element={<PrivateRoute><ComparePage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            <Route path="/admin/laptops" element={<AdminRoute><AdminLaptopPage /></AdminRoute>} />
            <Route path="/admin/quiz" element={<AdminRoute><AdminQuizPage /></AdminRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex min-h-[calc(100vh-180px)] items-center justify-center bg-[#f5f8f6] px-5 py-16">
                <div className="surface-panel w-full max-w-lg px-8 py-12 text-center sm:px-12">
                  <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600"><FileQuestion className="h-8 w-8" /></span>
                  <p className="eyebrow mt-6">Lỗi 404</p>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-[#172019]">Không tìm thấy trang</h1>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#66736b]">Đường dẫn này không tồn tại hoặc đã được thay đổi. Hãy quay lại trang chủ để tiếp tục.</p>
                  <a href="/" className="btn btn-primary mt-7"><ArrowLeft className="h-4 w-4" /> Về trang chủ</a>
                </div>
              </div>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
