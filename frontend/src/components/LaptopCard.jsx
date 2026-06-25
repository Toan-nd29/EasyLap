import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Scale, Cpu, HardDrive, Monitor } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

const LaptopCard = ({ laptop, isFavorite, onToggleFavorite, onCompare }) => {
  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden p-0 group">
      <div className="relative aspect-[4/3] bg-gray-100 p-4 flex items-center justify-center">
        {laptop.image_url ? (
          <img src={laptop.image_url} alt={laptop.name} className="w-full h-full object-contain mix-blend-multiply" />
        ) : (
          <div className="text-gray-400 font-medium">Chưa có ảnh</div>
        )}
        <button 
          onClick={(e) => {
            e.preventDefault();
            if (onToggleFavorite) onToggleFavorite(laptop);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm transition-colors ${isFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-medium text-primary-600 uppercase tracking-wider mb-1">
          {laptop.brand}
        </div>
        <Link to={`/laptops/${laptop.id}`} className="text-lg font-bold text-gray-900 mb-2 hover:text-primary-600 line-clamp-2">
          {laptop.name}
        </Link>
        <div className="text-xl font-bold text-gray-900 mb-4">
          {formatCurrency(laptop.price)}
        </div>
        
        <div className="space-y-2 mb-6 mt-auto">
          <div className="flex items-center text-sm text-gray-600">
            <Cpu className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{laptop.cpu}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <HardDrive className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{laptop.ram}GB RAM • {laptop.ssd}GB SSD</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Monitor className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{laptop.screen}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link to={`/laptops/${laptop.id}`} className="btn btn-primary text-sm py-2 px-3">
            Chi tiết
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onCompare) onCompare(laptop);
            }}
            className="btn btn-outline text-sm py-2 px-3 flex items-center justify-center gap-1"
          >
            <Scale className="w-4 h-4" /> So sánh
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaptopCard;
