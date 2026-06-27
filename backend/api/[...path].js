const app = require('../app');

module.exports = (req, res) => {
  if (req.url && !req.url.startsWith('/api')) {
    const separator = req.url.startsWith('/') ? '' : '/';
    req.url = `/api${separator}${req.url}`;
  }

  return app(req, res);
};
