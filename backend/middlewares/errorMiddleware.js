const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('System Error:', err);

  // Return generic error message to client
  return sendError(res, 'Đã có lỗi xảy ra, vui lòng thử lại sau.', 500);
};

module.exports = errorHandler;
