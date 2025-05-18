const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');

/**
 * @swagger
 * /api/answers:
 *   get:
 *     summary: Lấy danh sách các câu trả lời
 *     tags: [Answer]
 *     responses:
 *       200:
 *         description: Lấy danh sách câu trả lời thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/', answerController.getAllAnswers);

/**
 * @swagger
 * /api/answers/question/{question_id}:
 *   get:
 *     summary: Lấy danh sách câu trả lời theo ID câu hỏi
 *     tags: [Answer]
 *     parameters:
 *       - in: path
 *         name: question_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu hỏi
 *     responses:
 *       200:
 *         description: Lấy danh sách câu trả lời thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/question/:question_id', answerController.getAnswersByQuestionId);

module.exports = router;
