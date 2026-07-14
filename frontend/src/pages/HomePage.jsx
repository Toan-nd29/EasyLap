import { Link } from 'react-router-dom';
import { BarChart3, ChevronRight, CircleHelp, Laptop, SearchCheck, SlidersHorizontal, Sparkles, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const steps = [
  {
    icon: CircleHelp,
    title: 'Trả lời quiz',
    description: 'Cung cấp thông tin về ngân sách và mục đích sử dụng chính của bạn.'
  },
  {
    icon: BarChart3,
    title: 'Phân tích',
    description: 'Thuật toán đối chiếu hàng ngàn mẫu máy để tìm ra cấu hình phù hợp.'
  },
  {
    icon: Laptop,
    title: 'Nhận gợi ý',
    description: 'Xem danh sách laptop tốt nhất, kèm tỷ lệ phù hợp với nhu cầu.'
  }
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const startPath = isAuthenticated ? '/quiz' : '/login';

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative">
        <div className="pointer-events-none absolute right-0 top-0 h-[430px] w-[48%] bg-gradient-to-bl from-primary-50 via-primary-50/60 to-transparent" />
        <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-6 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.92fr_1.08fr] xl:px-12 xl:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-primary-700">
              <Sparkles className="h-3.5 w-3.5" /> Chọn laptop dễ hơn
            </span>
            <h1 className="mt-6 text-[2.65rem] font-black leading-[1.07] tracking-[-0.045em] text-[#0c110e] sm:text-5xl lg:text-[3.75rem]">
              Không rành laptop vẫn chọn được máy phù hợp
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#56635b] sm:text-lg">
              Khám phá chiếc laptop lý tưởng dành riêng cho bạn thông qua bài kiểm tra nhu cầu đơn giản. Không cần hiểu thông số kỹ thuật phức tạp.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={startPath} className="btn btn-primary px-7">
                Bắt đầu chọn laptop <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              {isAuthenticated && (
                <Link to="/laptops" className="btn btn-outline px-7">Xem tất cả laptop</Link>
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[650px] py-10 lg:py-14">
            <div className="absolute inset-[2%_2%_0_8%] -rotate-[8deg] bg-[#d8f8e7] [clip-path:polygon(9%_0,100%_24%,91%_100%,0_75%)]" />
            <div className="relative mx-auto w-[82%] rounded-[28px] border border-[#dce6e0] bg-white p-3 shadow-[0_24px_70px_rgba(20,50,34,0.18)] sm:p-4">
              <div className="overflow-hidden rounded-[20px] bg-[#eff4f1] p-5 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary-500" /><span className="text-xs font-extrabold text-[#293b31]">EasyLap</span></div>
                  <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-[#cad5ce]" /><span className="h-2 w-2 rounded-full bg-[#cad5ce]" /><span className="h-2 w-2 rounded-full bg-[#cad5ce]" /></div>
                </div>
                <div className="mt-5 grid grid-cols-[0.8fr_1.2fr] gap-4 sm:gap-6">
                  <div>
                    <div className="h-3 w-2/3 rounded-full bg-[#cfd9d3]" />
                    <div className="mt-3 h-6 w-full rounded-md bg-[#1d2b23]" />
                    <div className="mt-2 h-2 w-5/6 rounded-full bg-[#cfd9d3]" />
                    <div className="mt-1.5 h-2 w-2/3 rounded-full bg-[#dce4df]" />
                    <div className="mt-5 inline-flex rounded-full bg-primary-500 px-4 py-2 text-[9px] font-bold text-white">Bắt đầu quiz</div>
                  </div>
                  <div className="rounded-xl border border-[#e1e8e4] bg-white p-3 shadow-sm">
                    <div className="flex h-24 items-end justify-center gap-2 sm:h-32">
                      {[38, 58, 46, 82, 66, 92].map((height, index) => <span key={height} className={`w-3 rounded-t-sm ${index === 5 ? 'bg-primary-500' : 'bg-primary-100'}`} style={{ height: `${height}%` }} />)}
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#edf1ef]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 pb-20 sm:px-8 xl:px-12">
        <div className="relative overflow-hidden rounded-[30px] bg-[#f0f4f0] px-6 py-12 sm:px-10 lg:px-16">
          <span className="absolute left-0 top-0 h-16 w-16 bg-[#dcece2]" />
          <span className="absolute bottom-0 right-0 h-20 w-24 bg-[#d4f2f3]" />
          <h2 className="relative text-center text-2xl font-black tracking-[-0.03em] text-[#101713]">Mua laptop thường gặp khó khăn gì?</h2>
          <div className="relative mx-auto mt-9 grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="rounded-[24px] border border-[#e4e9e6] bg-white p-8 text-center shadow-sm">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe1df] text-[#d84e43]"><SlidersHorizontal className="h-5 w-5" /></span>
              <h3 className="mt-5 text-lg font-extrabold text-[#121814]">Rối rắm thông số</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#66736b]">Hàng tá chỉ số CPU, RAM, GPU khó hiểu khiến bạn không biết nên bắt đầu từ đâu.</p>
            </div>
            <div className="rounded-[24px] border border-[#e4e9e6] bg-white p-8 text-center shadow-sm">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0ca] text-[#c98205]"><Target className="h-5 w-5" /></span>
              <h3 className="mt-5 text-lg font-extrabold text-[#121814]">Mua sai nhu cầu</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#66736b]">Lãng phí tiền cho những tính năng không dùng tới hoặc máy quá yếu để làm việc.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#eff3f0] bg-[#fbfdfc] py-20 sm:py-24">
        <div className="mx-auto max-w-[1440px] px-6 text-center sm:px-8 xl:px-12">
          <span className="text-xs font-extrabold uppercase tracking-[0.15em] text-primary-600">Quy trình đơn giản</span>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] text-[#101713]">Giải pháp từ EasyLap</h2>
          <p className="mt-3 text-sm text-[#66736b]">Chỉ với 3 bước đơn giản, hệ thống sẽ phân tích và đưa ra lựa chọn tối ưu nhất cho bạn.</p>

          <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-7">
            <div className="absolute left-[16.5%] right-[16.5%] top-7 hidden h-px bg-primary-200 md:block" />
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative">
                  <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary-200 bg-white text-primary-500">
                    <Icon className="h-5 w-5" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary-500 text-[11px] font-black text-white">{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-[#101713]">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#66736b]">{step.description}</p>
                </div>
              );
            })}
          </div>

          <Link to={startPath} className="btn btn-primary mt-14 px-8">
            <SearchCheck className="mr-2 h-4 w-4" /> Tìm laptop phù hợp ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
