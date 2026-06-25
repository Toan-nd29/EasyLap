function generateMatchReasons(laptop, answers, finalScore) {
  const reasons = [];
  
  if (laptop.ram >= 16) {
    reasons.push(`RAM ${laptop.ram}GB phù hợp để mở nhiều phần mềm / tab trình duyệt cùng lúc.`);
  }
  
  if (laptop.ssd >= 512) {
    reasons.push(`SSD ${laptop.ssd}GB cho phép lưu trữ thoải mái tài liệu và phần mềm.`);
  }

  if (answers.commonAnswers?.budget) {
    reasons.push(`Giá máy phù hợp với khoảng ngân sách bạn chọn.`);
  }

  if (laptop.weight <= 1.5) {
    reasons.push(`Máy có trọng lượng nhẹ (${laptop.weight}kg), dễ dàng mang đi học hoặc đi làm hằng ngày.`);
  }

  if (laptop.gpu_type === 'dedicated') {
    reasons.push(`Card đồ họa rời (${laptop.gpu}) giúp xử lý tốt đồ họa và chơi game.`);
  }

  if (laptop.upgradeable) {
    reasons.push(`Máy có khả năng nâng cấp RAM/SSD để dùng lâu dài về sau.`);
  }

  // Fallback if empty
  if (reasons.length === 0) {
    reasons.push("Cấu hình máy tương đối cân bằng với nhu cầu của bạn.");
  }

  return reasons.slice(0, 4); // Max 4 reasons
}

function generateTradeOffs(laptop, answers) {
  const tradeoffs = [];

  if (laptop.gpu_type !== 'dedicated' && answers.specificAnswers?.extraNeeds?.includes('heavy_gaming')) {
    tradeoffs.push(`Không phù hợp nếu bạn muốn chơi game nặng vì máy không có card đồ họa rời.`);
  }

  if (laptop.weight > 2.0) {
    tradeoffs.push(`Máy khá nặng (${laptop.weight}kg), không tối ưu nếu bạn phải mang di chuyển liên tục.`);
  }

  if (laptop.screen_score < 8 && answers.commonAnswers?.userGroup === 'design_student') {
    tradeoffs.push(`Màn hình chưa đạt mức hiển thị màu chuẩn xác nhất cho đồ họa chuyên nghiệp.`);
  }

  if (laptop.battery_score < 6) {
    tradeoffs.push(`Pin máy không được lâu, bạn sẽ cần mang theo cục sạc thường xuyên.`);
  }

  if (!laptop.upgradeable) {
    tradeoffs.push(`Máy hàn chết RAM/SSD, bạn không thể nâng cấp thêm cấu hình sau này.`);
  }

  return tradeoffs;
}

module.exports = {
  generateMatchReasons,
  generateTradeOffs
};
