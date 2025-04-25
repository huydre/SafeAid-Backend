const UserAnswer = require('../models/userAnswer.model');
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

/**
 * Lấy danh sách UserAnswer theo quiz_attempt_id
 */
exports.getUserAnswersByQuizAttemptId = async (req, res) => {
  try {
    const { quiz_attempt_id } = req.params;

    // Lấy danh sách UserAnswer theo quiz_attempt_id
    const userAnswers = await UserAnswer.findAll({
      where: { quiz_attempt_id },
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['question_id', 'content'], // Chỉ lấy các trường cần thiết của Question
          include: [
            {
              model: Answer,
              as: 'answers',
              attributes: ['answer_id', 'content', 'is_correct'], // Chỉ lấy các trường cần thiết của Answer
            },
          ],
        },
      ],
    });

    if (userAnswers.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy UserAnswer nào cho quiz_attempt_id này.',
      });
    }

    return res.status(200).json({
      userAnswers: userAnswers,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách UserAnswer:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách UserAnswer.' });
  }
};
