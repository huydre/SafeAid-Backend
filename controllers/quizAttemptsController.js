const { v4: uuidv4 } = require('uuid');
const QuizAttempts = require('../models/quizAttempts.model');
const UserAnswer = require('../models/userAnswer.model');
const Quiz = require('../models/quizzes.model'); // Import model Quiz
const Question = require('../models/question.model');
const Answer = require('../models/answer.model');
const Leaderboard = require('../models/leaderboard.model');
const sequelize = require('../config/db');
const { fn, col } = require('sequelize');
const { Op } = require('sequelize');
const QuizAttempt = require('../models/quizAttempts.model');
const User = require('../models/User');
const Notification = require('../models/notification.model'); // Thêm dòng này ở đầu file nếu chưa có
const admin = require('firebase-admin');

/**
 * Lấy danh sách QuizAttempts theo user_id, kèm theo thông tin Quiz
 */
exports.getQuizAttemptsByUserId = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy từ middleware xác thực

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

    // Remove this line - it's causing the error because t is undefined
    // await updateLeaderboard(user_id, t);

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
  const t = await sequelize.transaction();
  try {
    const user_id = req.user.user_id;
    const {
      quiz_id,
      quiz_content,
      score,
      max_score,
      duration,
      answers,
      completed_at
    } = req.body;

    const attempt_id = uuidv4();
    const completedAt = completed_at ? new Date(completed_at) : new Date();

    // 1) Tạo QuizAttempt
    await QuizAttempt.create({
      attempt_id,
      user_id,
      quiz_id,
      score,
      max_score,
      duration,
      completed_at: completedAt
    }, { transaction: t });

    // 2) Tạo UserAnswer - FILTER OUT EMPTY SELECTED_ANSWER_ID VALUES
    const validUserAnswers = answers
      .filter(a => a.selected_answer_id && a.selected_answer_id.trim() !== '')
      .map(a => ({
        user_answer_id: uuidv4(),
        user_id,
        question_id: a.question_id,
        quiz_attempt_id: attempt_id,
        selected_answer_id: a.selected_answer_id
      }));

    // Only insert user answers if there are valid ones
    if (validUserAnswers.length > 0) {
      await UserAnswer.bulkCreate(validUserAnswers, { transaction: t });
    }

    // 3) Cập nhật Leaderboard
    await updateLeaderboard(user_id, t);

    // 4) Tạo Notification
    await Notification.create({
      notification_id: uuidv4(),
      user_id,
      type: 'exam',
      ref_id: attempt_id,
      title: `Đã làm bài thi ${quiz_content}`,
      content: `Hoàn thành bài lúc ${completedAt.toLocaleString('vi-VN')} với số điểm ${score}/${max_score}`,
      is_read: false,
      created_at: completedAt
    }, { transaction: t });

    const payload = {
      topic: "news",
      data: {
        type: "exam",
        title: `Đã làm bài thi ${quiz_content}`,
        content: `Hoàn thành bài lúc ${completedAt.toLocaleString('vi-VN')} với số điểm ${score}/${max_score}`,
        ref_id: attempt_id
      },
      android: {
        priority: "high", // giúp đẩy noti nhanh
        ttl: 3600 * 1000 // optional: 1h timeout nếu chưa gửi được
      }
    };

    await admin.messaging().send(payload);

    await t.commit();
    return res.status(201).json({ result: '1' });
  } catch (error) {
    await t.rollback();
    console.error('Lỗi khi lưu QuizAttempt và UserAnswer:', error);
    return res.status(500).json({ 
      result: '0',
      error: error.message 
    });
  }
};

async function updateLeaderboard(user_id, transaction) {
  try {

    const userExists = await User.findOne({ 
      where: { user_id },
      transaction
    });

    if (!userExists) {
      console.warn(`User with ID ${user_id} does not exist in the database. Skipping leaderboard update.`);
      return; // Exit early - no need to update leaderboard for non-existent user
    }

    // 1) Best score mỗi quiz
    const bestScores = await QuizAttempt.findAll({
      attributes: [
        'user_id',
        'quiz_id',
        [fn('MAX', col('score')), 'bestScore']
      ],
      where: { user_id },
      group: ['quiz_id'],
      raw: true,
      transaction
    });

    // 2) Tính tổng
    const totalScore = bestScores
      .reduce((sum, r) => sum + parseInt(r.bestScore || 0, 10), 0);

    // 3) Get current ranking data to determine initial rank
    const existingEntries = await Leaderboard.findAll({
      attributes: ['user_id', 'score'],
      order: [['score', 'DESC']],
      raw: true,
      transaction
    });
    
    // Calculate initial rank for this user
    let initialRank = 1; // Default to 1 if it's the first user
    
    if (existingEntries.length > 0) {
      // Count how many users have higher scores
      const higherScores = existingEntries.filter(entry => 
        entry.user_id !== user_id && entry.score > totalScore
      ).length;
      
      initialRank = higherScores + 1;
    }

    // 3) Upsert Leaderboard entry
    const [entry, created] = await Leaderboard.findOrCreate({
      where: { user_id },
      defaults: {
        entry_id: uuidv4(),
        score: totalScore,
        rank: initialRank, // Include initial rank
        updated_at: Date.now()
      },
      transaction
    });
    
    if (!created) {
      entry.score = totalScore;
      entry.rank = initialRank; // Update rank when updating score
      entry.updated_at = Date.now();
      await entry.save({ transaction });
    }

    // 4) Recalculate rank toàn bộ
    const all = await Leaderboard.findAll({
      attributes: ['entry_id', 'user_id', 'score'],
      order: [['score', 'DESC']],
      transaction
    });
    
    for (let i = 0; i < all.length; i++) {
      all[i].rank = i + 1;
      await all[i].save({ transaction });
    }
  } catch (error) {
    console.error('Error in updateLeaderboard:', error);
    throw error; // Rethrow to be caught by the calling function
  }
}

/**
 * Lấy danh sách QuizAttempts theo user_id và quiz_id, kèm theo thông tin Quiz
 */
exports.getQuizAttemptsByUserIdAndQuizId = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy từ middleware xác thực
    const { quiz_id } = req.params;

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