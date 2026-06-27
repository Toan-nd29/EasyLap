import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, CheckCircle2, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import LaptopImage from './LaptopImage';

const ResultCard = ({ result, isFavorite, onToggleFavorite, onCompare }) => {
  const { laptop, finalScore, matchReasons, tradeOffs } = result;

  return (
    <div className="card flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Score Badge */}
      <div className="absolute top-0 right-0 bg-primary-600 text-white font-bold px-4 py-2 rounded-bl-xl z-10 shadow-sm flex flex-col items-center">
        <span className="text-2xl leading-none">{finalScore}</span>
        <span className="text-[10px] uppercase tracking-wider opacity-90">Điểm</span>
      </div>

      <div className="w-full md:w-1/3 flex-shrink-0 bg-gray-50 rounded-lg p-4 flex flex-col justify-center items-center relative">
        <LaptopImage laptop={laptop} className="w-full h-48 object-contain mix-blend-multiply" fallbackClassName="w-full h-48" />
        
        <div className="mt-4 text-center w-full">
          <div className="text-sm font-medium text-primary-600 uppercase tracking-wider mb-1">
            {laptop.brand}
          </div>
          <Link to={`/laptops/${laptop.id}`} className="text-xl font-bold text-gray-900 mb-2 hover:text-primary-600 block truncate">
            {laptop.name}
          </Link>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(laptop.price)}
          </div>
        </div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col">
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-gray-500 block text-xs uppercase tracking-wide">CPU</span>
            <span className="font-medium text-gray-900">{laptop.cpu}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-gray-500 block text-xs uppercase tracking-wide">RAM / SSD</span>
            <span className="font-medium text-gray-900">{laptop.ram}GB / {laptop.ssd}GB</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-gray-500 block text-xs uppercase tracking-wide">Card đồ họa</span>
            <span className="font-medium text-gray-900">{laptop.gpu}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-gray-500 block text-xs uppercase tracking-wide">Màn hình</span>
            <span className="font-medium text-gray-900">{laptop.screen}</span>
          </div>
        </div>

        <div className="flex-grow space-y-4">
          {matchReasons && matchReasons.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-1.5" />
                Lý do phù hợp
              </h4>
              <ul className="space-y-1">
                {matchReasons.map((reason, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tradeOffs && tradeOffs.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 text-amber-500 mr-1.5" />
                Điểm đánh đổi
              </h4>
              <ul className="space-y-1">
                {tradeOffs.map((tradeoff, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-amber-500 mr-2">•</span>
                    {tradeoff}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-100">
          <Link to={`/laptops/${laptop.id}`} className="btn btn-primary text-sm flex-1 sm:flex-none">
            Xem chi tiết
          </Link>
          <button 
            onClick={() => onToggleFavorite(laptop)}
            className={`btn border text-sm flex-1 sm:flex-none flex items-center justify-center gap-1 ${
              isFavorite 
                ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' 
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} /> 
            {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
          </button>
          <button 
            onClick={() => onCompare(laptop)}
            className="btn btn-outline text-sm flex-1 sm:flex-none flex items-center justify-center gap-1"
          >
            <Scale className="w-4 h-4" /> So sánh
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
