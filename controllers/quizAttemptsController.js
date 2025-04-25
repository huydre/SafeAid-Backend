const { v4: uuidv4 } = require('uuid');
const QuizAttempts = require('../models/quizAttempts.model');
const UserAnswer = require('../models/userAnswer.model');

/**
 * Lấy danh sách QuizAttempts theo user_id
 */
exports.getQuizAttemptsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Lấy danh sách QuizAttempts theo user_id
    const quizAttempts = await QuizAttempts.findAll({
      where: { user_id },
    });

    if (quizAttempts.length === 0) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy QuizAttempts nào cho user_id này.' });
    }

    return res.status(200).json({
      quizAttempts: quizAttempts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách QuizAttempts:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách QuizAttempts.' });
  }
};

exports.saveQuizAttempt = async (req, res) => {
  try {
    const { user_id, quiz_id, score, max_score, duration, answers, completed_at} = req.body;

    const attempt_id = uuidv4();
    const completedAt = completed_at ? new Date(completed_at) : new Date();

    const quizAttempt = await QuizAttempts.create({
      attempt_id,
      user_id,
      quiz_id,
      score,
      max_score,
      duration,
      completed_at: completedAt,
    });

    // Lưu danh sách UserAnswer
    const userAnswers = answers.map((answer) => ({
      user_answer_id: uuidv4(),
      user_id,
      question_id: answer.question_id,
      quiz_attempt_id: attempt_id,
      selected_answer_id: answer.selected_answer_id,
    }));

    await UserAnswer.bulkCreate(userAnswers);

    return res.status(201).json({
      result: '1',
    });
  } catch (error) {
    console.error('Lỗi khi lưu QuizAttempt và UserAnswer:', error);
    return res.status(500).json({ result: '0' });
  }
};