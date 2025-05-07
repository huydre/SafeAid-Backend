const express = require('express');
const router = express.Router();
const quizCategoryController = require('../controllers/quizCategoryController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * /api/quiz-categories:
 *   get:
 *     summary: Lấy danh sách các QuizCategory
 *     tags: [QuizCategory]
 *     responses:
 *       200:
 *         description: Lấy danh sách QuizCategory thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/', quizCategoryController.getAllQuizCategories);

/**
 * @swagger
 * /api/quiz-categories-with-quizzes:
 *   get:
 *     summary: Lấy danh sách QuizCategory kèm theo các Quiz
 *     tags: [QuizCategory]
 *     responses:
 *       200:
 *         description: Lấy danh sách QuizCategory thành công.
 *       500:
 *         description: Lỗi server.
 */

router.get(
  '/with-quizzes',
  quizCategoryController.getQuizCategoriesWithQuizzes
);

module.exports = router;
