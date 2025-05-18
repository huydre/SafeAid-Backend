const Answer = require('../models/answer.model');

/**
 * Lấy danh sách các câu trả lời
 */
exports.getAllAnswers = async (req, res) => {
  try {
    const answers = await Answer.findAll(); // Lấy tất cả các câu trả lời
    return res.status(200).json({
      answers: answers,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách câu trả lời:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách câu trả lời.' });
  }
};

/**
 * Lấy danh sách câu trả lời theo ID câu hỏi
 */
exports.getAnswersByQuestionId = async (req, res) => {
  try {
    const { question_id } = req.params;
    const answers = await Answer.findAll({ where: { question_id } }); // Lấy câu trả lời theo question_id
    return res.status(200).json({
      answer: answers,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách câu trả lời:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách câu trả lời.' });
  }
};
