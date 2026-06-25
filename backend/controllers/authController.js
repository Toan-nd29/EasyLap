const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, fullName } = req.body;
      const user = await authService.register(email, password, fullName);
      
      return sendSuccess(res, {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata.full_name
        }
      }, 'Đăng ký thành công', 201);
    } catch (error) {
      if (error.message.includes('already registered')) {
        return sendError(res, 'Email đã được sử dụng', 400);
      }
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      return sendSuccess(res, {
        session: {
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token
        },
        user: {
          id: result.user.id,
          email: result.user.email,
          fullName: result.user.full_name,
          role: result.user.role
        }
      }, 'Đăng nhập thành công');
    } catch (error) {
      // Return generic message for invalid credentials
      return sendError(res, 'Email hoặc mật khẩu không đúng', 400);
    }
  }

  async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader.split(' ')[1];
        await authService.logout(token);
      }
      return sendSuccess(res, null, 'Đăng xuất thành công');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      return sendSuccess(res, { user: req.user }, 'Thành công');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
