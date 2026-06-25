const userService = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/response');

class UserController {
  async getMe(req, res, next) {
    try {
      return sendSuccess(res, { user: req.user }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req, res, next) {
    try {
      const userId = req.user.id;
      const updatedProfile = await userService.updateProfile(userId, req.body);
      return sendSuccess(res, { user: updatedProfile }, 'Cập nhật thành công');
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const history = await userService.getHistory(userId);
      return sendSuccess(res, { history }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }

  async getFavorites(req, res, next) {
    try {
      const userId = req.user.id;
      const favorites = await userService.getFavorites(userId);
      return sendSuccess(res, { favorites }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }

  async addFavorite(req, res, next) {
    try {
      const userId = req.user.id;
      const { laptop_id } = req.body;
      const favorite = await userService.addFavorite(userId, laptop_id);
      return sendSuccess(res, { favorite }, 'Đã thêm vào danh sách yêu thích', 201);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        return sendError(res, 'Laptop này đã có trong danh sách yêu thích', 400);
      }
      next(error);
    }
  }

  async removeFavorite(req, res, next) {
    try {
      const userId = req.user.id;
      const { laptopId } = req.params;
      await userService.removeFavorite(userId, laptopId);
      return sendSuccess(res, null, 'Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
