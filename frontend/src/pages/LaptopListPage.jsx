import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import laptopApi from '../api/laptopApi';
import userApi from '../api/userApi';
import LaptopCard from '../components/LaptopCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

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

const MINIMAL_FILTERS = {
  totalLaptops: 0,
  brands: [],
  priceRanges: [
    { label: 'Dưới 10 triệu', value: 'under-10' },
    { label: 'Từ 10 - 15 triệu', value: '10-15' },
    { label: 'Từ 15 - 20 triệu', value: '15-20' },
    { label: 'Từ 20 - 25 triệu', value: '20-25' },
    { label: 'Từ 25 - 30 triệu', value: '25-30' },
    { label: 'Trên 30 triệu', value: 'over-30' }
  ],
  usageNeeds: [],
  cpuFamilies: [],
  ramOptions: [],
  storageOptions: [],
  gpuFamilies: [],
  screenSizes: [],
  resolutionTypes: [],
  features: []
};

const FILTER_GROUPS = [
  { key: 'brands', title: 'Hãng sản xuất' },
  { key: 'priceRanges', title: 'Phân khúc giá', single: true },
  { key: 'usageNeeds', title: 'Nhu cầu sử dụng' },
  { key: 'cpuFamilies', title: 'CPU' },
  { key: 'ramOptions', title: 'Dung lượng RAM' },
  { key: 'storageOptions', title: 'Ổ cứng' },
  { key: 'gpuFamilies', title: 'Card đồ họa' },
  { key: 'screenSizes', title: 'Kích thước màn hình' },
  { key: 'resolutionTypes', title: 'Độ phân giải' },
  { key: 'features', title: 'Tính năng đặc biệt' }
];

const DEFAULT_COLLAPSED_GROUPS = {
  ramOptions: true,
  storageOptions: true,
  gpuFamilies: true,
  screenSizes: true,
  resolutionTypes: true,
  features: true
};

const OPTION_PREVIEW_LIMIT = 8;

function normalizeOptions(options) {
  if (!Array.isArray(options)) return [];
  return options
    .filter(item => item && item.value !== undefined && item.label)
    .map(item => ({ ...item, value: String(item.value) }));
}

const LaptopListPage = () => {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState(MINIMAL_FILTERS);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(EMPTY_FILTERS);
  const [sort, setSort] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState(DEFAULT_COLLAPSED_GROUPS);
  const [expandedOptionGroups, setExpandedOptionGroups] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const resetPage = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const activeFilterCount = useMemo(() => (
    Object.values(selectedFilters).reduce((total, values) => total + values.length, 0) + (priceRange ? 1 : 0)
  ), [priceRange, selectedFilters]);

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
        if (values.length > 0) queryParams[key] = values.join(',');
      });

      const [laptopRes, favRes] = await Promise.allSettled([
        laptopApi.getAll(queryParams),
        userApi.getFavoriteIds()
      ]);

      if (laptopRes.status === 'fulfilled' && laptopRes.value.success) {
        setLaptops(laptopRes.value.data || []);
        if (laptopRes.value.pagination) setPagination(laptopRes.value.pagination);
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

  const toggleFilter = (key, value) => {
    setSelectedFilters(prev => {
      const current = prev[key] || [];
      const nextValues = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];

      return { ...prev, [key]: nextValues };
    });
    resetPage();
  };

  const togglePriceRange = (value) => {
    setPriceRange(prev => (prev === value ? '' : value));
    resetPage();
  };

  const toggleGroupCollapsed = (key) => {
    setCollapsedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleOptionGroupExpanded = (key) => {
    setExpandedOptionGroups(prev => ({ ...prev, [key]: !prev[key] }));
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

  const getGroupActiveCount = (key) => {
    if (key === 'priceRanges') return priceRange ? 1 : 0;
    return selectedFilters[key]?.length || 0;
  };

  const renderChip = (group, item) => {
    const value = String(item.value);
    const active = group.single ? priceRange === value : selectedFilters[group.key]?.includes(value);
    const onClick = group.single ? () => togglePriceRange(value) : () => toggleFilter(group.key, value);

    return (
      <button
        key={`${group.key}-${value}`}
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={`inline-flex min-h-[36px] max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-left text-sm font-semibold transition-colors ${
          active
            ? 'border-primary-600 bg-primary-600 text-white shadow-sm'
            : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-primary-300 hover:bg-primary-50'
        }`}
      >
        <span className="min-w-0 break-words leading-tight">{item.label}</span>
        {Number.isFinite(Number(item.count)) && (
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
            active ? 'bg-white/20 text-white' : 'bg-white text-gray-500'
          }`}>
            {item.count}
          </span>
        )}
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

  const renderFilterGroup = (group) => {
    const options = normalizeOptions(filterOptions[group.key]);
    if (options.length === 0) return null;

    const activeCount = getGroupActiveCount(group.key);
    const isCollapsed = Boolean(collapsedGroups[group.key]);
    const isExpanded = Boolean(expandedOptionGroups[group.key]);
    const visibleOptions = isExpanded ? options : options.slice(0, OPTION_PREVIEW_LIMIT);
    const hasMoreOptions = options.length > OPTION_PREVIEW_LIMIT;

    return (
      <section key={group.key} className="min-w-0 rounded-lg border border-gray-100 bg-white">
        <button
          type="button"
          onClick={() => toggleGroupCollapsed(group.key)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate text-base font-bold text-gray-800">{group.title}</span>
            {activeCount > 0 && (
              <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-700">
                {activeCount}
              </span>
            )}
          </span>
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0 text-gray-500" />
          ) : (
            <ChevronUp className="h-4 w-4 flex-shrink-0 text-gray-500" />
          )}
        </button>

        {!isCollapsed && (
          <div className="border-t border-gray-100 px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {visibleOptions.map(item => renderChip(group, item))}
            </div>
            {hasMoreOptions && (
              <button
                type="button"
                onClick={() => toggleOptionGroupExpanded(group.key)}
                className="mt-3 text-sm font-semibold text-primary-700 hover:text-primary-800"
              >
                {isExpanded ? 'Thu gọn lựa chọn' : `Xem thêm ${options.length - OPTION_PREVIEW_LIMIT} lựa chọn`}
              </button>
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Danh sách Laptop</h1>
            <p className="mt-1 text-gray-600">Tìm thấy {pagination.total} laptop</p>
          </div>
          <select
            value={sort}
            onChange={event => {
              setSort(event.target.value);
              resetPage();
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 sm:w-auto"
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
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary-600" />
              <div>
                <h2 className="font-semibold text-gray-900">Bộ lọc</h2>
                {Number(filterOptions.totalLaptops) > 0 && (
                  <p className="text-xs text-gray-500">Theo {filterOptions.totalLaptops} mẫu laptop đang có</p>
                )}
              </div>
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">
                  {activeFilterCount}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  value={search}
                  onChange={event => {
                    setSearch(event.target.value);
                    resetPage();
                  }}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Xóa bộ lọc
              </button>
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(prev => !prev)}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                {isFilterPanelOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {isFilterPanelOpen ? 'Thu gọn' : 'Mở bộ lọc'}
              </button>
            </div>
          </div>

          {isFilterPanelOpen && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {FILTER_GROUPS.map(group => renderFilterGroup(group))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center"><Loading /></div>
        ) : laptops.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-500">Không tìm thấy laptop phù hợp với bộ lọc.</p>
            <button type="button" onClick={clearFilters} className="btn btn-outline mt-4">Xóa bộ lọc</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="rounded border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-gray-700">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="rounded border border-gray-300 p-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
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
