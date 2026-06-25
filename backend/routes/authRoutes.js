const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validateMiddleware');
const { registerSchema, loginSchema } = require('../schemas/authSchema');
const { requireAuth } = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getMe);

module.exports = router;
