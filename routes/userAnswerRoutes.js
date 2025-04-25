const express = require('express');
const router = express.Router();
const userAnswerController = require('../controllers/userAnswerController');

/**
 * @swagger
 * /api/user-answers/quiz-attempt/{quiz_attempt_id}:
 *   get:
 *     summary: Lấy danh sách UserAnswer theo quiz_attempt_id
 *     tags: [UserAnswer]
 *     parameters:
 *       - in: path
 *         name: quiz_attempt_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quiz_attempt
 *     responses:
 *       200:
 *         description: Lấy danh sách UserAnswer thành công.
 *       404:
 *         description: Không tìm thấy UserAnswer nào.
 *       500:
 *         description: Lỗi server.
 */
router.get(
  '/quiz-attempt/:quiz_attempt_id',
  userAnswerController.getUserAnswersByQuizAttemptId
);

module.exports = router;
