const express = require('express');
const router = express.Router({ mergeParams: true });
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/auth');

// Tạo comment mới cho bài viết: POST /api/posts/:post_id/comments
router.post('/', authMiddleware, commentController.createComment);

// Cập nhật comment: PUT /api/posts/:post_id/comments/:comment_id
router.put('/:comment_id', authMiddleware, commentController.updateComment);

// Xoá comment: DELETE /api/posts/:post_id/comments/:comment_id
router.delete('/:comment_id', authMiddleware, commentController.deleteComment);

module.exports = router;
