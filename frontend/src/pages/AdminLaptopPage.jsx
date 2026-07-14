import { useEffect, useState } from 'react';
import laptopApi from '../api/laptopApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { formatCurrency } from '../utils/formatCurrency';
import { Plus, Pencil, Trash2, Laptop } from 'lucide-react';

const EMPTY_FORM = {
  name: '', brand: '', price: '', cpu: '', cpuScore: '', ram: '',
  ssd: '', gpu: '', gpuType: 'integrated', screen: '', screenScore: '',
  batteryScore: '', weight: '', warranty: '', upgradeable: false,
  suitable_for: '', tags: '', pros: '', cons: '', image_url: '', shop_url: ''
};

const AdminLaptopPage = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  async function fetchLaptops() {
    try {
      const res = await laptopApi.getAll();
      if (res.success) setLaptops(res.data || []);
    } catch {
      setError('Không thể tải danh sách laptop');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLaptops();
  }, []);

  const handleEdit = (laptop) => {
    setEditId(laptop.id);
    setForm({
      name: laptop.name, brand: laptop.brand, price: laptop.price,
      cpu: laptop.cpu, cpuScore: laptop.cpu_score, ram: laptop.ram,
      ssd: laptop.ssd, gpu: laptop.gpu, gpuType: laptop.gpu_type,
      screen: laptop.screen, screenScore: laptop.screen_score,
      batteryScore: laptop.battery_score, weight: laptop.weight,
      warranty: laptop.warranty || '', upgradeable: laptop.upgradeable || false,
      suitable_for: (laptop.suitable_for || []).join(', '),
      tags: (laptop.tags || []).join(', '),
      pros: (laptop.pros || []).join(', '),
      cons: (laptop.cons || []).join(', '),
      image_url: laptop.image_url || '', shop_url: laptop.shop_url || ''
    });
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa laptop này?')) return;
    try {
      await laptopApi.adminDelete(id);
      setLaptops(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      setError('Xóa thất bại: ' + (err.message || ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.brand || !form.price) {
      setFormError('Tên, hãng và giá là bắt buộc');
      return;
    }
    const payload = {
      name: form.name, brand: form.brand, price: Number(form.price),
      cpu: form.cpu, cpuScore: Number(form.cpuScore), ram: Number(form.ram),
      ssd: Number(form.ssd), gpu: form.gpu, gpuType: form.gpuType,
      screen: form.screen, screenScore: Number(form.screenScore),
      batteryScore: Number(form.batteryScore), weight: Number(form.weight),
      warranty: form.warranty, upgradeable: form.upgradeable,
      suitable_for: form.suitable_for.split(',').map(s => s.trim()).filter(Boolean),
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      pros: form.pros.split(',').map(s => s.trim()).filter(Boolean),
      cons: form.cons.split(',').map(s => s.trim()).filter(Boolean),
      image_url: form.image_url, shop_url: form.shop_url
    };
    setIsSubmitting(true);
    try {
      if (editId) {
        await laptopApi.adminUpdate(editId, payload);
      } else {
        await laptopApi.adminCreate(payload);
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      fetchLaptops();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu laptop');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f5f8f6] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow inline-flex items-center gap-2"><Laptop className="h-4 w-4" /> Kho dữ liệu</span>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#172019] sm:text-4xl">Quản lý Laptop</h1>
            <p className="mt-2 text-sm text-[#66736b]">Cập nhật sản phẩm, cấu hình và thông tin hiển thị trên EasyLap.</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="self-start px-6 sm:self-auto">
            <Plus className="h-4 w-4" /> Thêm laptop
          </Button>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-[24px] border border-[#dfe7e2] bg-white p-6 shadow-[0_14px_40px_rgba(32,55,43,0.06)] sm:p-8">
            <div className="mb-6 border-b border-[#e8eeea] pb-5">
              <p className="eyebrow">Thông tin sản phẩm</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#213128]">{editId ? 'Sửa laptop' : 'Thêm laptop mới'}</h2>
            </div>
            <ErrorMessage message={formError} />
            <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: 'Tên máy *', key: 'name', placeholder: 'MacBook Air M2' },
                { label: 'Hãng *', key: 'brand', placeholder: 'Apple' },
                { label: 'Giá (VND) *', key: 'price', placeholder: '25000000', type: 'number' },
                { label: 'CPU', key: 'cpu', placeholder: 'Apple M2' },
                { label: 'CPU Score (0-10)', key: 'cpuScore', type: 'number', placeholder: '9' },
                { label: 'RAM (GB)', key: 'ram', type: 'number', placeholder: '8' },
                { label: 'SSD (GB)', key: 'ssd', type: 'number', placeholder: '256' },
                { label: 'GPU', key: 'gpu', placeholder: 'Apple GPU 10-core' },
                { label: 'Màn hình', key: 'screen', placeholder: '13.6" Liquid Retina' },
                { label: 'Screen Score (0-10)', key: 'screenScore', type: 'number', placeholder: '9' },
                { label: 'Battery Score (0-10)', key: 'batteryScore', type: 'number', placeholder: '10' },
                { label: 'Cân nặng (kg)', key: 'weight', type: 'number', step: '0.01', placeholder: '1.24' },
                { label: 'Bảo hành', key: 'warranty', placeholder: '12 months' },
                { label: 'Link ảnh', key: 'image_url', placeholder: 'https://...' },
                { label: 'Link mua hàng', key: 'shop_url', placeholder: 'https://...' },
              ].map(({ label, key, ...rest }) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-bold text-[#405047]">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="input-clean h-11 px-3 text-sm"
                    {...rest}
                  />
                </div>
              ))}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#405047]">GPU Type</label>
                <select value={form.gpuType} onChange={e => setForm({ ...form, gpuType: e.target.value })}
                  className="input-clean h-11 px-3 text-sm">
                  <option value="integrated">Integrated</option>
                  <option value="dedicated">Dedicated</option>
                </select>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-[#e4ebe6] bg-[#f8faf9] px-4 pt-6 sm:py-3 sm:mt-7">
                <input type="checkbox" id="upgradeable" checked={form.upgradeable}
                  onChange={e => setForm({ ...form, upgradeable: e.target.checked })}
                  className="h-4 w-4 accent-primary-500" />
                <label htmlFor="upgradeable" className="text-sm font-bold text-[#405047]">Có thể nâng cấp</label>
              </div>

              {[
                { label: 'Phù hợp với (cách nhau bằng dấu phẩy)', key: 'suitable_for' },
                { label: 'Tags (cách nhau bằng dấu phẩy)', key: 'tags' },
                { label: 'Ưu điểm (cách nhau bằng dấu phẩy)', key: 'pros' },
                { label: 'Nhược điểm (cách nhau bằng dấu phẩy)', key: 'cons' },
              ].map(({ label, key }) => (
                <div key={key} className="col-span-full">
                  <label className="mb-2 block text-sm font-bold text-[#405047]">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="input-clean h-11 px-3 text-sm"
                    placeholder="item1, item2, item3"
                  />
                </div>
              ))}

              <div className="col-span-full mt-2 flex justify-end gap-3 border-t border-[#e8eeea] pt-5">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-outline">Hủy</button>
                <Button type="submit" isLoading={isSubmitting}>{editId ? 'Lưu thay đổi' : 'Thêm mới'}</Button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-[24px] border border-[#dfe7e2] bg-white shadow-[0_14px_40px_rgba(32,55,43,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-[#dfe7e2] bg-[#eef2ef]">
                <tr>
                  {['Tên', 'Hãng', 'Giá', 'CPU', 'RAM/SSD', 'Thao tác'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.08em] text-[#536159]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1ef]">
                {laptops.map(laptop => (
                  <tr key={laptop.id} className="transition hover:bg-primary-50/40">
                    <td className="px-5 py-4 font-bold text-[#26372d]">{laptop.name}</td>
                    <td className="px-5 py-4 text-[#66736b]">{laptop.brand}</td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#26372d]">{formatCurrency(laptop.price)}</td>
                    <td className="max-w-[180px] truncate px-5 py-4 text-[#66736b]">{laptop.cpu}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-[#66736b]">{laptop.ram}GB / {laptop.ssd}GB</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(laptop)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dfe7e2] bg-[#f5f8f6] px-3 text-xs font-bold text-[#405047] hover:border-primary-300 hover:text-primary-700">
                          <Pencil className="h-3.5 w-3.5" /> Sửa
                        </button>
                        <button onClick={() => handleDelete(laptop.id)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100">
                          <Trash2 className="h-3.5 w-3.5" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {laptops.length === 0 && (
              <div className="px-5 py-14 text-center text-sm text-[#7a8780]">Chưa có laptop nào. Bấm “Thêm laptop” để bắt đầu.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLaptopPage;
