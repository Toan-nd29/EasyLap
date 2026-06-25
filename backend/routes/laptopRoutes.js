const express = require('express');
const router = express.Router();
const laptopController = require('../controllers/laptopController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.use(requireAuth); // All laptop routes require auth

router.get('/', laptopController.getAll);
router.get('/filters/options', laptopController.getFilterOptions);
router.get('/:id', laptopController.getById);

module.exports = router;
