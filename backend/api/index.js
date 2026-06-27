const app = require('../app');

module.exports = (req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const routePath = parsedUrl.searchParams.get('path');

  if (routePath !== null) {
    parsedUrl.searchParams.delete('path');

    const normalizedPath = routePath.replace(/^\/+/, '') || 'health';
    const queryString = parsedUrl.searchParams.toString();

    req.url = `/api/${normalizedPath}${queryString ? `?${queryString}` : ''}`;
  } else if (req.url === '/' || req.url === '/api' || req.url === '/api/') {
    req.url = '/api/health';
  } else if (!req.url.startsWith('/api')) {
    const separator = req.url.startsWith('/') ? '' : '/';
    req.url = `/api${separator}${req.url}`;
  }

  return app(req, res);
};
