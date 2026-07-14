import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Cpu,
  DollarSign,
  Gamepad2,
  HardDrive,
  Maximize2,
  MemoryStick,
  Monitor,
  Search,
  SlidersHorizontal,
  Sparkles,
  X
} from 'lucide-react';
import laptopApi from '../api/laptopApi';
import userApi from '../api/userApi';
import LaptopCard from '../components/LaptopCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const createEmptyFilters = () => ({
  brands: [],
  usageNeeds: [],
  cpuFamilies: [],
  ramOptions: [],
  storageOptions: [],
  gpuFamilies: [],
  screenSizes: [],
  resolutionTypes: [],
  features: []
});

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

const PRIMARY_GROUPS = [
  { key: 'brands', title: 'Thương hiệu', icon: Monitor },
  { key: 'priceRanges', title: 'Giá cả', icon: DollarSign, single: true },
  { key: 'cpuFamilies', title: 'CPU', icon: Cpu },
  { key: 'ramOptions', title: 'RAM', icon: MemoryStick },
  { key: 'storageOptions', title: 'Ổ cứng', icon: HardDrive }
];

const ADVANCED_GROUPS = [
  { key: 'usageNeeds', title: 'Nhu cầu sử dụng', icon: BriefcaseBusiness },
  { key: 'gpuFamilies', title: 'Card đồ họa', icon: Gamepad2 },
  { key: 'screenSizes', title: 'Kích thước màn hình', icon: Monitor },
  { key: 'resolutionTypes', title: 'Độ phân giải', icon: Maximize2 },
  { key: 'features', title: 'Tính năng đặc biệt', icon: Sparkles }
];

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) return [];
  return options
    .filter(item => item && item.value !== undefined && item.label)
    .map(item => ({ ...item, value: String(item.value) }));
};

const LaptopListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const querySearch = searchParams.get('search') || '';
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [filterOptions, setFilterOptions] = useState(MINIMAL_FILTERS);
  const [search, setSearch] = useState(querySearch);
  const [debouncedSearch, setDebouncedSearch] = useState(querySearch);
  const [priceRange, setPriceRange] = useState('');
  const [draftPriceRange, setDraftPriceRange] = useState('');
  const [selectedFilters, setSelectedFilters] = useState(createEmptyFilters);
  const [draftFilters, setDraftFilters] = useState(createEmptyFilters);
  const [sort, setSort] = useState('');
  const [activeGroupKey, setActiveGroupKey] = useState('brands');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(querySearch);
  }, [querySearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 450);
    return () => clearTimeout(timer);
  }, [search]);

  const resetPage = () => setPagination(previous => ({ ...previous, page: 1 }));

  const activeFilterCount = useMemo(() => (
    Object.values(selectedFilters).reduce((total, values) => total + values.length, 0) + (priceRange ? 1 : 0)
  ), [priceRange, selectedFilters]);

  const draftFilterCount = useMemo(() => (
    Object.values(draftFilters).reduce((total, values) => total + values.length, 0) + (draftPriceRange ? 1 : 0)
  ), [draftFilters, draftPriceRange]);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await laptopApi.getFilterOptions();
      if (response.success) {
        const options = { ...response };
        delete options.success;
        delete options.message;
        setFilterOptions(previous => ({ ...previous, ...options }));
      }
    } catch (requestError) {
      console.error('Failed to load filter options', requestError);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const queryParams = { page: pagination.page, limit: pagination.limit };
      if (debouncedSearch.trim()) queryParams.search = debouncedSearch.trim();
      if (sort) queryParams.sort = sort;
      if (priceRange) queryParams.priceRange = priceRange;
      Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values.length > 0) queryParams[key] = values.join(',');
      });

      const [laptopResponse, favoriteResponse] = await Promise.allSettled([
        laptopApi.getAll(queryParams),
        userApi.getFavoriteIds()
      ]);

      if (laptopResponse.status === 'fulfilled' && laptopResponse.value.success) {
        setLaptops(laptopResponse.value.data || []);
        if (laptopResponse.value.pagination) setPagination(laptopResponse.value.pagination);
      } else {
        setError('Không thể tải danh sách laptop.');
      }

      if (favoriteResponse.status === 'fulfilled' && favoriteResponse.value.success) {
        setFavorites(favoriteResponse.value.favoriteIds || []);
      }
    } catch (requestError) {
      setError(requestError.message || 'Lỗi kết nối máy chủ');
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

  const toggleDraftFilter = (group, value) => {
    if (group.single) {
      setDraftPriceRange(previous => previous === value ? '' : value);
      return;
    }
    setDraftFilters(previous => {
      const current = previous[group.key] || [];
      const values = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...previous, [group.key]: values };
    });
  };

  const isDraftSelected = (group, value) => (
    group.single ? draftPriceRange === value : draftFilters[group.key]?.includes(value)
  );

  const applyFilters = () => {
    setSelectedFilters(Object.fromEntries(Object.entries(draftFilters).map(([key, values]) => [key, [...values]])));
    setPriceRange(draftPriceRange);
    resetPage();
    setIsMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    const empty = createEmptyFilters();
    setSearch('');
    setDebouncedSearch('');
    setSearchParams({});
    setPriceRange('');
    setDraftPriceRange('');
    setSelectedFilters(empty);
    setDraftFilters(createEmptyFilters());
    setSort('');
    resetPage();
  };

  const handleToggleFavorite = async (laptop) => {
    const isFavorite = favorites.includes(laptop.id);
    try {
      if (isFavorite) {
        await userApi.removeFavorite(laptop.id);
        setFavorites(previous => previous.filter(id => id !== laptop.id));
      } else {
        await userApi.addFavorite(laptop.id);
        setFavorites(previous => [...previous, laptop.id]);
      }
    } catch (requestError) {
      console.error('Favorite error', requestError);
    }
  };

  const handleCompare = (laptop) => {
    let list;
    try {
      list = JSON.parse(localStorage.getItem('compareList') || '[]');
    } catch {
      list = [];
    }
    if (list.some(item => item.id === laptop.id)) {
      navigate('/compare');
      return;
    }
    if (list.length >= 3) {
      alert('Chỉ có thể so sánh tối đa 3 máy!');
      return;
    }
    localStorage.setItem('compareList', JSON.stringify([...list, laptop]));
    navigate('/compare');
  };

  const removeAppliedFilter = (key, value) => {
    setSelectedFilters(previous => ({
      ...previous,
      [key]: previous[key].filter(item => item !== value)
    }));
    setDraftFilters(previous => ({
      ...previous,
      [key]: previous[key].filter(item => item !== value)
    }));
    resetPage();
  };

  const activePrimaryGroup = PRIMARY_GROUPS.find(group => group.key === activeGroupKey) || PRIMARY_GROUPS[0];

  const renderOptions = (group, compact = false) => {
    const options = normalizeOptions(filterOptions[group.key]);
    if (options.length === 0) return <p className="text-sm text-[#78847c]">Chưa có lựa chọn phù hợp.</p>;
    return (
      <div className={compact ? 'grid gap-2' : 'flex flex-wrap gap-2.5'}>
        {options.map(option => {
          const selected = isDraftSelected(group, option.value);
          return (
            <button
              key={`${group.key}-${option.value}`}
              type="button"
              onClick={() => toggleDraftFilter(group, option.value)}
              aria-pressed={selected}
              className={compact
                ? `flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${selected ? 'border-primary-300 bg-primary-50 text-primary-800' : 'border-[#e5ebe7] bg-white text-[#526158] hover:border-primary-200'}`
                : `inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition ${selected ? 'border-primary-500 bg-primary-500 text-white shadow-sm' : 'border-[#dfe7e2] bg-white text-[#526158] hover:border-primary-300 hover:bg-primary-50'}`
              }
            >
              <span className="flex min-w-0 items-center gap-2">{selected && <Check className="h-3.5 w-3.5 shrink-0" />}<span>{option.label}</span>{option.badge && <span className={`rounded px-1.5 py-0.5 text-[9px] font-black ${selected ? 'bg-white text-primary-700' : 'bg-[#ff705e] text-white'}`}>{option.badge}</span>}</span>
              {Number.isFinite(Number(option.count)) && <span className={`text-[11px] ${selected ? 'opacity-80' : 'text-[#9aa59e]'}`}>{option.count}</span>}
            </button>
          );
        })}
      </div>
    );
  };

  const renderDesktopFlyout = (group, alignBottom = false) => {
    const count = group.single ? (draftPriceRange ? 1 : 0) : draftFilters[group.key]?.length || 0;
    return (
      <div role="dialog" aria-label={`Bộ lọc ${group.title}`} className={`pointer-events-none invisible absolute left-full z-[90] w-[430px] -translate-x-1 pl-3 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-x-0 group-focus-within:opacity-100 ${alignBottom ? 'bottom-0' : 'top-0'}`}>
        <div className="max-h-[60vh] overflow-y-auto overscroll-contain rounded-[20px] border border-[#dfe8e2] bg-white p-5 shadow-[0_22px_60px_rgba(26,48,36,0.18)]">
          <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#edf1ee] pb-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-600">Chọn tiêu chí</p>
              <h3 className="mt-1 text-lg font-black tracking-[-0.025em] text-[#263a4e]">{group.title}</h3>
            </div>
            {count > 0 && <span className="shrink-0 rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-extrabold text-primary-700">{count} đã chọn</span>}
          </div>
          {renderOptions(group, true)}
          <p className="mt-4 border-t border-[#edf1ee] pt-3 text-xs leading-5 text-[#7b8990]">Các lựa chọn sẽ được lưu tạm. Nhấn “Áp dụng bộ lọc” để xem kết quả.</p>
        </div>
      </div>
    );
  };

  const renderAdvancedDesktopFlyout = () => (
    <div role="dialog" aria-label="Bộ lọc nâng cao" className="pointer-events-none invisible absolute bottom-0 left-full z-[90] w-[min(680px,calc(100vw-360px))] -translate-x-1 pl-3 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:visible group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-x-0 group-focus-within:opacity-100">
      <div className="max-h-[78vh] overflow-y-auto overscroll-contain rounded-[22px] border border-[#dfe8e2] bg-white p-5 shadow-[0_22px_60px_rgba(26,48,36,0.2)]">
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-[#edf1ee] pb-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-600">Tùy chọn chuyên sâu</p>
            <h3 className="mt-1 text-xl font-black tracking-[-0.025em] text-[#263a4e]">Bộ lọc nâng cao</h3>
          </div>
          {draftFilterCount > 0 && <span className="shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-extrabold text-primary-700">{draftFilterCount} lựa chọn</span>}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {ADVANCED_GROUPS.map(group => {
            const Icon = group.icon;
            return (
              <section key={group.key} className="rounded-2xl border border-[#e8eeea] bg-[#f8faf9] p-4">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[#34463b]"><Icon className="h-4 w-4 text-primary-500" />{group.title}</h4>
                {renderOptions(group, true)}
              </section>
            );
          })}
        </div>
        <p className="mt-5 border-t border-[#edf1ee] pt-3 text-xs leading-5 text-[#7b8990]">Các lựa chọn sẽ được lưu tạm. Nhấn “Áp dụng bộ lọc” ở khung bên trái để cập nhật danh sách.</p>
      </div>
    </div>
  );

  const renderFilterNavigation = (mobile = false) => (
    <div>
      <div className={mobile ? '' : 'rounded-[24px] border border-[#e2e8e4] bg-white p-6 shadow-[0_14px_40px_rgba(32,55,43,0.07)]'}>
        {!mobile && (
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-[-0.03em] text-[#263a4e]">Bộ lọc tìm kiếm</h2>
            <p className="mt-1 text-sm font-medium text-[#7b8997]">Tối ưu lựa chọn của bạn</p>
          </div>
        )}
        <div className="grid gap-2">
          {PRIMARY_GROUPS.map((group, groupIndex) => {
            const Icon = group.icon;
            const active = group.key === activeGroupKey;
            const count = group.single ? (draftPriceRange ? 1 : 0) : draftFilters[group.key]?.length || 0;
            return (
              <div key={group.key} className={mobile ? '' : 'group relative'}>
                <button
                  type="button"
                  onClick={() => mobile && setActiveGroupKey(group.key)}
                  aria-haspopup={mobile ? undefined : 'dialog'}
                  className={`flex min-h-[58px] w-full items-center gap-4 rounded-xl px-4 text-left text-base font-extrabold outline-none transition ${mobile
                    ? (active ? 'bg-[#dcf3ea] text-[#304457]' : 'text-[#637487] hover:bg-[#f4f7f5]')
                    : 'text-[#637487] hover:bg-[#dcf3ea] hover:text-[#304457] focus-visible:bg-[#dcf3ea] focus-visible:text-[#304457] group-hover:bg-[#dcf3ea] group-hover:text-[#304457] group-focus-within:bg-[#dcf3ea] group-focus-within:text-[#304457]'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${mobile && active ? 'text-primary-500' : 'text-[#8190a0] transition group-hover:text-primary-500 group-focus-within:text-primary-500'}`} />
                  <span className="flex-1">{group.title}</span>
                  {count > 0 && <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary-500 px-1.5 text-[11px] font-black text-white">{count}</span>}
                  {!mobile && <ChevronRight className="h-4 w-4 text-[#9aa69f] transition group-hover:translate-x-0.5 group-hover:text-primary-600 group-focus-within:translate-x-0.5 group-focus-within:text-primary-600" />}
                </button>
                {!mobile && renderDesktopFlyout(group, groupIndex >= 2)}
              </div>
            );
          })}
        </div>
        {mobile && <div className="mt-5 border-t border-[#e8edea] pt-5"><h3 className="mb-3 text-base font-extrabold text-[#26372d]">{activePrimaryGroup.title}</h3>{renderOptions(activePrimaryGroup, true)}</div>}
        <div className={mobile ? '' : 'group relative'}>
          <button type="button" onClick={() => mobile && setShowAdvanced(value => !value)} aria-haspopup={mobile ? undefined : 'dialog'} className="mt-4 flex w-full items-center justify-between rounded-xl border border-[#e2e8e4] px-4 py-3 text-sm font-bold text-[#5c6b62] outline-none transition hover:border-primary-200 hover:bg-[#f1f8f4] focus-visible:border-primary-300 focus-visible:bg-[#f1f8f4] group-hover:border-primary-200 group-hover:bg-[#f1f8f4] group-focus-within:border-primary-300 group-focus-within:bg-[#f1f8f4]">
            <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" /> Bộ lọc nâng cao</span>
            {mobile ? (showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />) : <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-focus-within:translate-x-0.5" />}
          </button>
          {!mobile && renderAdvancedDesktopFlyout()}
        </div>
        {mobile && showAdvanced && <div className="mt-4 grid gap-5">{ADVANCED_GROUPS.map(group => <div key={group.key}><h4 className="mb-2 text-sm font-extrabold text-[#34463b]">{group.title}</h4>{renderOptions(group, true)}</div>)}</div>}
        <button type="button" onClick={applyFilters} className="btn btn-primary mt-6 w-full rounded-xl text-base">Áp dụng bộ lọc {draftFilterCount > 0 ? `(${draftFilterCount})` : ''}</button>
        {(draftFilterCount > 0 || search) && <button type="button" onClick={clearFilters} className="mt-3 w-full py-2 text-sm font-bold text-[#7a8780] hover:text-red-600">Xóa tất cả</button>}
      </div>
    </div>
  );

  const getLabel = (key, value) => normalizeOptions(filterOptions[key]).find(option => option.value === String(value))?.label || value;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f7faf8]">
      <div className="border-b border-[#e7ede9] bg-white">
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 xl:px-12">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary-600">Kho laptop EasyLap</span>
              <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#101713] sm:text-4xl">Tìm chiếc laptop dành cho bạn</h1>
              <p className="mt-2 text-sm text-[#66736b]">Đang có {pagination.total || filterOptions.totalLaptops || 0} mẫu laptop để khám phá.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-80">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a978f]" />
                <input value={search} onChange={event => { setSearch(event.target.value); resetPage(); }} placeholder="Tìm theo tên laptop..." className="h-12 w-full rounded-xl border border-[#dfe7e2] bg-[#f8faf9] pl-11 pr-4 text-sm outline-none transition focus:border-primary-300 focus:bg-white" />
              </div>
              <select value={sort} onChange={event => { setSort(event.target.value); resetPage(); }} className="h-12 rounded-xl border border-[#dfe7e2] bg-white px-4 text-sm font-semibold text-[#526158] outline-none focus:border-primary-300">
                <option value="">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến cao</option>
                <option value="price_desc">Giá: Cao đến thấp</option>
                <option value="ram_desc">RAM: Cao đến thấp</option>
                <option value="ssd_desc">SSD: Cao đến thấp</option>
                <option value="cpu_score_desc">CPU: Mạnh nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 xl:px-12">
        {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

        <div className="mb-5 flex justify-end lg:hidden">
          <button type="button" onClick={() => setIsMobileFiltersOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-[#dfe7e2] bg-white px-5 text-sm font-bold text-[#405047] shadow-[0_8px_24px_rgba(32,55,43,0.06)] transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700">
            <SlidersHorizontal className="h-4 w-4" /> Bộ lọc {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
          </button>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="hidden self-start lg:sticky lg:top-[88px] lg:z-40 lg:block">{renderFilterNavigation()}</aside>

          <main className="min-w-0">
            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-extrabold uppercase tracking-[0.1em] text-[#849087]">Đã áp dụng</span>
                {priceRange && <button type="button" onClick={() => { setPriceRange(''); setDraftPriceRange(''); resetPage(); }} className="inline-flex items-center gap-1 rounded-full bg-[#e9f7ef] px-3 py-1.5 text-xs font-bold text-primary-800">{getLabel('priceRanges', priceRange)} <X className="h-3 w-3" /></button>}
                {Object.entries(selectedFilters).map(([key, values]) => (
                  values.map(value => (
                    <button key={`${key}-${value}`} type="button" onClick={() => removeAppliedFilter(key, value)} className="inline-flex items-center gap-1 rounded-full bg-[#e9f7ef] px-3 py-1.5 text-xs font-bold text-primary-800">
                      {getLabel(key, value)} <X className="h-3 w-3" />
                    </button>
                  ))
                ))}
              </div>
            )}

            {loading ? (
              <div className="rounded-[22px] border border-[#e4eae6] bg-white py-24 text-center"><Loading /></div>
            ) : laptops.length === 0 ? (
              <div className="rounded-[22px] border border-[#e4eae6] bg-white px-6 py-20 text-center">
                <Search className="mx-auto h-12 w-12 text-[#cbd5cf]" />
                <h2 className="mt-5 text-xl font-black text-[#26372d]">Chưa tìm thấy laptop phù hợp</h2>
                <p className="mt-2 text-sm text-[#6f7d74]">Thử bỏ bớt một vài tiêu chí hoặc tìm bằng tên khác.</p>
                <button type="button" onClick={clearFilters} className="btn btn-primary mt-6">Xóa bộ lọc</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {laptops.map(laptop => <LaptopCard key={laptop.id} laptop={laptop} isFavorite={favorites.includes(laptop.id)} onToggleFavorite={handleToggleFavorite} onCompare={handleCompare} />)}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-3">
                    <button type="button" onClick={() => setPagination(previous => ({ ...previous, page: Math.max(1, previous.page - 1) }))} disabled={pagination.page === 1} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe7e2] bg-white text-[#536159] hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-5 w-5" /></button>
                    <span className="px-3 text-sm font-bold text-[#536159]">Trang {pagination.page} / {pagination.totalPages}</span>
                    <button type="button" onClick={() => setPagination(previous => ({ ...previous, page: Math.min(previous.totalPages, previous.page + 1) }))} disabled={pagination.page === pagination.totalPages} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe7e2] bg-white text-[#536159] hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-5 w-5" /></button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button type="button" aria-label="Đóng bộ lọc" onClick={() => setIsMobileFiltersOpen(false)} className="absolute inset-0 bg-[#142019]/45 backdrop-blur-sm" />
          <aside className="absolute inset-y-0 left-0 w-[min(92vw,390px)] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div><h2 className="text-2xl font-black tracking-[-0.03em] text-[#263a4e]">Bộ lọc tìm kiếm</h2><p className="text-sm text-[#7b8997]">Tối ưu lựa chọn của bạn</p></div>
              <button type="button" onClick={() => setIsMobileFiltersOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8e4]"><X className="h-5 w-5" /></button>
            </div>
            {renderFilterNavigation(true)}
          </aside>
        </div>
      )}
    </div>
  );
};

export default LaptopListPage;
