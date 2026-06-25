import React from 'react';
import { Laptop, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-6 md:mb-0">
            <div className="flex items-center gap-2">
              <Laptop className="h-6 w-6 text-primary-600" />
              <span className="font-bold text-lg text-gray-900">EasyLap</span>
            </div>
          </div>
          
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-sm text-gray-500 flex items-center justify-center gap-1">
              &copy; {new Date().getFullYear()} EasyLap. Chúc bạn tìm được chiếc laptop ưng ý! 
              <Heart className="w-4 h-4 text-red-500 fill-current" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
