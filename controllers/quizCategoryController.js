const QuizCategory = require('../models/quizCategory.model');
const Quiz = require('../models/quizzes.model');

/**
 * Lấy danh sách các QuizCategory
 */
exports.getAllQuizCategories = async (req, res) => {
  try {
    const categories = await QuizCategory.findAll(); // Lấy tất cả các bản ghi từ bảng QuizCategory
    return res.status(200).json({
      message: 'Lấy danh sách QuizCategory thành công.',
      data: categories,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách QuizCategory:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách QuizCategory.' });
  }
};

exports.getQuizCategoriesWithQuizzes = async (req, res) => {
  try {
    const categories = await QuizCategory.findAll({
      include: [
        {
          model: Quiz,
          as: 'quizzes', // Tên alias được định nghĩa trong quan hệ
          attributes: [
            'quiz_id',
            'title',
            'description',
            'thumbnail_url',
            'duration',
          ], // Chỉ lấy các trường cần thiết
        },
      ],
    });

    return res.status(200).json({
      categories
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách QuizCategory:', error);
    return res
      .status(500)
      .json({ error: 'Đã xảy ra lỗi khi lấy danh sách QuizCategory.' });
  }
};
