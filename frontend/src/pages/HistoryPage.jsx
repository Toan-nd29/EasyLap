import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../api/userApi';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { formatCurrency } from '../utils/formatCurrency';
import { History, ChevronDown, ChevronUp } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await userApi.getHistory();
      if (res.success) {
        setHistory(res.history || []);
      } else {
        setError('Không thể tải lịch sử quiz.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <Loading fullScreen />;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <History className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Lịch sử Quiz</h1>
            <p className="text-gray-600 mt-1">{history.length} lần làm quiz</p>
          </div>
        </div>

        {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

        {history.length === 0 ? (
          <div className="card text-center py-20">
            <History className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-3">Chưa có lịch sử Quiz</h2>
            <p className="text-gray-600 mb-8">Bạn chưa làm quiz nào. Hãy thực hiện bài quiz để nhận gợi ý laptop phù hợp!</p>
            <Link to="/quiz" className="btn btn-primary">Làm Quiz ngay</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((attempt) => (
              <div key={attempt.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-semibold rounded-full">
                        {attempt.user_group}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {new Date(attempt.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {attempt.summary && (
                      <p className="text-gray-600 text-sm mb-3">{attempt.summary}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpanded(attempt.id)}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {expanded[attempt.id] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {expanded[attempt.id] && attempt.recommendations && attempt.recommendations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Laptop được gợi ý:</h3>
                    <div className="space-y-3">
                      {attempt.recommendations.map((rec) => (
                        <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <Link to={`/laptops/${rec.laptop_id}`} className="font-medium text-gray-900 hover:text-primary-600 text-sm">
                              {rec.laptops?.name || 'Laptop'}
                            </Link>
                            {rec.laptops?.price && (
                              <div className="text-sm text-gray-500">{formatCurrency(rec.laptops.price)}</div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-primary-600">{rec.final_score}</span>
                            <div className="text-xs text-gray-500">điểm</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
