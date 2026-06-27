import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import LaptopImage from './LaptopImage';

const CompareTable = ({ laptops, onRemove }) => {
  if (!laptops || laptops.length === 0) return null;

  const renderRow = (label, key, formatter) => (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-4 font-medium text-gray-700 bg-gray-50/50 sticky left-0 border-r border-gray-200 z-10 w-32 md:w-48 whitespace-nowrap">
        {label}
      </td>
      {laptops.map(laptop => (
        <td key={laptop.id} className="py-4 px-6 min-w-[200px] md:min-w-[280px]">
          {formatter ? formatter(laptop[key]) : laptop[key]}
        </td>
      ))}
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-6 px-4 bg-gray-50/50 sticky left-0 border-r border-gray-200 z-10">
                {/* Empty corner */}
              </th>
              {laptops.map(laptop => (
                <th key={laptop.id} className="py-6 px-6 align-top">
                  <div className="flex flex-col relative">
                    <button 
                      onClick={() => onRemove(laptop.id)}
                      className="absolute -top-2 -right-2 p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-600 rounded-full text-gray-500 transition-colors"
                      title="Xóa khỏi so sánh"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-lg p-2 flex items-center justify-center">
                      <LaptopImage laptop={laptop} fallbackClassName="w-full h-full" iconClassName="w-5 h-5" />
                    </div>
                    
                    <div className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-1">
                      {laptop.brand}
                    </div>
                    <Link to={`/laptops/${laptop.id}`} className="text-base font-bold text-gray-900 mb-2 hover:text-primary-600 line-clamp-2">
                      {laptop.name}
                    </Link>
                    <div className="text-lg font-bold text-gray-900 mb-4">
                      {formatCurrency(laptop.price)}
                    </div>
                    
                    <Link to={`/laptops/${laptop.id}`} className="btn btn-outline text-sm w-full py-2">
                      Chi tiết
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {renderRow('CPU', 'cpu')}
            {renderRow('RAM', 'ram', (val) => `${val} GB`)}
            {renderRow('Ổ cứng (SSD)', 'ssd', (val) => `${val} GB`)}
            {renderRow('Card đồ họa', 'gpu')}
            {renderRow('Màn hình', 'screen')}
            {renderRow('Khối lượng', 'weight', (val) => `${val} kg`)}
            {renderRow('Bảo hành', 'warranty')}
            {renderRow('Khả năng nâng cấp', 'upgradeable', (val) => val ? 'Có' : 'Không')}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompareTable;
