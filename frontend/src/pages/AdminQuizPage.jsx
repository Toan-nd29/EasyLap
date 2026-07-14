import { useEffect, useState } from 'react';
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

  async function fetchQuestions() {
    try {
      const res = await quizApi.getAllQuestions();
      if (res.success) setQuestions(res.questions || []);
    } catch {
      setError('Không thể tải câu hỏi');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchQuestions();
  }, []);

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
    } catch {
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
    <div className="min-h-[calc(100vh-72px)] bg-[#f5f8f6] py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow inline-flex items-center gap-2"><HelpCircle className="h-4 w-4" /> Nội dung tư vấn</span>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#172019] sm:text-4xl">Quản lý Quiz</h1>
            <p className="mt-2 text-sm text-[#66736b]">Xây dựng bộ câu hỏi rõ ràng để hệ thống đưa ra gợi ý chính xác hơn.</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); }} className="self-start px-6 sm:self-auto">
            <Plus className="h-4 w-4" /> Thêm câu hỏi
          </Button>
        </div>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-[24px] border border-[#dfe7e2] bg-white p-6 shadow-[0_14px_40px_rgba(32,55,43,0.06)] sm:p-8">
            <div className="mb-6 border-b border-[#e8eeea] pb-5">
              <p className="eyebrow">Thiết lập câu hỏi</p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#213128]">{editId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
            </div>
            <ErrorMessage message={formError} />
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#405047]">Question Key *</label>
                  <input value={form.questionKey} onChange={e => setForm({ ...form, questionKey: e.target.value })}
                    className="input-clean h-11 px-3 text-sm" placeholder="userGroup" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#405047]">Nhóm câu hỏi</label>
                  <input value={form.questionGroup} onChange={e => setForm({ ...form, questionGroup: e.target.value })}
                    className="input-clean h-11 px-3 text-sm" placeholder="common / it_student / ..." />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#405047]">Nội dung câu hỏi *</label>
                <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                  rows={3} className="input-clean px-3 py-3 text-sm" />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#405047]">Loại câu hỏi</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="input-clean h-11 px-3 text-sm">
                    <option value="single">Single choice</option>
                    <option value="multiple">Multiple choice</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#405047]">Thứ tự hiển thị</label>
                  <input type="number" value={form.displayOrder} onChange={e => setForm({ ...form, displayOrder: e.target.value })}
                    className="input-clean h-11 px-3 text-sm" />
                </div>
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-[#e4ebe6] bg-[#f8faf9] px-4 py-3">
                  <input type="checkbox" id="isActive" checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 accent-primary-500" />
                  <label htmlFor="isActive" className="text-sm font-bold text-[#405047]">Kích hoạt</label>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <label className="block text-sm font-bold text-[#405047]">Các lựa chọn</label>
                  <button type="button" onClick={addOption} className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-2 text-xs font-extrabold text-primary-700 hover:bg-primary-100">
                    <Plus className="h-3.5 w-3.5" /> Thêm lựa chọn
                  </button>
                </div>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex flex-col gap-2 rounded-2xl border border-[#e6ece8] bg-[#f8faf9] p-3 sm:flex-row sm:items-center">
                      <input value={opt.label} onChange={e => updateOption(idx, 'label', e.target.value)}
                        placeholder="Nhãn hiển thị" className="input-clean h-11 flex-1 px-3 text-sm" />
                      <input value={opt.value} onChange={e => updateOption(idx, 'value', e.target.value)}
                        placeholder="Giá trị (value)" className="input-clean h-11 flex-1 px-3 text-sm" />
                      <button type="button" onClick={() => removeOption(idx)}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#e8eeea] pt-5">
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
                  {['Câu hỏi', 'Key', 'Nhóm', 'Loại', 'Trạng thái', 'Thao tác'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-extrabold uppercase tracking-[0.08em] text-[#536159]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#edf1ef]">
                {questions.map(q => (
                  <tr key={q.id} className="transition hover:bg-primary-50/40">
                    <td className="max-w-[240px] truncate px-5 py-4 font-bold text-[#26372d]">{q.question}</td>
                    <td className="px-5 py-4 font-mono text-xs text-[#7a8780]">{q.question_key}</td>
                    <td className="px-5 py-4"><span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-700">{q.question_group}</span></td>
                    <td className="px-5 py-4"><span className="rounded-full bg-[#eef2ef] px-2.5 py-1 text-xs font-bold text-[#536159]">{q.type}</span></td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${q.is_active ? 'bg-primary-50 text-primary-700' : 'bg-[#eef2ef] text-[#7a8780]'}`}>
                        {q.is_active ? 'Hoạt động' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(q)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dfe7e2] bg-[#f5f8f6] px-3 text-xs font-bold text-[#405047] hover:border-primary-300 hover:text-primary-700">
                          <Pencil className="h-3.5 w-3.5" /> Sửa
                        </button>
                        <button onClick={() => handleDelete(q.id)} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-600 hover:bg-red-100">
                          <Trash2 className="h-3.5 w-3.5" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {questions.length === 0 && (
              <div className="px-5 py-14 text-center text-sm text-[#7a8780]">Chưa có câu hỏi nào.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQuizPage;
