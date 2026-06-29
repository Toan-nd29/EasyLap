import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import laptopApi from '../api/laptopApi';
import userApi from '../api/userApi';
import LaptopCard from '../components/LaptopCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';

const EMPTY_FILTERS = {
  brands: [],
  usageNeeds: [],
  cpuFamilies: [],
  ramOptions: [],
  storageOptions: [],
  gpuFamilies: [],
  screenSizes: [],
  resolutionTypes: [],
  features: []
};

const option = (label, value, meta = {}) => ({ label, value, ...meta });

const FILTER_FALLBACKS = {
  brands: [
    option('Mac', 'Apple'),
    option('ASUS', 'ASUS'),
    option('Lenovo', 'Lenovo'),
    option('Dell', 'Dell'),
    option('HP', 'HP'),
    option('Acer', 'Acer'),
    option('LG', 'LG'),
    option('MSI', 'MSI'),
    option('Gigabyte', 'Gigabyte'),
    option('Microsoft Surface', 'Microsoft Surface'),
    option('Masstel', 'Masstel'),
    option('Samsung', 'Samsung')
  ],
  priceRanges: [
    option('Dưới 10 triệu', 'under-10'),
    option('Từ 10 - 15 triệu', '10-15'),
    option('Từ 15 - 20 triệu', '15-20'),
    option('Từ 20 - 25 triệu', '20-25'),
    option('Từ 25 - 30 triệu', '25-30'),
    option('Trên 30 triệu', 'over-30')
  ],
  usageNeeds: [
    option('Học tập - Văn phòng', 'study_office'),
    option('Cao cấp - Sang trọng', 'premium'),
    option('Mỏng nhẹ', 'lightweight'),
    option('Gaming', 'gaming'),
    option('Đồ họa - Kỹ thuật', 'design_technical'),
    option('Laptop sáng tạo nội dung', 'content_creator'),
    option('Văn phòng', 'office'),
    option('Sinh viên', 'student'),
    option('Cảm ứng', 'touch'),
    option('Laptop AI', 'laptop_ai', { badge: 'HOT' }),
    option('Mac CTO - Nâng cấp theo cách của bạn', 'mac_cto')
  ],
  cpuFamilies: [
    option('Laptop Core i3', 'core_i3'),
    option('Laptop Core i5', 'core_i5'),
    option('Laptop Core i7', 'core_i7'),
    option('Laptop Core i9', 'core_i9'),
    option('Laptop Core U5', 'core_u5'),
    option('Laptop Core U7', 'core_u7'),
    option('Laptop Core U9', 'core_u9'),
    option('Intel Celeron / Pentium', 'celeron_pentium'),
    option('Apple M2', 'apple_m2'),
    option('Apple M3', 'apple_m3'),
    option('Apple M4 Series', 'apple_m4'),
    option('Apple M5 Series', 'apple_m5', { badge: 'MỚI' }),
    option('AMD Ryzen', 'amd_ryzen'),
    option('AMD Ryzen 5', 'amd_ryzen_5'),
    option('AMD Ryzen 7', 'amd_ryzen_7'),
    option('AMD Ryzen 9', 'amd_ryzen_9'),
    option('Intel Core Ultra', 'intel_core_ultra', { badge: 'HOT' }),
    option('Qualcomm Snapdragon', 'qualcomm_snapdragon'),
    option('Snapdragon X Plus', 'snapdragon_x_plus'),
    option('A18 Pro', 'a18_pro', { badge: 'MỚI' })
  ],
  ramOptions: [4, 8, 12, 16, 24, 32, 36, 48, 64, 128].map(value => option(`${value}GB`, value)),
  storageOptions: [
    option('32GB', 32),
    option('256GB', 256),
    option('512GB', 512),
    option('1TB', 1000),
    option('2TB', 2000),
    option('8TB', 8000)
  ],
  gpuFamilies: [
    option('Card Onboard', 'onboard'),
    option('NVIDIA GeForce Series', 'nvidia_geforce'),
    option('AMD Radeon Series', 'amd_radeon')
  ],
  screenSizes: [
    option('Laptop 13 inch', '13'),
    option('Laptop 14 inch', '14'),
    option('Laptop 15.6 inch', '15_6'),
    option('Laptop 16 inch', '16'),
    option('Trên 15 inch', 'over_15')
  ],
  resolutionTypes: [
    option('HD', 'hd'),
    option('Full HD', 'full_hd'),
    option('2K (Quad HD)', 'qhd_2k'),
    option('WUXGA', 'wuxga'),
    option('2.8K', '2_8k'),
    option('3K', '3k'),
    option('3.2K', '3_2k'),
    option('4K (Ultra HD)', '4k'),
    option('WQXGA', 'wqxga'),
    option('Retina', 'retina'),
    option('5K', '5k')
  ],
  features: [
    option('Wi-Fi 6', 'wifi_6'),
    option('Công nghệ Intel Evo', 'intel_evo'),
    option('Bảo mật vân tay', 'fingerprint'),
    option('Công nghệ Intel Gaming', 'intel_gaming'),
    option('Xoay gập 360 độ (2 in 1)', 'two_in_one'),
    option('Cảm ứng', 'touch_screen'),
    option('Màn hình IPS', 'ips'),
    option('Màn hình OLED', 'oled'),
    option('Pin tốt', 'battery_good'),
    option('Dễ nâng cấp', 'upgradeable')
  ]
};

const FILTER_GROUPS = [
  { key: 'brands', title: 'Hãng sản xuất' },
  { key: 'priceRanges', title: 'Phân khúc giá', single: true },
  { key: 'cpuFamilies', title: 'CPU' },
  { key: 'usageNeeds', title: 'Nhu cầu sử dụng' },
  { key: 'ramOptions', title: 'Dung lượng RAM' },
  { key: 'storageOptions', title: 'Ổ cứng' },
  { key: 'gpuFamilies', title: 'Card đồ họa' },
  { key: 'screenSizes', title: 'Kích thước màn hình' },
  { key: 'resolutionTypes', title: 'Độ phân giải' },
  { key: 'features', title: 'Tính năng đặc biệt' }
];

function normalizeOptions(options, key) {
  const source = Array.isArray(options) && options.length > 0 ? options : FILTER_FALLBACKS[key] || [];

  return source.map(item => {
    if (typeof item === 'object' && item !== null && 'label' in item && 'value' in item) {
      return item;
    }

    const value = item;
    const label = key === 'ramOptions' || key === 'storageOptions' ? `${item}GB` : String(item);
    return { label, value };
  });
}

const LaptopListPage = () => {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState(FILTER_FALLBACKS);

  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const res = await laptopApi.getFilterOptions();
      if (res.success) {
        const options = { ...res };
        delete options.success;
        delete options.message;
        setFilterOptions(prev => ({ ...prev, ...options }));
      }
    } catch (err) {
      console.error('Failed to load filter options', err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const queryParams = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (debouncedSearch) queryParams.search = debouncedSearch;
      if (sort) queryParams.sort = sort;
      if (priceRange) queryParams.priceRange = priceRange;

      Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          queryParams[key] = values.join(',');
        }
      });

      const [laptopRes, favRes] = await Promise.allSettled([
        laptopApi.getAll(queryParams),
        userApi.getFavoriteIds()
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
        setFavorites(favRes.value.favoriteIds || []);
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, pagination.limit, pagination.page, priceRange, selectedFilters, sort]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const resetPage = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleFilter = (key, value) => {
    const normalizedValue = String(value);
    setSelectedFilters(prev => {
      const current = prev[key] || [];
      const nextValues = current.includes(normalizedValue)
        ? current.filter(item => item !== normalizedValue)
        : [...current, normalizedValue];

      return { ...prev, [key]: nextValues };
    });
    resetPage();
  };

  const togglePriceRange = (value) => {
    const normalizedValue = String(value);
    setPriceRange(prev => (prev === normalizedValue ? '' : normalizedValue));
    resetPage();
  };

  const clearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setPriceRange('');
    setSelectedFilters(EMPTY_FILTERS);
    setSort('');
    setPagination(prev => ({ ...prev, page: 1 }));
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
    if (list.find(item => item.id === laptop.id)) {
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

  const activeFilterCount = Object.values(selectedFilters).reduce((total, values) => total + values.length, 0)
    + (priceRange ? 1 : 0);

  const renderChip = (group, item) => {
    const value = String(item.value);
    const active = group.single
      ? priceRange === value
      : selectedFilters[group.key]?.includes(value);
    const onClick = group.single ? () => togglePriceRange(value) : () => toggleFilter(group.key, value);

    return (
      <button
        key={`${group.key}-${value}`}
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={`inline-flex min-h-[38px] max-w-full items-center gap-1 rounded-full border px-4 py-2 text-left text-sm font-semibold transition-colors ${
          active
            ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
            : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-primary-300 hover:bg-primary-50'
        }`}
      >
        <span className="min-w-0 break-words leading-tight">{item.label}</span>
        {item.badge && (
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold leading-none ${
            active ? 'bg-white text-red-600' : 'bg-red-600 text-white'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Laptop</h1>
            <p className="text-gray-600 mt-1">Tìm thấy {pagination.total} laptop</p>
          </div>
          <select
            value={sort}
            onChange={event => {
              setSort(event.target.value);
              resetPage();
            }}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến cao</option>
            <option value="price_desc">Giá: Cao đến thấp</option>
            <option value="ram_desc">RAM: Cao đến thấp</option>
            <option value="ssd_desc">SSD: Cao đến thấp</option>
            <option value="cpu_score_desc">CPU: Mạnh nhất</option>
          </select>
        </div>

        {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

        <div className="card mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={search}
                  onChange={event => {
                    setSearch(event.target.value);
                    resetPage();
                  }}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-3">
            {FILTER_GROUPS.map(group => (
              <section key={group.key} className="min-w-0">
                <h3 className="mb-3 text-base font-bold text-gray-800">{group.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {normalizeOptions(filterOptions[group.key], group.key).map(item => renderChip(group, item))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center"><Loading /></div>
        ) : laptops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Không tìm thấy laptop phù hợp với bộ lọc.</p>
            <button type="button" onClick={clearFilters} className="mt-4 btn btn-outline">Xóa bộ lọc</button>
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

            {pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  type="button"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-700">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
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
