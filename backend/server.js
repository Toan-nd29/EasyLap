const app = require('./app');
const env = require('./config/env');

// Start server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode.`);
});
