const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Lấy danh sách các câu hỏi
 *     tags: [Question]
 *     responses:
 *       200:
 *         description: Lấy danh sách câu hỏi thành công.
 *       500:
 *         description: Lỗi server.
 */
router.get('/', questionController.getAllQuestions);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Lấy câu hỏi theo ID
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của câu hỏi
 *     responses:
 *       200:
 *         description: Lấy câu hỏi thành công.
 *       404:
 *         description: Không tìm thấy câu hỏi.
 *       500:
 *         description: Lỗi server.
 */
router.get('/:id', questionController.getQuestionById);

/**
 * @swagger
 * /api/questions/quiz/{quiz_id}:
 *   get:
 *     summary: Lấy danh sách các câu hỏi theo quiz_id
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: quiz_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quiz
 *     responses:
 *       200:
 *         description: Lấy danh sách câu hỏi thành công.
 *       404:
 *         description: Không tìm thấy câu hỏi nào.
 *       500:
 *         description: Lỗi server.
 */
router.get('/quiz/:quiz_id', questionController.getQuestionsByQuizId);


module.exports = router;