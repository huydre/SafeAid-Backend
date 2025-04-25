// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload'); 


router.post('/', authMiddleware, upload.array('images', 5), postController.createPost);

// Tạo bài viết mới (yêu cầu xác thực)
router.post('/', authMiddleware, postController.createPost);

// Lấy danh sách bài viết (có thể không yêu cầu xác thực)
router.get('/', postController.getPosts);

// Lấy chi tiết bài viết theo post_id (có thể không yêu cầu xác thực)
router.get('/:post_id', postController.getPostById);

// Cập nhật bài viết (yêu cầu xác thực)
router.put('/:post_id', authMiddleware, postController.updatePost);

// Xoá bài viết (yêu cầu xác thực)
router.delete('/:post_id', authMiddleware, postController.deletePost);

module.exports = router;
