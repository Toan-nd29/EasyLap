import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';

const Footer = () => (
  <footer className="mt-auto border-t border-[#e1e7e3] bg-[#edf0ed]">
    <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-12 sm:px-8 md:grid-cols-[1.35fr_1fr_1fr] xl:px-12">
      <div>
        <BrandLogo compact />
        <p className="mt-4 max-w-sm text-sm leading-6 text-[#66736b]">Công cụ tư vấn laptop dễ hiểu, giúp bạn chọn đúng máy theo nhu cầu và ngân sách.</p>
        <p className="mt-5 text-xs text-[#7b877f]">© {new Date().getFullYear()} EasyLap. Tất cả quyền được bảo lưu.</p>
      </div>
      <div>
        <h3 className="text-sm font-extrabold text-[#26372d]">Liên kết</h3>
        <div className="mt-4 grid gap-3 text-sm text-[#66736b]"><Link to="/" className="hover:text-primary-700">Trang chủ</Link><Link to="/laptops" className="hover:text-primary-700">Danh sách laptop</Link><Link to="/quiz" className="hover:text-primary-700">Quiz tư vấn</Link></div>
      </div>
      <div>
        <h3 className="text-sm font-extrabold text-[#26372d]">Điều khoản</h3>
        <div className="mt-4 grid gap-3 text-sm text-[#66736b]"><span>Chính sách bảo mật</span><span>Điều khoản sử dụng</span><Link to="/profile" className="hover:text-primary-700">Hỗ trợ tài khoản</Link></div>
      </div>
    </div>
  </footer>
);

export default Footer;
