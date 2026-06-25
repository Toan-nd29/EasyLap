const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const validate = require('../middlewares/validateMiddleware');
const { recommendSchema } = require('../schemas/recommendSchema');
const { requireAuth } = require('../middlewares/authMiddleware');
const { recommendLimiter } = require('../middlewares/rateLimitMiddleware');

router.post('/', requireAuth, recommendLimiter, validate(recommendSchema), recommendationController.recommend);

module.exports = router;
