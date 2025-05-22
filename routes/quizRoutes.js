const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Lấy danh sách các Quiz
 *     tags: [Quiz]
 *     responses:
 *       200:
 *         description: Lấy danh sách Quiz thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/', quizController.getAllQuizzes);
router.get('/:quiz_id', quizController.getQuizById);

module.exports = router;