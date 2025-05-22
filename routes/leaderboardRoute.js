const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const authMiddleware = require('../middlewares/auth');

router.get(
  '/my-rank',
  authMiddleware,
  leaderboardController.getMyRank
);

router.get('/', authMiddleware, leaderboardController.getLeaderboard);


module.exports = router;