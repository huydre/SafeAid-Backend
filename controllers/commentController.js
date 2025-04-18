const { v4: uuidv4 } = require('uuid');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');

/**
 * Tạo comment mới cho bài viết.
 * Yêu cầu:
 *   - Đã qua middleware auth, thông tin user nằm trong req.user.
 *   - Tham số post_id được truyền qua params.
 *   - Body chứa trường "content".
 */
exports.createComment = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy ID người dùng từ token
    const { post_id } = req.params;    // post_id được truyền qua URL
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Nội dung comment không được để trống.' });
    }

    // Kiểm tra xem bài viết có tồn tại không (tùy chọn)
    const post = await Post.findOne({ where: { post_id } });
    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    // Tạo ID cho comment mới
    const comment_id = uuidv4();

    const newComment = await Comment.create({
      comment_id,
      post_id,
      user_id,
      content
      // created_at và updated_at sẽ được tự động gán nếu model định nghĩa defaultValue hoặc sử dụng hooks
    });

    // (Tùy chọn) Cập nhật số lượng comment của bài viết, ví dụ:
    // await Post.increment('comment_count', { by: 1, where: { post_id } });

    res.status(201).json({
      message: 'Comment được tạo thành công.',
      comment: newComment
    });
  } catch (error) {
    console.error('Lỗi tạo comment:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo comment.' });
  }
};

/**
 * Cập nhật comment.
 * Yêu cầu:
 *   - Đã qua middleware auth.
 *   - Tham số comment_id trong params.
 *   - Body chứa trường "content" mới.
 *   - Chỉ chủ sở hữu comment mới được cập nhật.
 */
exports.updateComment = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { comment_id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Nội dung comment không được để trống.' });
    }

    const comment = await Comment.findOne({ where: { comment_id } });
    if (!comment) {
      return res.status(404).json({ error: 'Không tìm thấy comment.' });
    }

    // Kiểm tra quyền: chỉ chủ sở hữu comment mới được cập nhật
    if (comment.user_id !== user_id) {
      return res.status(403).json({ error: 'Bạn không có quyền cập nhật comment này.' });
    }

    const updatedComment = await comment.update({
      content,
      updated_at: new Date()
    });

    res.json({
      message: 'Comment được cập nhật thành công.',
      comment: updatedComment
    });
  } catch (error) {
    console.error('Lỗi cập nhật comment:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật comment.' });
  }
};

/**
 * Xoá comment.
 * Yêu cầu:
 *   - Đã qua middleware auth.
 *   - Tham số comment_id trong params.
 *   - Chỉ chủ sở hữu comment mới được xoá.
 */
exports.deleteComment = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { comment_id } = req.params;

    const comment = await Comment.findOne({ where: { comment_id } });
    if (!comment) {
      return res.status(404).json({ error: 'Không tìm thấy comment.' });
    }

    // Kiểm tra quyền: chỉ chủ sở hữu comment mới được xoá
    if (comment.user_id !== user_id) {
      return res.status(403).json({ error: 'Bạn không có quyền xoá comment này.' });
    }

    await comment.destroy();

    // (Tùy chọn) Cập nhật số lượng comment của bài viết, ví dụ:
    // await Post.decrement('comment_count', { by: 1, where: { post_id: comment.post_id } });

    res.json({ message: 'Comment đã được xoá thành công.' });
  } catch (error) {
    console.error('Lỗi xoá comment:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xoá comment.' });
  }
};
