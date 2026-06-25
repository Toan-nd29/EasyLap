import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
              <div className="min-h-[calc(100vh-130px)] flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-gray-600 text-xl mb-8">Trang này không tồn tại.</p>
                <a href="/" className="btn btn-primary">Về trang chủ</a>
              </div>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
