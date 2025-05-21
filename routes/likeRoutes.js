// routes/likeRoutes.js
const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middlewares/auth');

// Like bài viết: POST /api/posts/:post_id/like
router.post('/:post_id/like', authMiddleware, likeController.likePost);

// Bỏ like bài viết: DELETE /api/posts/:post_id/like
router.delete('/:post_id/like', authMiddleware, likeController.unlikePost);

module.exports = router;
