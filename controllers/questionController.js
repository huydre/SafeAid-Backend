const Question = require('../models/question.model');

/**
 * Lấy danh sách các câu hỏi
 */
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll(); // Lấy tất cả các câu hỏi
    return res.status(200).json({
      message: 'Lấy danh sách câu hỏi thành công.',
      data: questions,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách câu hỏi:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách câu hỏi.' });
  }
};

/**
 * Lấy câu hỏi theo ID
 */
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id); // Tìm câu hỏi theo ID
    if (!question) {
      return res.status(404).json({ error: 'Không tìm thấy câu hỏi.' });
    }
    return res.status(200).json({
      message: 'Lấy câu hỏi thành công.',
      data: question,
    });
  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy câu hỏi.' });
  }
};

/**
 * Lấy danh sách câu hỏi theo quiz_id
 */
exports.getQuestionsByQuizId = async (req, res) => {
  try {
    const { quiz_id } = req.params;

    // Lấy danh sách câu hỏi theo quiz_id, kèm theo danh sách câu trả lời
    const questions = await Question.findAll({
      where: { quiz_id },
      include: [
        {
          model: require('../models/answer.model'), // Import Answer model
          as: 'answers', // Alias được định nghĩa trong quan hệ
          attributes: ['answer_id', 'content', 'is_correct'], // Chỉ lấy các trường cần thiết
        },
      ],
    });

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ error: 'Không tìm thấy câu hỏi nào cho quiz_id này.' });
    }

    return res.status(200).json({
      questions: questions,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách câu hỏi theo quiz_id:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách câu hỏi.' });
  }
};
