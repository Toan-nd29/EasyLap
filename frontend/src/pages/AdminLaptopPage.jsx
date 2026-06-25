import React, { useState, useEffect } from 'react';
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

  useEffect(() => { fetchLaptops(); }, []);

  const fetchLaptops = async () => {
    try {
      const res = await laptopApi.getAll();
      if (res.success) setLaptops(res.data || []);
    } catch (err) {
      setError('Không thể tải danh sách laptop');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Laptop className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Laptop</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Thêm laptop
          </Button>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-6">{editId ? 'Sửa laptop' : 'Thêm laptop mới'}</h2>
            <ErrorMessage message={formError} />
            <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    {...rest}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPU Type</label>
                <select value={form.gpuType} onChange={e => setForm({ ...form, gpuType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="integrated">Integrated</option>
                  <option value="dedicated">Dedicated</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="upgradeable" checked={form.upgradeable}
                  onChange={e => setForm({ ...form, upgradeable: e.target.checked })}
                  className="w-4 h-4 text-primary-600" />
                <label htmlFor="upgradeable" className="text-sm font-medium text-gray-700">Có thể nâng cấp</label>
              </div>

              {[
                { label: 'Phù hợp với (cách nhau bằng dấu phẩy)', key: 'suitable_for' },
                { label: 'Tags (cách nhau bằng dấu phẩy)', key: 'tags' },
                { label: 'Ưu điểm (cách nhau bằng dấu phẩy)', key: 'pros' },
                { label: 'Nhược điểm (cách nhau bằng dấu phẩy)', key: 'cons' },
              ].map(({ label, key }) => (
                <div key={key} className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="item1, item2, item3"
                  />
                </div>
              ))}

              <div className="col-span-full flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn btn-outline">Hủy</button>
                <Button type="submit" isLoading={isSubmitting}>{editId ? 'Lưu thay đổi' : 'Thêm mới'}</Button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Tên', 'Hãng', 'Giá', 'CPU', 'RAM/SSD', 'Thao tác'].map(h => (
                    <th key={h} className="py-3 px-4 text-left font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {laptops.map(laptop => (
                  <tr key={laptop.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{laptop.name}</td>
                    <td className="py-3 px-4 text-gray-600">{laptop.brand}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatCurrency(laptop.price)}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-[150px] truncate">{laptop.cpu}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{laptop.ram}GB / {laptop.ssd}GB</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(laptop)} className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Sửa
                        </button>
                        <button onClick={() => handleDelete(laptop.id)} className="btn text-xs py-1.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {laptops.length === 0 && (
              <div className="text-center py-12 text-gray-500">Chưa có laptop nào. Bấm "Thêm laptop" để bắt đầu.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLaptopPage;
