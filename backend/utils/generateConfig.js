function generateRecommendedConfig(userGroup, answers) {
  switch (userGroup) {
    case 'it_student':
      return {
        cpu: "Intel Core i5 / Ryzen 5 trở lên (dòng H hoặc dòng P nếu có thể)",
        ram: "Tối thiểu 16GB",
        ssd: "Tối thiểu 512GB",
        gpu: "Không bắt buộc, trừ khi bạn làm game development, AI hoặc có chơi game nặng",
        note: "Nên ưu tiên laptop có khả năng nâng cấp RAM/SSD để dùng lâu dài trong 4 năm học."
      };
    case 'finance_student':
      return {
        cpu: "Intel Core i3/i5 hoặc Ryzen 3/5 dòng U/P tiết kiệm điện",
        ram: "8GB dùng được, 16GB sẽ tốt hơn nếu mở nhiều tab hoặc xử lý file Excel nặng",
        ssd: "256GB tối thiểu, 512GB khuyên dùng",
        gpu: "Không cần card đồ họa rời",
        note: "Nên ưu tiên máy nhẹ, pin tốt và có bàn phím số (nếu màn hình 15.6 inch) để nhập liệu dễ dàng."
      };
    case 'design_student':
      return {
        cpu: "Intel Core i5/i7 dòng H hoặc Ryzen 5/7 dòng H",
        ram: "Tối thiểu 16GB, lý tưởng là 32GB",
        ssd: "512GB trở lên",
        gpu: "Bắt buộc có card đồ họa rời (RTX 3050 trở lên)",
        note: "Đặc biệt lưu ý tới màn hình: Ưu tiên màn hình OLED hoặc IPS có độ phủ màu cao (100% sRGB)."
      };
    case 'office_worker':
      return {
        cpu: "Intel Core i5 / Ryzen 5",
        ram: "8GB - 16GB",
        ssd: "256GB - 512GB",
        gpu: "Không cần card đồ họa rời",
        note: "Ưu tiên thiết kế nhôm nguyên khối, mỏng nhẹ, pin lâu và webcam/mic tốt để họp online."
      };
    case 'gamer':
      return {
        cpu: "Intel Core i5/i7 dòng H/HX hoặc Ryzen 5/7 dòng H/HX",
        ram: "Tối thiểu 16GB",
        ssd: "Tối thiểu 512GB",
        gpu: "RTX 3050/4050 trở lên",
        note: "Chú ý đến hệ thống tản nhiệt và tần số quét màn hình (khuyên dùng 144Hz trở lên)."
      };
    case 'content_creator':
      return {
        cpu: "Intel Core i7/i9 hoặc Ryzen 7/9 dòng H/HX",
        ram: "Tối thiểu 16GB, ưu tiên 32GB",
        ssd: "Tối thiểu 512GB, ưu tiên 1TB",
        gpu: "RTX 3060/4060 trở lên",
        note: "Cần màn hình chuẩn màu (100% sRGB / DCI-P3), cấu hình tản nhiệt tốt để render video dài."
      };
    case 'beginner':
    default:
      return {
        cpu: "Intel Core i3/i5 hoặc Ryzen 3/5",
        ram: "Tối thiểu 8GB",
        ssd: "256GB - 512GB",
        gpu: "Card đồ họa tích hợp",
        note: "Nên chọn các mẫu máy có độ bền cao, phổ thông, dễ bảo hành và cài đặt."
      };
  }
}

function generateSummary(userGroup, answers, config) {
  let groupText = "";
  switch(userGroup) {
    case 'it_student': groupText = "bạn là sinh viên Công nghệ thông tin / Lập trình"; break;
    case 'finance_student': groupText = "bạn học khối ngành Kinh tế / Tài chính"; break;
    case 'design_student': groupText = "bạn học khối ngành Thiết kế / Kiến trúc"; break;
    case 'office_worker': groupText = "bạn là nhân viên văn phòng"; break;
    case 'gamer': groupText = "bạn có nhu cầu chơi game là chính"; break;
    case 'content_creator': groupText = "bạn là người sáng tạo nội dung / làm media"; break;
    case 'beginner': groupText = "bạn có nhu cầu sử dụng cơ bản"; break;
    default: groupText = "bạn đang tìm kiếm một chiếc laptop";
  }

  return `Dựa trên kết quả khảo sát, ${groupText}. Bạn nên ưu tiên các dòng máy có ${config.cpu}, RAM ${config.ram} và bộ nhớ ${config.ssd}. ${config.note}`;
}

module.exports = {
  generateRecommendedConfig,
  generateSummary
};
