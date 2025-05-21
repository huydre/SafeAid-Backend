// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký người dùng
 *     description: Tạo một người dùng mới trong hệ thống.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công.
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email đã tồn tại.
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     description: Đăng nhập bằng email và password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công và trả về JWT token.
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ.
 */
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;
