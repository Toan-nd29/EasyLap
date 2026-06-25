const { sendError } = require('../utils/response');

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params
    });
    return next();
  } catch (error) {
    if (error.name === 'ZodError') {
      const formattedErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return sendError(res, 'Dữ liệu không hợp lệ', 400, formattedErrors);
    }
    return sendError(res, 'Đã có lỗi xảy ra trong quá trình kiểm tra dữ liệu', 500);
  }
};

module.exports = validate;
