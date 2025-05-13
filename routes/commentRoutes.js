// routes/commentRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const authMiddleware    = require('../middlewares/auth');

// GET  /api/posts/:post_id/comments
router.get(
  '/', 
  authMiddleware, 
  commentController.getCommentsByPostId
);

// GET  /api/posts/:post_id/comments/:comment_id
router.get(
  '/:comment_id',
  authMiddleware,
  commentController.getCommentById
);

// POST /api/posts/:post_id/comments
router.post(
  '/', 
  authMiddleware, 
  commentController.createComment
);

// PUT  /api/posts/:post_id/comments/:comment_id
router.put(
  '/:comment_id',
  authMiddleware,
  commentController.updateComment
);

// DELETE /api/posts/:post_id/comments/:comment_id
router.delete(
  '/:comment_id',
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
