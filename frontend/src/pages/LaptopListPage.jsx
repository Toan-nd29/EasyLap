import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import laptopApi from '../api/laptopApi';
import userApi from '../api/userApi';
import LaptopCard from '../components/LaptopCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

const LaptopListPage = () => {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Pagination & Filter Options
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState({
    brands: [], ramOptions: [], ssdOptions: [], gpuTypes: [], tags: []
  });

  // Query Params
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRam, setMinRam] = useState('');
  const [minSsd, setMinSsd] = useState('');
  const [gpuType, setGpuType] = useState('');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState('');
  
  // Debounce for search
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, brand, minPrice, maxPrice, minRam, minSsd, gpuType, tag, sort, pagination.page]);

  const fetchFilterOptions = async () => {
    try {
      const res = await laptopApi.getFilterOptions();
      if (res.success) {
        const { success, message, ...options } = res;
        setFilterOptions(options);
      }
    } catch (err) {
      console.error("Failed to load filter options", err);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        brand,
        sort,
        tag
      };
      
      if (minPrice) queryParams.minPrice = Number(minPrice) * 1_000_000;
      if (maxPrice) queryParams.maxPrice = Number(maxPrice) * 1_000_000;
      if (minRam) queryParams.minRam = minRam;
      if (minSsd) queryParams.minSsd = minSsd;
      if (gpuType) queryParams.gpuType = gpuType;

      const [laptopRes, favRes] = await Promise.allSettled([
        laptopApi.getAll(queryParams),
        userApi.getFavorites()
      ]);

      if (laptopRes.status === 'fulfilled' && laptopRes.value.success) {
        setLaptops(laptopRes.value.data || []);
        if (laptopRes.value.pagination) {
          setPagination(laptopRes.value.pagination);
        }
      } else {
        setError('Không thể tải danh sách laptop.');
      }

      if (favRes.status === 'fulfilled' && favRes.value.success) {
        setFavorites((favRes.value.favorites || []).map(f => f.laptop_id));
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (laptop) => {
    const isFav = favorites.includes(laptop.id);
    try {
      if (isFav) {
        await userApi.removeFavorite(laptop.id);
        setFavorites(prev => prev.filter(id => id !== laptop.id));
      } else {
        await userApi.addFavorite(laptop.id);
        setFavorites(prev => [...prev, laptop.id]);
      }
    } catch (err) {
      console.error('Favorite error', err);
    }
  };

  const handleCompare = (laptop) => {
    const stored = localStorage.getItem('compareList');
    const list = stored ? JSON.parse(stored) : [];
    if (list.find(l => l.id === laptop.id)) {
      navigate('/compare');
      return;
    }
    if (list.length >= 3) {
      alert('Chỉ có thể so sánh tối đa 3 máy!');
      return;
    }
    list.push(laptop);
    localStorage.setItem('compareList', JSON.stringify(list));
    navigate('/compare');
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setMinRam('');
    setMinSsd('');
    setGpuType('');
    setTag('');
    setSort('');
    setPagination(p => ({ ...p, page: 1 }));
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Laptop</h1>
            <p className="text-gray-600 mt-1">Tìm thấy {pagination.total} laptop</p>
          </div>
          <div>
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Mới nhất</option>
              <option value="price_asc">Giá: Thấp đến cao</option>
              <option value="price_desc">Giá: Cao đến thấp</option>
              <option value="ram_desc">RAM: Cao đến thấp</option>
              <option value="ssd_desc">SSD: Cao đến thấp</option>
              <option value="cpu_score_desc">CPU: Mạnh nhất</option>
            </select>
          </div>
        </div>

        {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
            </div>
            <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">
              Xóa bộ lọc
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <select
              value={brand}
              onChange={e => { setBrand(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Tất cả hãng</option>
              {filterOptions.brands?.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <input
              type="number"
              placeholder="Giá từ (triệu VND)"
              value={minPrice}
              onChange={e => { setMinPrice(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="number"
              placeholder="Giá đến (triệu VND)"
              value={maxPrice}
              onChange={e => { setMaxPrice(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            />
            <select
              value={minRam}
              onChange={e => { setMinRam(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">RAM tối thiểu</option>
              {filterOptions.ramOptions?.map(r => <option key={r} value={r}>{r}GB</option>)}
            </select>
            <select
              value={minSsd}
              onChange={e => { setMinSsd(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">SSD tối thiểu</option>
              {filterOptions.ssdOptions?.map(s => <option key={s} value={s}>{s}GB</option>)}
            </select>
            <select
              value={gpuType}
              onChange={e => { setGpuType(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Loại GPU</option>
              {filterOptions.gpuTypes?.map(g => <option key={g} value={g}>{g === 'dedicated' ? 'Card rời' : 'Card tích hợp'}</option>)}
            </select>
            <select
              value={tag}
              onChange={e => { setTag(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Nhu cầu / Tag</option>
              {filterOptions.tags?.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Laptop Grid */}
        {loading ? (
          <div className="py-20 text-center"><Loading /></div>
        ) : laptops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Không tìm thấy laptop phù hợp với bộ lọc.</p>
            <button onClick={clearFilters} className="mt-4 btn btn-outline">Xóa bộ lọc</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {laptops.map(laptop => (
                <LaptopCard
                  key={laptop.id}
                  laptop={laptop}
                  isFavorite={favorites.includes(laptop.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onCompare={handleCompare}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-700">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LaptopListPage;
