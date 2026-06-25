import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ChevronRight, HelpCircle, Target, Zap } from 'lucide-react';
import Button from '../components/Button';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-50 py-16 sm:py-24 lg:py-32">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
            <span className="block">Không rành laptop</span>
            <span className="block text-primary-600">Vẫn chọn được máy phù hợp</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            Trả lời vài câu hỏi đơn giản, EasyLap sẽ gợi ý cấu hình và mẫu laptop phù hợp với nhu cầu, ngân sách và thói quen sử dụng của bạn.
          </p>
          <div className="flex justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/quiz" className="btn btn-primary text-lg px-8 py-3">
                Bắt đầu chọn laptop <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="btn btn-primary text-lg px-8 py-3">
                Đăng nhập để bắt đầu
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Vấn đề người dùng gặp phải */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mua laptop lần đầu? Thật đau đầu!</h2>
            <p className="text-lg text-gray-600">Đừng lo, bạn không đơn độc. Đa số mọi người đều gặp phải các vấn đề sau:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Rối rắm thông số kỹ thuật</h3>
              <p className="text-gray-600">Không hiểu CPU, RAM, SSD, GPU khác nhau chỗ nào và mình cần bao nhiêu là đủ.</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mua sai nhu cầu</h3>
              <p className="text-gray-600">Dễ mua phải máy quá yếu không dùng được việc, hoặc máy quá mạnh dẫn đến lãng phí tiền bạc.</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quá nhiều lựa chọn</h3>
              <p className="text-gray-600">Hàng trăm mẫu mã từ Dell, Asus, HP, Lenovo, Apple... khiến bạn không biết nên mua hãng nào.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cách hoạt động */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cách EasyLap giúp bạn</h2>
            <p className="text-lg text-gray-600">Giải quyết bài toán khó chỉ trong 3 bước đơn giản</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-1 bg-gray-200 -z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-white">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trả lời câu hỏi (Quiz)</h3>
              <p className="text-gray-600 text-center">Thực hiện bài trắc nghiệm ngắn về nhóm ngành nghề, ngân sách và nhu cầu sử dụng của bạn.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-white">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hệ thống phân tích</h3>
              <p className="text-gray-600 text-center">Thuật toán EasyLap sẽ dịch các nhu cầu của bạn thành thông số cấu hình kỹ thuật cụ thể.</p>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg border-4 border-white">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Nhận gợi ý chính xác</h3>
              <p className="text-gray-600 text-center">Gợi ý top 3-5 mẫu laptop phù hợp nhất, kèm theo lý do chọn và những điểm bạn cần đánh đổi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lợi ích */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-600 rounded-3xl p-8 sm:p-16 text-white text-center">
            <h2 className="text-3xl font-bold mb-10">Lợi ích khi sử dụng EasyLap</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 mr-3 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Tiết kiệm thời gian</h4>
                  <p className="text-primary-100 text-sm">Không cần tốn hàng giờ đọc review và so sánh.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 mr-3 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Chọn đúng nhu cầu</h4>
                  <p className="text-primary-100 text-sm">Đảm bảo máy đáp ứng vừa đủ hoặc dư sức cho công việc của bạn.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 mr-3 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Hiểu rõ lý do chọn</h4>
                  <p className="text-primary-100 text-sm">Giải thích bằng ngôn ngữ dễ hiểu tại sao máy này hợp với bạn.</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle2 className="w-6 h-6 mr-3 text-primary-200 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-1">Tránh cạm bẫy quảng cáo</h4>
                  <p className="text-primary-100 text-sm">Cảnh báo rõ các điểm yếu/đánh đổi của từng máy.</p>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <Link to={isAuthenticated ? "/quiz" : "/login"} className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-3">
                Khám phá ngay
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
