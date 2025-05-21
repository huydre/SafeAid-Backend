const { v4: uuidv4 } = require('uuid');
const Leaderboard = require('../models/leaderboard.model');
const User = require('../models/User');
const QuizAttempts = require('../models/quizAttempts.model');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Get top leaderboard entries (global leaderboard)
 */
exports.getGlobalLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    const leaderboard = await Leaderboard.findAll({
      limit: limitNum,
      order: [
        ['score', 'DESC'], 
        ['updated_at', 'ASC']
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'profile_image_path']
        }
      ]
    });
    
    // Format profile images with complete URLs
    const formattedLeaderboard = leaderboard.map(entry => {
      const data = entry.toJSON();
      if (data.user && data.user.profile_image_path) {
        data.user.profile_image_path = `${req.protocol}://${req.get('host')}/${data.user.profile_image_path.replace(/\\/g, '/')}`;
      }
      return data;
    });

    return res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard
    });
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Đã xảy ra lỗi khi lấy bảng xếp hạng.'
    });
  }
};

/**
 * Get leaderboard for a specific quiz
 */
exports.getQuizLeaderboard = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    const leaderboard = await Leaderboard.findAll({
      where: { quiz_id },
      limit: limitNum,
      order: [
        ['score', 'DESC'], 
        ['updated_at', 'ASC']
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'profile_image_path']
        }
      ]
    });

    // Format profile images with complete URLs
    const formattedLeaderboard = leaderboard.map(entry => {
      const data = entry.toJSON();
      if (data.user && data.user.profile_image_path) {
        data.user.profile_image_path = `${req.protocol}://${req.get('host')}/${data.user.profile_image_path.replace(/\\/g, '/')}`;
      }
      return data;
    });

    return res.status(200).json({
      success: true,
      leaderboard: formattedLeaderboard
    });
  } catch (error) {
    console.error('Error fetching quiz leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Đã xảy ra lỗi khi lấy bảng xếp hạng của bài kiểm tra.'
    });
  }
};

/**
 * Get user's position on leaderboard (global)
 */
exports.getUserRank = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Get user's entry
    const userEntry = await Leaderboard.findOne({
      where: { user_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'profile_image_path']
        }
      ]
    });

    if (!userEntry) {
      return res.status(404).json({
        success: false,
        error: 'Người dùng chưa có điểm trên bảng xếp hạng.'
      });
    }

    // Get count of users with higher scores
    const higherRanks = await Leaderboard.count({
      where: {
        [Op.or]: [
          { score: { [Op.gt]: userEntry.score } },
          {
            score: userEntry.score,
            updated_at: { [Op.lt]: userEntry.updated_at }
          }
        ]
      }
    });

    // Rank is 1-based
    const rank = higherRanks + 1;

    // Format profile image
    let userData = userEntry.toJSON();
    if (userData.user && userData.user.profile_image_path) {
      userData.user.profile_image_path = `${req.protocol}://${req.get('host')}/${userData.user.profile_image_path.replace(/\\/g, '/')}`;
    }

    return res.status(200).json({
      success: true,
      rank,
      score: userEntry.score,
      user: userData.user
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    return res.status(500).json({
      success: false,
      error: 'Đã xảy ra lỗi khi lấy thứ hạng người dùng.'
    });
  }
};

/**
 * Update leaderboard after quiz completion
 * This should be called after saving a quiz attempt
 */
exports.updateLeaderboard = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { user_id, quiz_id, score } = req.body;

    if (!user_id || !score) {
      return res.status(400).json({
        success: false,
        error: 'Thiếu thông tin cần thiết.'
      });
    }

    // Check if user already has an entry for this quiz
    let entry = await Leaderboard.findOne({
      where: { 
        user_id,
        ...(quiz_id ? { quiz_id } : {})
      }
    }, { transaction });

    if (entry) {
      // Update only if new score is higher
      if (score > entry.score) {
        entry.score = score;
        entry.updated_at = new Date();
        await entry.save({ transaction });
      }
    } else {
      // Create new entry
      entry = await Leaderboard.create({
        entry_id: uuidv4(),
        user_id,
        quiz_id,
        score,
        rank: 0, // Will be calculated later
        updated_at: new Date()
      }, { transaction });
    }

    // Update ranks for all entries (if global) or for specific quiz
    const entries = await Leaderboard.findAll({
      where: quiz_id ? { quiz_id } : {},
      order: [
        ['score', 'DESC'],
        ['updated_at', 'ASC']
      ]
    }, { transaction });

    // Update ranks
    for (let i = 0; i < entries.length; i++) {
      entries[i].rank = i + 1;
      await entries[i].save({ transaction });
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Bảng xếp hạng đã được cập nhật.'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error updating leaderboard:', error);
    return res.status(500).json({
      success: false,
      error: 'Đã xảy ra lỗi khi cập nhật bảng xếp hạng.'
    });
  }
};

/**
 * Recalculate all leaderboard ranks
 * This is an admin-only operation
 */
exports.recalculateRanks = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Global leaderboard recalculation
    const globalEntries = await Leaderboard.findAll({
      where: { quiz_id: null },
      order: [
        ['score', 'DESC'],
        ['updated_at', 'ASC']
      ]
    }, { transaction });

    for (let i = 0; i < globalEntries.length; i++) {
      globalEntries[i].rank = i + 1;
      await globalEntries[i].save({ transaction });
    }

    // Quiz-specific leaderboard recalculation
    // Get all unique quiz IDs
    const quizIds = await Leaderboard.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('quiz_id')), 'quiz_id']],
      where: {
        quiz_id: {
          [Op.not]: null
        }
      }
    });

    // For each quiz, recalculate ranks
    for (const quizIdObj of quizIds) {
      const quizId = quizIdObj.quiz_id;
      
      const quizEntries = await Leaderboard.findAll({
        where: { quiz_id: quizId },
        order: [
          ['score', 'DESC'],
          ['updated_at', 'ASC']
        ]
      }, { transaction });

      for (let i = 0; i < quizEntries.length; i++) {
        quizEntries[i].rank = i + 1;
        await quizEntries[i].save({ transaction });
      }
    }

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Tất cả thứ hạng đã được tính toán lại.'
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error recalculating leaderboard ranks:', error);
    return res.status(500).json({
      success: false,
      error: 'Đã xảy ra lỗi khi tính toán lại thứ hạng.'
    });
  }
};