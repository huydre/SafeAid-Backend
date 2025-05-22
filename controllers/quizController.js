const Quiz = require('../models/quizzes.model');

/**
 * Lấy danh sách các Quiz
 */
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll(); // Lấy tất cả các bản ghi từ bảng Quizzes
    return res.status(200).json({
      message: 'Lấy danh sách Quiz thành công.',
      data: quizzes,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách Quiz:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách Quiz.' });
  }
};

/**
 * Lấy Quiz theo quiz_id
 */
exports.getQuizById = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const quiz = await Quiz.findByPk(quiz_id);
    if (!quiz) {
      return res.status(404).json({ error: 'Không tìm thấy Quiz.' });
    }
    return res.status(200).json({
      quiz: quiz,
    });
  } catch (error) {
    console.error('Lỗi khi lấy Quiz:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy Quiz.' });
  }
};