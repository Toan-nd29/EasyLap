const quizService = require('../services/quizService');
const { sendSuccess, sendError } = require('../utils/response');

const VALID_GROUPS = [
  "common",
  "it_student",
  "finance_student",
  "design_student",
  "office_worker",
  "content_creator",
  "gamer",
  "beginner"
];

class QuizController {
  async getQuestions(req, res, next) {
    try {
      const questions = await quizService.getQuestionsByGroup('common');
      return sendSuccess(res, { questions }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }

  async getQuestionsByGroup(req, res, next) {
    try {
      const { group } = req.params;
      if (!VALID_GROUPS.includes(group)) {
        return sendError(res, 'Nhóm người dùng không hợp lệ', 400);
      }
      const questions = await quizService.getQuestionsByGroup(group);
      return sendSuccess(res, { questions }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QuizController();
