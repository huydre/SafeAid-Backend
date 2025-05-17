// controllers/likeController.js

const { v4: uuidv4 } = require('uuid');
const Like = require('../models/like.model');
const Post = require('../models/post.model');

/**
 * Like một bài viết.
 * Yêu cầu: 
 *   - Token hợp lệ (middleware auth), từ đó lấy ra req.user.user_id.
 *   - post_id được truyền qua params.
 */
exports.likePost = async (req, res) => {
  try {
    const user_id = req.user.user_id;  // Lấy ID người dùng từ token
    const { post_id } = req.params;

    // Kiểm tra xem bài viết đã được like bởi người dùng này chưa
    const existingLike = await Like.findOne({
      where: { post_id, user_id }
    });
    if (existingLike) {
      return res.status(400).json({ error: 'Bài viết đã được like.' });
    }

    // Tạo mới Like
    const like_id = uuidv4();
    const newLike = await Like.create({
      like_id,
      post_id,
      user_id,
      // created_at sẽ được gán mặc định nếu model định nghĩa defaultValue hoặc sử dụng hooks
    });

    // (Tùy chọn) Cập nhật số lượt like của bài viết:
    await Post.increment('like_count', { by: 1, where: { post_id } });

    res.status(201).json({
      message: 'Bài viết đã được like thành công.',
      like: newLike
    });
  } catch (error) {
    console.error('Lỗi khi like bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi like bài viết.' });
  }
};

/**
 * Bỏ like một bài viết.
 * Yêu cầu:
 *   - Token hợp lệ (middleware auth), từ đó lấy ra req.user.user_id.
 *   - post_id được truyền qua params.
 */
exports.unlikePost = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { post_id } = req.params;

    // Tìm bản ghi like của người dùng với bài viết này
    const existingLike = await Like.findOne({
      where: { post_id, user_id }
    });
    if (!existingLike) {
      return res.status(400).json({ error: 'Bài viết chưa được like.' });
    }

    // Xoá bản ghi like
    await existingLike.destroy();

    // (Tùy chọn) Cập nhật số lượt like của bài viết:
    await Post.decrement('like_count', { by: 1, where: { post_id } });

    res.json({ message: 'Đã bỏ like bài viết thành công.' });
  } catch (error) {
    console.error('Lỗi khi bỏ like bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi bỏ like bài viết.' });
  }
};
