import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import laptopApi from '../api/laptopApi';
import userApi from '../api/userApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatCurrency';
import {
  Heart, Scale, Cpu, HardDrive, Monitor, Weight, Shield, CheckCircle2, XCircle, ExternalLink
} from 'lucide-react';

const LaptopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchLaptop();
  }, [id]);

  const fetchLaptop = async () => {
    try {
      const [lapRes, favRes] = await Promise.allSettled([
        laptopApi.getById(id),
        userApi.getFavorites()
      ]);

      if (lapRes.status === 'fulfilled' && lapRes.value.success) {
        setLaptop(lapRes.value.laptop);
      } else {
        setError('Không tìm thấy laptop này.');
      }

      if (favRes.status === 'fulfilled' && favRes.value.success) {
        const favIds = (favRes.value.data || []).map(f => f.laptop_id);
        setIsFavorite(favIds.includes(id));
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await userApi.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await userApi.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Favorite error', err);
    }
  };

  const handleCompare = () => {
    const stored = localStorage.getItem('compareList');
    const list = stored ? JSON.parse(stored) : [];
    if (!list.find(l => l.id === laptop.id)) {
      if (list.length >= 3) {
        alert('Chỉ có thể so sánh tối đa 3 máy!');
        return;
      }
      list.push(laptop);
      localStorage.setItem('compareList', JSON.stringify(list));
    }
    navigate('/compare');
  };

  if (loading) return <Loading fullScreen />;
  if (error) return <div className="max-w-3xl mx-auto p-8"><ErrorMessage message={error} /></div>;
  if (!laptop) return null;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="card flex items-center justify-center min-h-[280px]">
            {laptop.image_url
              ? <img src={laptop.image_url} alt={laptop.name} className="max-h-64 object-contain mix-blend-multiply w-full" />
              : <div className="text-gray-400 text-center">Chưa có ảnh</div>
            }
          </div>

          {/* Right: Info */}
          <div className="card flex flex-col">
            <div className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-1">{laptop.brand}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{laptop.name}</h1>
            <div className="text-3xl font-bold text-gray-900 mb-6">{formatCurrency(laptop.price)}</div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <div className="flex items-center gap-2 text-gray-600"><Cpu className="w-4 h-4 text-gray-400" /><span>{laptop.cpu}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><HardDrive className="w-4 h-4 text-gray-400" /><span>{laptop.ram}GB RAM</span></div>
              <div className="flex items-center gap-2 text-gray-600"><HardDrive className="w-4 h-4 text-gray-400" /><span>{laptop.ssd}GB SSD</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Monitor className="w-4 h-4 text-gray-400" /><span>{laptop.screen}</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Weight className="w-4 h-4 text-gray-400" /><span>{laptop.weight}kg</span></div>
              <div className="flex items-center gap-2 text-gray-600"><Shield className="w-4 h-4 text-gray-400" /><span>BH {laptop.warranty}</span></div>
            </div>

            <div className="flex gap-3 mt-auto flex-wrap">
              <button onClick={handleToggleFavorite}
                className={`btn flex-1 flex items-center justify-center gap-2 ${isFavorite ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'btn-outline'}`}>
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </button>
              <button onClick={handleCompare} className="btn btn-outline flex-1 flex items-center justify-center gap-2">
                <Scale className="w-5 h-5" /> So sánh
              </button>
              {laptop.shop_url && (
                <a href={laptop.shop_url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                  <ExternalLink className="w-5 h-5" /> Xem giá
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        {(laptop.pros?.length > 0 || laptop.cons?.length > 0) && (
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {laptop.pros?.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> Ưu điểm
                </h2>
                <ul className="space-y-2">
                  {laptop.pros.map((p, i) => <li key={i} className="text-gray-700 flex items-start"><span className="text-green-500 mr-2 mt-0.5">✓</span>{p}</li>)}
                </ul>
              </div>
            )}
            {laptop.cons?.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" /> Nhược điểm
                </h2>
                <ul className="space-y-2">
                  {laptop.cons.map((c, i) => <li key={i} className="text-gray-700 flex items-start"><span className="text-red-500 mr-2 mt-0.5">✗</span>{c}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Suitable for */}
        {laptop.suitable_for?.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Phù hợp với</h2>
            <div className="flex flex-wrap gap-2">
              {laptop.suitable_for.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {laptop.tags?.length > 0 && (
          <div className="card mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {laptop.tags.map((t, i) => (
                <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full">#{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopDetailPage;
