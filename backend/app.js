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
app.set('trust proxy', 1);

const allowedOrigins = `${env.CLIENT_URL},${env.CORS_ORIGINS}`
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedVercelHosts = new Set([
  'easylap.vercel.app'
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const { protocol, hostname } = new URL(origin);
    const isLocalhost = protocol === 'http:' && ['localhost', '127.0.0.1'].includes(hostname);
    const normalizedHostname = hostname.toLowerCase();
    const isEasyLapVercel = protocol === 'https:' && (
      allowedVercelHosts.has(normalizedHostname) ||
      /^easy-lap-[a-z0-9-]+\.vercel\.app$/i.test(normalizedHostname)
    );

    return isLocalhost || isEasyLapVercel;
  } catch (error) {
    return false;
  }
};

app.use(helmet());
const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'EasyLap API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommend', recommendationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
