import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  Cpu,
  ExternalLink,
  HardDrive,
  Heart,
  Layers3,
  Monitor,
  Scale,
  Shield,
  Sparkles,
  Weight,
  XCircle
} from 'lucide-react';
import laptopApi from '../api/laptopApi';
import userApi from '../api/userApi';
import ErrorMessage from '../components/ErrorMessage';
import LaptopImage from '../components/LaptopImage';
import Loading from '../components/Loading';
import { formatCurrency } from '../utils/formatCurrency';

const normalizeText = (value = '') => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const tokenize = (value) => normalizeText(value).split(' ').filter(Boolean);

const HARDWARE_MARKERS = new Set([
  'intel', 'amd', 'apple', 'core', 'ultra', 'ryzen', 'celeron', 'pentium',
  'athlon', 'xeon', 'snapdragon', 'mediatek', 'ram', 'ssd', 'hdd', 'rtx',
  'gtx', 'geforce', 'radeon', 'arc'
]);

const isHardwareToken = (token) => (
  HARDWARE_MARKERS.has(token)
  || /^i[3579]-?\d+/i.test(token)
  || /^\d+(?:gb|tb)$/i.test(token)
  || /^\d{3,5}[uhpx]$/i.test(token)
);

const getLineTokens = (product) => {
  if (!product) return [];

  let nameTokens = tokenize(product.name);
  const brandTokens = tokenize(product.brand);
  const startsWithBrand = brandTokens.length > 0
    && brandTokens.every((token, index) => nameTokens[index] === token);

  if (startsWithBrand) nameTokens = nameTokens.slice(brandTokens.length);

  const lineTokens = [];
  for (const token of nameTokens) {
    if (token === 'laptop' || token === 'notebook') continue;
    if (lineTokens.length >= 2 && (isHardwareToken(token) || /^\d{7,}$/.test(token))) break;
    lineTokens.push(token);
    if (lineTokens.length === 6) break;
  }

  return lineTokens;
};

const getCommonPrefixLength = (left, right) => {
  let length = 0;
  while (length < Math.min(left.length, right.length) && left[length] === right[length]) {
    length += 1;
  }
  return length;
};

const getNameSimilarity = (current, candidate) => {
  const currentTokens = getLineTokens(current);
  const candidateTokens = getLineTokens(candidate);
  if (currentTokens.length === 0 || candidateTokens.length === 0) return 0;

  const commonPrefix = getCommonPrefixLength(currentTokens, candidateTokens);
  const candidateSet = new Set(candidateTokens);
  const sharedTokens = currentTokens.filter(token => candidateSet.has(token)).length;
  const coverage = sharedTokens / Math.min(currentTokens.length, candidateTokens.length);
  return commonPrefix * 3 + coverage * 2;
};

const isSameProductLine = (current, candidate) => {
  if (!current || !candidate) return false;
  if (String(current.id) === String(candidate.id)) return true;
  if (normalizeText(current.brand) !== normalizeText(candidate.brand)) return false;
  if (normalizeText(current.name) === normalizeText(candidate.name)) return true;

  const currentTokens = getLineTokens(current);
  const candidateTokens = getLineTokens(candidate);
  if (currentTokens.length === 0 || candidateTokens.length === 0) return false;

  const commonPrefix = getCommonPrefixLength(currentTokens, candidateTokens);
  const candidateSet = new Set(candidateTokens);
  const sharedTokens = currentTokens.filter(token => candidateSet.has(token)).length;
  const coverage = sharedTokens / Math.min(currentTokens.length, candidateTokens.length);

  return commonPrefix >= 3 || (commonPrefix >= 2 && coverage >= 0.65);
};

const getProductLineSearch = (product) => getLineTokens(product).slice(0, 4).join(' ');

const mergeUniqueProducts = (...lists) => {
  const products = new Map();
  lists.flat().filter(Boolean).forEach(product => {
    const productId = String(product.id);
    if (!products.has(productId)) products.set(productId, product);
  });
  return [...products.values()];
};

const formatRam = (value) => {
  if (value === null || value === undefined || value === '') return 'Đang cập nhật';
  const text = String(value).trim();
  return /(?:gb|tb)$/i.test(text) ? text.toUpperCase() : `${text}GB`;
};

const formatStorage = (value) => {
  if (value === null || value === undefined || value === '') return 'Đang cập nhật';
  const text = String(value).trim();
  if (/(?:gb|tb)$/i.test(text)) return text.toUpperCase();

  const numericValue = Number(value);
  if (Number.isFinite(numericValue) && numericValue >= 1000) {
    const divisor = numericValue % 1000 === 0 ? 1000 : 1024;
    const terabytes = numericValue / divisor;
    return `${Number.isInteger(terabytes) ? terabytes : terabytes.toFixed(1)}TB`;
  }
  return `${text}GB`;
};

const RelatedProductCard = ({ product }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#e2e9e5] bg-white shadow-[0_10px_28px_rgba(32,55,43,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_18px_40px_rgba(32,55,43,0.10)]">
    <Link to={`/laptops/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#f3f7f4] p-5">
      <div className="absolute inset-x-8 bottom-5 h-10 rounded-full bg-primary-100/50 blur-2xl" />
      <LaptopImage laptop={product} className="relative h-full w-full object-contain mix-blend-multiply transition duration-300 group-hover:scale-[1.04]" fallbackClassName="relative h-full w-full" />
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-primary-700">{product.brand}</span>
      <Link to={`/laptops/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-2 line-clamp-2 min-h-12 text-base font-extrabold leading-6 tracking-[-0.02em] text-[#172019] transition hover:text-primary-700">
        {product.name}
      </Link>
      <div className="mt-2 text-lg font-black text-[#0d6e3f]">{formatCurrency(product.price)}</div>
      <div className="mt-4 space-y-2 border-t border-[#edf1ef] pt-4 text-xs text-[#66736b]">
        <div className="flex items-center gap-2"><Cpu className="h-3.5 w-3.5 shrink-0 text-primary-500" /><span className="truncate">{product.cpu || 'CPU đang cập nhật'}</span></div>
        <div className="flex items-center gap-2"><HardDrive className="h-3.5 w-3.5 shrink-0 text-primary-500" /><span>{formatRam(product.ram)} RAM · {formatStorage(product.ssd)} SSD</span></div>
      </div>
      <Link to={`/laptops/${product.id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-5 inline-flex items-center gap-1.5 text-sm font-extrabold text-primary-700 transition group-hover:gap-2.5">
        Xem chi tiết <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </article>
);

const LaptopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [catalogCandidates, setCatalogCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteBusy, setFavoriteBusy] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchLaptop = async () => {
      setLoading(true);
      setError('');
      setLaptop(null);
      setCatalogCandidates([]);

      try {
        const [laptopResult, favoriteResult] = await Promise.allSettled([
          laptopApi.getById(id),
          userApi.getFavorites()
        ]);

        if (laptopResult.status !== 'fulfilled' || !laptopResult.value.success) {
          throw new Error('Không tìm thấy laptop này.');
        }

        if (!isActive) return;
        setLaptop(laptopResult.value.laptop);

        if (favoriteResult.status === 'fulfilled' && favoriteResult.value.success) {
          const favoriteEntries = favoriteResult.value.favorites || favoriteResult.value.data || [];
          const favoriteIds = favoriteEntries.map(entry => entry.laptop_id ?? entry.laptops?.id ?? entry.id);
          setIsFavorite(favoriteIds.some(favoriteId => String(favoriteId) === String(id)));
        } else {
          setIsFavorite(false);
        }
      } catch (requestError) {
        if (isActive) setError(requestError.message || 'Lỗi kết nối máy chủ.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchLaptop();
    return () => { isActive = false; };
  }, [id]);

  useEffect(() => {
    if (!laptop) return undefined;
    let isActive = true;

    const fetchRelatedProducts = async () => {
      setRelatedLoading(true);
      const productLineSearch = getProductLineSearch(laptop);
      const requests = [laptopApi.getAll({ brands: laptop.brand, limit: 20 })];

      if (productLineSearch) {
        requests.push(laptopApi.getAll({ brands: laptop.brand, search: productLineSearch, limit: 20 }));
      }

      try {
        const results = await Promise.allSettled(requests);
        if (!isActive) return;

        const productLists = results
          .filter(result => result.status === 'fulfilled' && result.value.success)
          .map(result => result.value.data || []);
        setCatalogCandidates(mergeUniqueProducts(...productLists));
      } catch (requestError) {
        console.error('Related laptops error', requestError);
        if (isActive) setCatalogCandidates([]);
      } finally {
        if (isActive) setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
    return () => { isActive = false; };
  }, [laptop]);

  const configurationOptions = useMemo(() => {
    if (!laptop) return [];
    return mergeUniqueProducts(laptop, catalogCandidates)
      .filter(product => isSameProductLine(laptop, product))
      .sort((left, right) => {
        if (String(left.id) === String(laptop.id)) return -1;
        if (String(right.id) === String(laptop.id)) return 1;
        return Number(left.price || 0) - Number(right.price || 0);
      })
      .slice(0, 9);
  }, [catalogCandidates, laptop]);

  const relatedProducts = useMemo(() => {
    if (!laptop) return [];
    return catalogCandidates
      .filter(product => String(product.id) !== String(laptop.id))
      .sort((left, right) => {
        const similarityDifference = getNameSimilarity(laptop, right) - getNameSimilarity(laptop, left);
        if (similarityDifference !== 0) return similarityDifference;
        return Math.abs(Number(left.price || 0) - Number(laptop.price || 0))
          - Math.abs(Number(right.price || 0) - Number(laptop.price || 0));
      })
      .slice(0, 8);
  }, [catalogCandidates, laptop]);

  const handleSelectConfiguration = (productId) => {
    if (String(productId) === String(id)) return;
    navigate(`/laptops/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFavorite = async () => {
    if (favoriteBusy) return;
    setFavoriteBusy(true);
    try {
      if (isFavorite) {
        await userApi.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await userApi.addFavorite(id);
        setIsFavorite(true);
      }
    } catch (requestError) {
      console.error('Favorite error', requestError);
    } finally {
      setFavoriteBusy(false);
    }
  };

  const handleCompare = () => {
    let compareList;
    try {
      compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
    } catch {
      compareList = [];
    }

    if (!compareList.some(product => String(product.id) === String(laptop.id))) {
      if (compareList.length >= 3) {
        alert('Chỉ có thể so sánh tối đa 3 máy!');
        return;
      }
      localStorage.setItem('compareList', JSON.stringify([...compareList, laptop]));
    }
    navigate('/compare');
  };

  if (loading) return <Loading fullScreen />;
  if (error) return <div className="mx-auto max-w-3xl p-8"><ErrorMessage message={error} /></div>;
  if (!laptop) return null;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f7faf8] pb-16">
      <div className="border-b border-[#e7ede9] bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-4 sm:px-8">
          <Link to="/laptops" className="inline-flex items-center gap-2 text-sm font-bold text-[#68766d] transition hover:text-primary-700">
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách laptop
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-[1280px] px-5 pt-8 sm:px-8 lg:pt-10">
        <section className="grid overflow-hidden rounded-[28px] border border-[#e1e9e4] bg-white shadow-[0_18px_50px_rgba(32,55,43,0.07)] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#f2f8f4_0%,#edf9f3_100%)] p-8 sm:min-h-[440px] lg:min-h-[580px] lg:p-12">
            <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-primary-100/60 blur-3xl" />
            <div className="absolute -bottom-12 right-0 h-56 w-56 rounded-full bg-[#d7f7ef]/80 blur-3xl" />
            <LaptopImage laptop={laptop} className="relative z-10 max-h-[340px] w-full object-contain mix-blend-multiply drop-shadow-[0_22px_28px_rgba(31,55,42,0.13)]" fallbackClassName="relative z-10 min-h-[250px] w-full" iconClassName="h-9 w-9" />
          </div>

          <div className="flex flex-col p-6 sm:p-9 lg:p-11">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-primary-700">{laptop.brand}</span>
                <h1 className="mt-4 text-2xl font-black leading-tight tracking-[-0.04em] text-[#152019] sm:text-3xl lg:text-[36px]">{laptop.name}</h1>
              </div>
              <button
                type="button"
                aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                onClick={handleToggleFavorite}
                disabled={favoriteBusy}
                className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition disabled:cursor-wait disabled:opacity-60 ${isFavorite ? 'border-red-100 bg-red-50 text-red-500' : 'border-[#e0e8e3] bg-white text-[#77847c] hover:border-red-200 hover:text-red-500'}`}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="mt-5 text-3xl font-black tracking-[-0.03em] text-[#0d6e3f]">{formatCurrency(laptop.price)}</div>

            <div className="mt-7 grid gap-3 border-y border-[#eaf0ec] py-6 text-sm sm:grid-cols-2">
              <div className="flex items-start gap-3 text-[#5f6e64]"><Cpu className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" /><span>{laptop.cpu || 'CPU đang cập nhật'}</span></div>
              <div className="flex items-start gap-3 text-[#5f6e64]"><HardDrive className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" /><span>{formatRam(laptop.ram)} RAM</span></div>
              <div className="flex items-start gap-3 text-[#5f6e64]"><HardDrive className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" /><span>{formatStorage(laptop.ssd)} SSD</span></div>
              <div className="flex items-start gap-3 text-[#5f6e64]"><Monitor className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" /><span>{laptop.screen || 'Màn hình đang cập nhật'}</span></div>
              {laptop.weight && <div className="flex items-start gap-3 text-[#5f6e64]"><Weight className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" /><span>{laptop.weight}kg</span></div>}
              {laptop.warranty && <div className="flex items-start gap-3 text-[#5f6e64]"><Shield className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" /><span>Bảo hành {laptop.warranty}</span></div>}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" onClick={handleCompare} className="btn btn-outline flex-1 gap-2 whitespace-nowrap">
                <Scale className="h-5 w-5" /> So sánh
              </button>
              {laptop.shop_url && (
                <a href={laptop.shop_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 gap-2 whitespace-nowrap">
                  <ExternalLink className="h-5 w-5" /> Xem tại cửa hàng
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="mt-7 rounded-[26px] border border-[#e1e9e4] bg-white p-6 shadow-[0_12px_36px_rgba(32,55,43,0.05)] sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-primary-700"><Layers3 className="h-5 w-5" /><span className="text-xs font-black uppercase tracking-[0.13em]">Phiên bản thực tế</span></div>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#1b2a21]">Tùy chọn cấu hình</h2>
              <p className="mt-1 text-sm text-[#718078]">Chọn một phiên bản để xem đúng thông số và giá bán của sản phẩm đó.</p>
            </div>
            {!relatedLoading && <span className="w-fit rounded-full bg-[#eef9f3] px-3 py-1.5 text-xs font-extrabold text-primary-700">{configurationOptions.length} cấu hình</span>}
          </div>

          {relatedLoading ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map(item => <div key={item} className="h-36 animate-pulse rounded-2xl bg-[#f0f5f2]" />)}
            </div>
          ) : (
            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {configurationOptions.map(option => {
                const isCurrent = String(option.id) === String(laptop.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelectConfiguration(option.id)}
                    aria-pressed={isCurrent}
                    className={`relative flex min-h-[150px] flex-col rounded-2xl border p-4 text-left transition duration-200 ${isCurrent ? 'border-primary-500 bg-[linear-gradient(145deg,#effcf5,#e6f9ef)] shadow-[0_8px_22px_rgba(37,200,117,0.12)] ring-1 ring-primary-500' : 'border-[#dce5df] bg-white hover:-translate-y-0.5 hover:border-primary-300 hover:bg-[#fbfefc] hover:shadow-md'}`}
                  >
                    <div className="flex w-full items-start gap-2.5">
                      {isCurrent ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 fill-primary-600 text-white" /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#8b9990]" />}
                      <div className="min-w-0">
                        <div className="line-clamp-2 text-sm font-extrabold leading-5 text-[#25352b]">{option.name}</div>
                        <div className="mt-2 line-clamp-1 text-xs text-[#627168]">{option.cpu || 'CPU đang cập nhật'}</div>
                        <div className="mt-1 text-xs font-semibold text-[#627168]">{formatRam(option.ram)} RAM · {formatStorage(option.ssd)} SSD</div>
                      </div>
                    </div>
                    <div className="mt-auto flex w-full items-end justify-between gap-3 pt-3">
                      <span className="text-lg font-black text-[#0d7b42]">{formatCurrency(option.price)}</span>
                      {isCurrent && <span className="rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-white">Đang xem</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {(laptop.pros?.length > 0 || laptop.cons?.length > 0) && (
          <section className="mt-7 grid gap-6 md:grid-cols-2">
            {laptop.pros?.length > 0 && (
              <div className="rounded-[24px] border border-[#dcebe2] bg-white p-6 shadow-[0_10px_30px_rgba(32,55,43,0.04)]">
                <h2 className="flex items-center gap-2 text-lg font-black text-[#1c2b22]"><CheckCircle2 className="h-5 w-5 text-primary-500" /> Ưu điểm</h2>
                <ul className="mt-4 space-y-3">
                  {laptop.pros.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm leading-6 text-[#5d6b62]"><Check className="mt-1 h-4 w-4 shrink-0 text-primary-500" />{item}</li>)}
                </ul>
              </div>
            )}
            {laptop.cons?.length > 0 && (
              <div className="rounded-[24px] border border-[#ece5e2] bg-white p-6 shadow-[0_10px_30px_rgba(32,55,43,0.04)]">
                <h2 className="flex items-center gap-2 text-lg font-black text-[#1c2b22]"><XCircle className="h-5 w-5 text-[#e06a55]" /> Điểm cần lưu ý</h2>
                <ul className="mt-4 space-y-3">
                  {laptop.cons.map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2.5 text-sm leading-6 text-[#5d6b62]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e48a77]" />{item}</li>)}
                </ul>
              </div>
            )}
          </section>
        )}

        {(laptop.suitable_for?.length > 0 || laptop.tags?.length > 0) && (
          <section className="mt-7 rounded-[24px] border border-[#e1e9e4] bg-white p-6 shadow-[0_10px_30px_rgba(32,55,43,0.04)]">
            <h2 className="flex items-center gap-2 text-lg font-black text-[#1c2b22]"><Sparkles className="h-5 w-5 text-primary-500" /> Phù hợp với bạn nếu...</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {laptop.suitable_for?.map((item, index) => <span key={`${item}-${index}`} className="rounded-full bg-primary-50 px-3.5 py-2 text-xs font-bold text-primary-800">{item}</span>)}
              {laptop.tags?.map((item, index) => <span key={`${item}-${index}`} className="rounded-full bg-[#f2f5f3] px-3.5 py-2 text-xs font-bold text-[#68766d]">#{item}</span>)}
            </div>
          </section>
        )}

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.14em] text-primary-700">Gợi ý từ EasyLap</span>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#172019] sm:text-3xl">Sản phẩm cùng loại</h2>
              <p className="mt-2 text-sm text-[#6d7a72]">Các mẫu {laptop.brand} thật trong kho dữ liệu để bạn dễ cân nhắc thêm.</p>
            </div>
            <Link to={`/laptops?search=${encodeURIComponent(laptop.brand)}`} className="inline-flex w-fit items-center gap-1.5 text-sm font-extrabold text-primary-700 hover:text-primary-800">Xem thêm <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {relatedLoading ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map(item => <div key={item} className="h-[390px] animate-pulse rounded-[22px] bg-[#eaf1ed]" />)}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map(product => <RelatedProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-[22px] border border-dashed border-[#cfddd4] bg-white px-6 py-12 text-center">
              <p className="font-bold text-[#435249]">Chưa có thêm sản phẩm cùng hãng trong dữ liệu.</p>
              <p className="mt-1 text-sm text-[#758279]">EasyLap sẽ hiển thị tại đây ngay khi kho sản phẩm được cập nhật.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default LaptopDetailPage;
