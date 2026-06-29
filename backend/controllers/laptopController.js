const laptopService = require('../services/laptopService');
const { sendSuccess, sendError } = require('../utils/response');

class LaptopController {
  async getAll(req, res, next) {
    try {
      const result = await laptopService.getAll(req.query);
      return sendSuccess(res, result, 'Thành công');
    } catch (error) {
      next(error);
    }
  }

  async getFilterOptions(req, res, next) {
    try {
      const options = await laptopService.getFilterOptions();
      return sendSuccess(res, options, 'Thành công');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const laptop = await laptopService.getById(id);
      if (!laptop) {
        return sendError(res, 'Không tìm thấy laptop', 404);
      }
      return sendSuccess(res, { laptop }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LaptopController();
