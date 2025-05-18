const { v4: uuidv4 } = require('uuid');
const QuizAttempts = require('../models/quizAttempts.model');
const UserAnswer = require('../models/userAnswer.model');
const Quiz = require('../models/quizzes.model'); // Import model Quiz
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

/**
 * Lấy danh sách QuizAttempts theo user_id, kèm theo thông tin Quiz
 */
exports.getQuizAttemptsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Lấy danh sách QuizAttempts theo user_id, kèm theo thông tin Quiz
    const quizAttempts = await QuizAttempts.findAll({
      where: { user_id },
      include: [
        {
          model: Quiz, // Liên kết với bảng Quiz
          as: 'quiz', // Alias (nếu cần)
          attributes: ['quiz_id', 'title', 'description', 'thumbnail_url', 'duration'], // Chỉ lấy các trường cần thiết
        },
      ],
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

/**
 * Lấy danh sách QuizAttempts theo user_id và quiz_id, kèm theo thông tin Quiz
 */
exports.getQuizAttemptsByUserIdAndQuizId = async (req, res) => {
  try {
    const { user_id, quiz_id } = req.params;

    // Lấy danh sách QuizAttempts theo user_id và quiz_id, kèm theo thông tin Quiz
    const quizAttempts = await QuizAttempts.findAll({
      where: { user_id, quiz_id },
      include: [
        {
          model: Quiz, // Liên kết với bảng Quiz
          as: 'quiz', // Alias phải khớp với alias trong quan hệ
          attributes: ['quiz_id', 'title', 'description', 'thumbnail_url', 'duration'], // Chỉ lấy các trường cần thiết
        },
      ],
    });

    if (quizAttempts.length === 0) {
      return res
        .status(200)
        .json({ quizAttempts: [] });
    }

    return res.status(200).json({
      quizAttempts: quizAttempts,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách QuizAttempts:', error);
    return res
      .status(500)
      .json({ quizAttempts: [] });
  }
};

exports.getHistoryQuizDetail = async (req, res) => {
  try {
    const { quiz_attempt_id, quiz_id } = req.params;

    // Lấy danh sách UserAnswer theo quiz_attempt_id
    const userAnswers = await UserAnswer.findAll({
      where: { quiz_attempt_id }
    });

    // Lấy danh sách Question theo quiz_id
    const questions = await Question.findAll({
      where: { quiz_id },
      include: [
        {
          model: Answer,
          as: 'answers',
          attributes: ['answer_id', 'content', 'is_correct'], // Thông tin của các Answer
        },
      ],
    });

    return res.status(200).json({
      user_answers: userAnswers,
      questions: questions,
    });
  } catch (error) {
    console.error('Lỗi khi lấy UserAnswer và Question:', error);
    return res.status(500).json({
      user_answers: [],
      questions: [],
    });
  }
};