import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userApi from '../api/userApi';
import laptopApi from '../api/laptopApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import LaptopImage from '../components/LaptopImage';
import { formatCurrency } from '../utils/formatCurrency';
import { Heart, Trash2 } from 'lucide-react';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await userApi.getFavorites();
      if (res.success) {
        setFavorites(res.favorites || []);
      } else {
        setError('Không thể tải danh sách yêu thích.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (laptopId) => {
    try {
      await userApi.removeFavorite(laptopId);
      setFavorites(prev => prev.filter(f => f.laptop_id !== laptopId));
    } catch (err) {
      console.error('Remove favorite error', err);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laptop yêu thích</h1>
            <p className="text-gray-600 mt-1">{favorites.length} laptop đã lưu</p>
          </div>
        </div>

        {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

        {favorites.length === 0 ? (
          <div className="card text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-3">Chưa có laptop yêu thích</h2>
            <p className="text-gray-600 mb-8">Bạn chưa lưu laptop yêu thích nào. Hãy duyệt danh sách laptop và bấm yêu thích nhé!</p>
            <Link to="/laptops" className="btn btn-primary">Khám phá laptop</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => {
              const laptop = fav.laptops || fav;
              return (
                <div key={fav.laptop_id || fav.id} className="card flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    <LaptopImage laptop={laptop} fallbackClassName="w-full h-full" iconClassName="w-5 h-5" />
                  </div>

                  <div className="flex-grow">
                    <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-0.5">{laptop.brand}</div>
                    <Link to={`/laptops/${fav.laptop_id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600">
                      {laptop.name}
                    </Link>
                    <div className="text-gray-700 font-semibold mt-1">{formatCurrency(laptop.price)}</div>
                    {laptop.cpu && <div className="text-sm text-gray-500 mt-1">{laptop.cpu} • {laptop.ram}GB RAM • {laptop.ssd}GB SSD</div>}
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <Link to={`/laptops/${fav.laptop_id}`} className="btn btn-outline text-sm px-4 py-2">
                      Chi tiết
                    </Link>
                    <button
                      onClick={() => handleRemove(fav.laptop_id)}
                      className="btn text-sm px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
