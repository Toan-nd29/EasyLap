const { supabase, supabaseAdmin } = require('../config/supabaseClient');
const { sendError } = require('../utils/response');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Bạn cần đăng nhập để sử dụng chức năng này.', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token using supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return sendError(res, 'Token không hợp lệ hoặc đã hết hạn.', 401);
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return sendError(res, 'Không tìm thấy thông tin người dùng.', 401);
    }

    // Attach user to req
    req.user = profile;
    req.accessToken = token;
    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return sendError(res, 'Lỗi xác thực người dùng.', 500);
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return sendError(res, 'Bạn không có quyền thực hiện chức năng này.', 403);
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin
};
