import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CompareTable from '../components/CompareTable';
import { Scale, Plus } from 'lucide-react';

const ComparePage = () => {
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('compareList');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompareList(parsed.filter(Boolean)); // filter out nulls just in case
      } catch (err) {
        console.error('Failed to parse compareList', err);
        localStorage.removeItem('compareList');
      }
    }
  }, []);

  const handleRemove = (laptopId) => {
    const updated = compareList.filter(l => l.id !== laptopId);
    setCompareList(updated);
    localStorage.setItem('compareList', JSON.stringify(updated));
  };

  const handleClear = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Scale className="w-8 h-8 text-primary-600" /> So sánh Laptop
            </h1>
            <p className="text-gray-600 mt-1">{compareList.length}/3 máy đang được so sánh</p>
          </div>
          {compareList.length > 0 && (
            <button onClick={handleClear} className="btn btn-outline text-red-600 border-red-200 hover:bg-red-50 text-sm">
              Xóa tất cả
            </button>
          )}
        </div>

        {compareList.length < 2 ? (
          <div className="card text-center py-20">
            <Scale className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-3">Chưa đủ để so sánh</h2>
            <p className="text-gray-600 mb-8">Bạn cần chọn ít nhất 2 laptop để so sánh. Hãy thêm laptop từ danh sách hoặc kết quả quiz.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/laptops" className="btn btn-primary flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Thêm từ danh sách laptop
              </Link>
              <Link to="/result" className="btn btn-outline">Xem kết quả Quiz</Link>
            </div>
          </div>
        ) : (
          <CompareTable laptops={compareList} onRemove={handleRemove} />
        )}
      </div>
    </div>
  );
};

export default ComparePage;
