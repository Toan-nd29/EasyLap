const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.get('/questions/common', quizController.getQuestions);
router.get('/questions/:group', quizController.getQuestionsByGroup);

module.exports = router;
