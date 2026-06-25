import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import userApi from '../api/userApi';
import { ClipboardList } from 'lucide-react';

const ResultPage = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to parse quizResult', err);
        sessionStorage.removeItem('quizResult');
      }
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await userApi.getFavorites();
      if (res.success) {
        setFavorites((res.favorites || []).map(f => f.laptop_id));
      }
    } catch (err) {
      console.error('Could not load favorites', err);
    }
  };

  const handleToggleFavorite = async (laptop) => {
    const isFav = favorites.includes(laptop.id);
    try {
      if (isFav) {
        await userApi.removeFavorite(laptop.id);
        setFavorites(favorites.filter(id => id !== laptop.id));
      } else {
        await userApi.addFavorite(laptop.id);
        setFavorites([...favorites, laptop.id]);
      }
    } catch (err) {
      console.error('Toggle favorite error', err);
    }
  };

  const handleCompare = (laptop) => {
    const stored = localStorage.getItem('compareList');
    const list = stored ? JSON.parse(stored) : [];
    if (list.find(l => l.id === laptop.id)) return;
    if (list.length >= 3) {
      alert('Chỉ có thể so sánh tối đa 3 máy!');
      return;
    }
    list.push(laptop);
    localStorage.setItem('compareList', JSON.stringify(list));
    if (window.confirm('Đã thêm vào danh sách so sánh. Chuyển đến trang so sánh?')) {
      navigate('/compare');
    }
  };

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center card max-w-md w-full">
          <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Chưa có kết quả gợi ý</h2>
          <p className="text-gray-600 mb-8">Bạn chưa có kết quả gợi ý nào. Hãy làm quiz để nhận gợi ý laptop phù hợp.</p>
          <Link to="/quiz" className="btn btn-primary w-full">Làm Quiz ngay</Link>
        </div>
      </div>
    );
  }

  const { userGroup, summary, recommendedConfig, recommendations } = result;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card mb-8 text-center bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
          <h1 className="text-3xl font-bold mb-2">Kết quả gợi ý của bạn</h1>
          {userGroup && (
            <p className="text-primary-100 mb-4">Nhóm người dùng: <span className="font-semibold text-white">{userGroup}</span></p>
          )}
          {summary && <p className="text-primary-100">{summary}</p>}
        </div>

        {/* Recommended Config */}
        {recommendedConfig && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cấu hình khuyến nghị cho bạn</h2>
            <div className="grid grid-cols-2 gap-4">
              {recommendedConfig.cpu && (
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-gray-500 mb-1">CPU</div>
                  <div className="text-base font-semibold text-primary-700">{recommendedConfig.cpu}</div>
                </div>
              )}
              {recommendedConfig.ram && (
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-gray-500 mb-1">RAM</div>
                  <div className="text-base font-semibold text-primary-700">{recommendedConfig.ram}</div>
                </div>
              )}
              {recommendedConfig.ssd && (
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-gray-500 mb-1">Ổ CỨNG</div>
                  <div className="text-base font-semibold text-primary-700">{recommendedConfig.ssd}</div>
                </div>
              )}
              {recommendedConfig.gpu && (
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-bold text-gray-500 mb-1">CARD ĐỒ HỌA</div>
                  <div className="text-base font-semibold text-primary-700">{recommendedConfig.gpu}</div>
                </div>
              )}
            </div>
            {recommendedConfig.note && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800">
                <strong>Lưu ý: </strong> {recommendedConfig.note}
              </div>
            )}
          </div>
        )}

        {/* Recommendations */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Laptop phù hợp nhất với bạn</h2>
        <div className="space-y-6">
          {recommendations && recommendations.map((rec, idx) => (
            <ResultCard
              key={rec.laptop?.id || idx}
              result={rec}
              isFavorite={favorites.includes(rec.laptop?.id)}
              onToggleFavorite={handleToggleFavorite}
              onCompare={handleCompare}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/quiz" className="btn btn-outline px-8">Làm lại Quiz</Link>
          <Link to="/laptops" className="btn btn-secondary px-8">Xem tất cả Laptop</Link>
          <Link to="/compare" className="btn btn-primary px-8">So sánh các máy đã chọn</Link>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
