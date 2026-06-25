const recommendationService = require('../services/recommendationService');
const { sendSuccess, sendError } = require('../utils/response');
const z = require('zod');

const recommendSchema = z.object({
  commonAnswers: z.object({
    userGroup: z.string().min(1, "Bắt buộc chọn nhóm người dùng"),
    budget: z.string().min(1, "Bắt buộc chọn ngân sách"),
    mobility: z.string().optional(),
    usageYears: z.string().optional(),
    priorities: z.array(z.string()).optional()
  }).passthrough(),
  specificAnswers: z.record(z.any()).optional()
});

class RecommendationController {
  async recommend(req, res, next) {
    try {
      const userId = req.user.id;
      
      const parseResult = recommendSchema.safeParse(req.body);
      if (!parseResult.success) {
        return sendError(res, 'Dữ liệu đầu vào không hợp lệ', 400, parseResult.error.errors);
      }
      
      const data = parseResult.data;
      
      const result = await recommendationService.processRecommendation(userId, data);
      
      return sendSuccess(res, result, 'Gợi ý thành công');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecommendationController();
