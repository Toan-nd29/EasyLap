const { sendError } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
  return sendError(res, 'Không tìm thấy API yêu cầu.', 404);
};

module.exports = notFoundHandler;
