// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/change-password',authMiddleware, authController.changePassword);
router.post('/reset-password', authController.resetPassword);
router.get('/reset-password-confirm/:token', authController.confirmResetPassword);

module.exports = router;
