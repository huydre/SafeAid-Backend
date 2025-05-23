// controllers/leaderboardController.js

const { Op, fn, col, literal } = require('sequelize');
const QuizAttempt               = require('../models/quizAttempts.model');
const Quiz                      = require('../models/quizzes.model');
const UserAnswer                = require('../models/userAnswer.model');
const sequelize                 = require('../config/db');
const User                      = require('../models/User');
const Leaderboard               = require('../models/leaderboard.model');

exports.getMyRank = async (req, res) => {
  try {
    // Get user_id from the authenticated token
    const user_id = req.user.user_id;
    
    console.log('Getting rank for authenticated user:', user_id);

    // Lấy thông tin user (bao gồm avatar)
    const user = await User.findOne({
      where: { user_id },
      attributes: ['user_id', 'username', 'profile_image_path'],
      raw: true
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Không tìm thấy thông tin người dùng.'
      });
    }

    // Format avatar URL
    const userAvatar = user.profile_image_path 
      ? `${req.protocol}://${req.get('host')}/${user.profile_image_path.replace(/\\/g, '/')}` 
      : null;

    // 1) Lấy thông tin từ bảng Leaderboard
    const leaderboardEntry = await Leaderboard.findOne({
      where: { user_id },
      attributes: ['rank', 'score', 'updated_at'],
      raw: true
    });

    // Lấy tổng số người tham gia từ Leaderboard
    const totalParticipants = await Leaderboard.count();
    
    // 2) Tính tổng điểm và tổng max_score của user
    const bestScores = await QuizAttempt.findAll({
      attributes: [
        'quiz_id',
        [fn('MAX', col('score')), 'bestScore'],
        [fn('MAX', col('max_score')), 'maxPossibleScore']
      ],
      where: { user_id },
      group: ['quiz_id'],
      raw: true
    });

    // Kiểm tra xem user đã làm quiz nào chưa
    const hasAttemptedQuizzes = bestScores.length > 0;

    // Tính tổng điểm từ các điểm cao nhất
    const totalScore = bestScores.reduce((sum, item) => sum + parseInt(item.bestScore || 0), 0);
    const totalMaxScore = bestScores.reduce((sum, item) => sum + parseInt(item.maxPossibleScore || 0), 0);
    const overallAccuracy = totalMaxScore
      ? Number((totalScore / totalMaxScore * 100).toFixed(2))
      : 0;

    // 3) Tính progress: đã làm bao nhiêu quiz / tổng số quiz
    const totalQuizzes = await Quiz.count();
    const doneQuizIdsRaw = await QuizAttempt.findAll({
      where: { user_id },
      attributes: [[fn('DISTINCT', col('quiz_id')), 'quiz_id']],
      raw: true
    });
    const quizzesDone = doneQuizIdsRaw.length;
    const progress = {
      done: quizzesDone,
      total: totalQuizzes,
      percentage: totalQuizzes > 0 ? Math.round((quizzesDone / totalQuizzes) * 100) : 0
    };

    // 4) Lấy thông tin chi tiết từng quiz và độ chính xác
    let accuracyByQuiz = [];
    
    // Get all quiz details
    const quizDetails = await Quiz.findAll({
      attributes: ['quiz_id', 'title', 'description', 'thumbnail_url', 'category_id'],
      raw: true
    });

    // Get user's best scores for each quiz they've taken
    const byQuiz = await QuizAttempt.findAll({
      where: { user_id },
      attributes: [
        'quiz_id',
        [fn('MAX', col('score')), 'bestScore'],
        [fn('MAX', col('max_score')), 'quizMaxScore']
      ],
      group: ['quiz_id'],
      raw: true
    });

    // Combine quiz details with user's accuracy - only for quizzes they've completed
    accuracyByQuiz = byQuiz.map(userQuiz => {
      const quizInfo = quizDetails.find(q => q.quiz_id === userQuiz.quiz_id) || {};
      const accuracy = userQuiz.quizMaxScore
        ? Number((userQuiz.bestScore / userQuiz.quizMaxScore * 100).toFixed(2))
        : 0;
        
      return {
        quiz_id: userQuiz.quiz_id,
        title: quizInfo.title || 'Unknown Quiz',
        description: quizInfo.description || '',
        thumbnail_url: quizInfo.thumbnail_url 
          ? `${req.protocol}://${req.get('host')}/${quizInfo.thumbnail_url.replace(/\\/g, '/')}` 
          : null,
        category_id: quizInfo.category_id,
        best_score: parseInt(userQuiz.bestScore || 0),
        max_score: parseInt(userQuiz.quizMaxScore || 0),
        accuracy: accuracy
      };
    });

    // Lấy rank từ Leaderboard hoặc giá trị mặc định
    const rank = leaderboardEntry ? leaderboardEntry.rank : "N/A";

    return res.status(200).json({
      success: true,
      user: {
        user_id,
        username: user.username,
        avatar: userAvatar
      },
      stats: {
        total_score: leaderboardEntry ? leaderboardEntry.score : totalScore,
        overall_accuracy: overallAccuracy,
        progress,
        quizzes: accuracyByQuiz,
        rank,
        total_participants: totalParticipants,
        message: !hasAttemptedQuizzes ? 
          "Hãy hoàn thành một bài kiểm tra để xem thứ hạng của bạn!" : 
          undefined,
        has_attempted_quizzes: hasAttemptedQuizzes,
        last_updated: leaderboardEntry ? 
          new Date(parseInt(leaderboardEntry.updated_at)).toISOString() : 
          null
      }
    });
  } catch (error) {
    console.error('Lỗi getMyRank:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Không thể lấy thông tin xếp hạng: ' + error.message 
    });
  }
};



exports.getLeaderboard = async (req, res) => {
  try {
    let { limit = 10, offset = 0 } = req.query;
    limit = parseInt(limit);
    offset = parseInt(offset);

    // 1) Lấy dữ liệu từ bảng Leaderboard (đã sắp xếp theo rank)
    const leaderboardEntries = await Leaderboard.findAll({
      attributes: ['user_id', 'score', 'rank', 'updated_at'],
      order: [['rank', 'ASC']],
      raw: true
    });

    // 2) Áp dụng phân trang
    const totalEntries = leaderboardEntries.length;
    const paged = leaderboardEntries.slice(offset, offset + limit);

    // 3) Lấy thông tin user chi tiết
    const userIds = paged.map(entry => entry.user_id);
    
    const users = await User.findAll({
      where: { user_id: { [Op.in]: userIds } },
      attributes: ['user_id', 'username', 'profile_image_path'],
      raw: true
    });

    // 4) Kết hợp dữ liệu và thêm đường dẫn avatar
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const data = paged.map(entry => {
      const user = users.find(u => u.user_id === entry.user_id) || {};
      
      return {
        rank: entry.rank,
        user_id: entry.user_id,
        username: user.username || 'Unknown User',
        avatar: user.profile_image_path
          ? `${baseUrl}/${user.profile_image_path.replace(/\\/g, '/')}`
          : null,
        total_score: entry.score,
        last_updated: new Date(parseInt(entry.updated_at)).toISOString()
      };
    });

    // 5) Trả về kết quả
    res.json({
      success: true,
      total: totalEntries,
      limit,
      offset,
      data
    });
  } catch (error) {
    console.error('Lỗi getLeaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Không thể lấy thông tin xếp hạng: ' + error.message
    });
  }
};