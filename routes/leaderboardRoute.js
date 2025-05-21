const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middlewares/auth');

// Public routes
router.get('/', leaderboardController.getGlobalLeaderboard);
router.get('/quiz/:quiz_id', leaderboardController.getQuizLeaderboard);
router.get('/user/:user_id', leaderboardController.getUserRank);

// Protected routes
router.post('/update', authMiddleware, leaderboardController.updateLeaderboard);

// Admin route
router.post('/recalculate', authMiddleware, (req, res, next) => {
  // Check if user is admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Bạn không có quyền thực hiện hành động này.'
    });
  }
}, leaderboardController.recalculateRanks);

module.exports = router;