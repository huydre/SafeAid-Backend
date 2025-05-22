const express = require('express');
const router = express.Router();
const quizAttemptsController = require('../controllers/quizAttemptsController');
const authMiddleware = require('../middlewares/auth');

/**
 * @swagger
 * /api/quiz-attempts:
 *   post:
 *     summary: Lưu thông tin QuizAttempt
 *     tags: [QuizAttempts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *               - max_score
 *               - duration
 *               - quiz_id
 *               - user_id
 *             properties:
 *               score:
 *                 type: integer
 *               max_score:
 *                 type: integer
 *               duration:
 *                 type: integer
 *               quiz_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lưu QuizAttempt thành công.
 *       500:
 *         description: Lỗi server.
 */
router.post('/', authMiddleware, quizAttemptsController.saveQuizAttempt);

/**
 * @swagger
 * /api/quiz-attempts/user/{user_id}:
 *   get:
 *     summary: Lấy danh sách QuizAttempts theo user_id
 *     tags: [QuizAttempts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy danh sách QuizAttempts thành công.
 *       404:
 *         description: Không tìm thấy QuizAttempts nào.
 *       500:
 *         description: Lỗi server.
 */
router.get('/user', authMiddleware, quizAttemptsController.getQuizAttemptsByUserId);


/**
 * @swagger
 * /api/quiz-attempts/{user_id}/{quiz_id}:
 *   get:
 *     summary: Lấy danh sách QuizAttempts theo user_id và quiz_id
 *     tags: [QuizAttempts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *       - in: path
 *         name: quiz_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quiz
 *     responses:
 *       200:
 *         description: Lấy danh sách QuizAttempts thành công.
 *       404:
 *         description: Không tìm thấy QuizAttempts nào.
 *       500:
 *         description: Lỗi server.
 */
router.get('/:quiz_id', authMiddleware, quizAttemptsController.getQuizAttemptsByUserIdAndQuizId);

/**
 * @swagger
 * /api/quiz-attempts/{quiz_attempt_id}/{quiz_id}/details:
 *   get:
 *     summary: Lấy danh sách UserAnswer theo quiz_attempt_id và Question theo quiz_id
 *     tags: [QuizAttempts]
 *     parameters:
 *       - in: path
 *         name: quiz_attempt_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quiz_attempt
 *       - in: path
 *         name: quiz_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quiz
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/:quiz_attempt_id/:quiz_id/details', quizAttemptsController.getHistoryQuizDetail);

module.exports = router;
module.exports = router;