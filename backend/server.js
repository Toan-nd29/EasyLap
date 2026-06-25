const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const laptopRoutes = require('./routes/laptopRoutes');
const quizRoutes = require('./routes/quizRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const errorHandler = require('./middlewares/errorMiddleware');
const notFoundHandler = require('./middlewares/notFoundMiddleware');
const { apiLimiter } = require('./middlewares/rateLimitMiddleware');

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));

// Parsers & Logger
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// API Routes
app.use('/api', apiLimiter); // Apply rate limiter to all API routes

app.use('/api/auth', authRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode.`);
});
