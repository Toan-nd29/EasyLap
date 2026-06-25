const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validate = require('../middlewares/validateMiddleware');
const { updateProfileSchema, favoriteSchema } = require('../schemas/userSchema');
const { requireAuth } = require('../middlewares/authMiddleware');

router.use(requireAuth);

router.get('/me', userController.getMe);
router.put('/me', validate(updateProfileSchema), userController.updateMe);
router.get('/me/history', userController.getHistory);

router.get('/me/favorites', userController.getFavorites);
router.post('/me/favorites', validate(favoriteSchema), userController.addFavorite);
router.delete('/me/favorites/:laptopId', userController.removeFavorite);

module.exports = router;
