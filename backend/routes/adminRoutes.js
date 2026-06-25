const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const validate = require('../middlewares/validateMiddleware');
const { laptopSchema } = require('../schemas/laptopSchema');
const { quizSchema } = require('../schemas/quizSchema');
const { requireAuth, requireAdmin } = require('../middlewares/authMiddleware');

router.use(requireAuth);
router.use(requireAdmin);

// Laptop management
router.post('/laptops', validate(laptopSchema), adminController.createLaptop);
router.put('/laptops/:id', validate(laptopSchema), adminController.updateLaptop);
router.delete('/laptops/:id', adminController.deleteLaptop);

// Quiz management
router.post('/quiz/questions', validate(quizSchema), adminController.createQuizQuestion);
router.put('/quiz/questions/:id', validate(quizSchema), adminController.updateQuizQuestion);
router.delete('/quiz/questions/:id', adminController.deleteQuizQuestion);

module.exports = router;
