import React, { useState, useEffect } from 'react';
import quizApi from '../api/quizApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { Plus, Pencil, Trash2, HelpCircle } from 'lucide-react';

const EMPTY_FORM = {
  questionKey: '', question: '', questionGroup: 'common',
  type: 'single', displayOrder: 0, isActive: true,
  options: [{ label: '', value: '' }]
};

const AdminQuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const res = await quizApi.getAllQuestions();
      if (res.success) setQuestions(res.questions || []);
    } catch (err) {
      setError('Không thể tải câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (q) => {
    setEditId(q.id);
    setForm({
      questionKey: q.question_key, question: q.question,
      questionGroup: q.question_group, type: q.type,
      displayOrder: q.display_order, isActive: q.is_active,
      options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || '[]')
    });
    setShowForm(true);
    setFormError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xác nhận xóa câu hỏi này?')) return;
    try {
      await quizApi.adminDelete(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError('Xóa thất bại');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.questionKey || !form.question) {
      setFormError('Question key và câu hỏi là bắt buộc');
      return;
    }
    const payload = {
      questionKey: form.questionKey, question: form.question,
      questionGroup: form.questionGroup, type: form.type,
      displayOrder: Number(form.displayOrder), isActive: form.isActive,
      options: form.options.filter(o => o.label && o.value)
    };
    setIsSubmitting(true);
    try {
      if (editId) {
        await quizApi.adminUpdate(editId, payload);
      } else {
        await quizApi.adminCreate(payload);
      }
      setShowForm(false);
      setEditId(null);
      setForm(EMPTY_FORM);
      fetchQuestions();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi lưu câu hỏi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => setForm({ ...form, options: [...form.options, { label: '', value: '' }] });
  const removeOption = (idx) => setForm({ ...form, options: form.options.filter((_, i) => i !== idx) });
  const updateOption = (idx, field, val) => {
    const opts = [...form.options];
    opts[idx] = { ...opts[idx], [field]: val };
    setForm({ ...form, options: opts });
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quản lý Quiz</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="flex items-center gap-2">
            <Plus className="w-5 h-5" /> Thêm câu hỏi
          </Button>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {/* Form */}
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-6">{editId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
            <ErrorMessage message={formError} />
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Question Key *</label>
                  <input value={form.questionKey} onChange={e => setForm({ ...form, questionKey: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="userGroup" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm câu hỏi</label>
                  <input value={form.questionGroup} onChange={e => setForm({ ...form, questionGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="common / it_student / ..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung câu hỏi *</label>
                <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                  rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại câu hỏi</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="single">Single choice</option>
                    <option value="multiple">Multiple choice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự hiển thị</label>
                  <input type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="isActive" checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 text-primary-600" />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Kích hoạt</label>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Các lựa chọn</label>
                  <button type="button" onClick={addOption} className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Thêm lựa chọn
                  </button>
                </div>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input value={opt.label} onChange={e => updateOption(idx, 'label', e.target.value)}
                        placeholder="Nhãn hiển thị" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <input value={opt.value} onChange={e => updateOption(idx, 'value', e.target.value)}
                        placeholder="Giá trị (value)" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                      <button type="button" onClick={() => removeOption(idx)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
                  {['Câu hỏi', 'Key', 'Nhóm', 'Loại', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="py-3 px-4 text-left font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {questions.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900 max-w-[200px] truncate">{q.question}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{q.question_key}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{q.question_group}</span></td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{q.type}</span></td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${q.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {q.is_active ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(q)} className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Sửa
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="btn text-xs py-1.5 px-3 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {questions.length === 0 && (
              <div className="text-center py-12 text-gray-500">Chưa có câu hỏi nào.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizPage;
