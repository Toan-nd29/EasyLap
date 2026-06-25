const laptopService = require('../services/laptopService');
const quizService = require('../services/quizService');
const { sendSuccess, sendError } = require('../utils/response');

class AdminController {
  // --- Laptops ---
  async createLaptop(req, res, next) {
    try {
      const laptop = await laptopService.create(req.body);
      return sendSuccess(res, { laptop }, 'Tạo laptop thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateLaptop(req, res, next) {
    try {
      const { id } = req.params;
      const laptop = await laptopService.update(id, req.body);
      return sendSuccess(res, { laptop }, 'Cập nhật laptop thành công');
    } catch (error) {
      next(error);
    }
  }

  async deleteLaptop(req, res, next) {
    try {
      const { id } = req.params;
      await laptopService.delete(id);
      return sendSuccess(res, null, 'Xóa laptop thành công');
    } catch (error) {
      next(error);
    }
  }

  // --- Quiz Questions ---
  async createQuizQuestion(req, res, next) {
    try {
      const question = await quizService.createQuestion(req.body);
      return sendSuccess(res, { question }, 'Tạo câu hỏi thành công', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateQuizQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const question = await quizService.updateQuestion(id, req.body);
      return sendSuccess(res, { question }, 'Cập nhật câu hỏi thành công');
    } catch (error) {
      next(error);
    }
  }

  async deleteQuizQuestion(req, res, next) {
    try {
      const { id } = req.params;
      await quizService.deleteQuestion(id);
      return sendSuccess(res, null, 'Xóa câu hỏi thành công');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
