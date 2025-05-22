// controllers/postController.js

const { v4: uuidv4 } = require('uuid');
const Post = require('../models/post.model');
const User = require('../models/User');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');
const PostMedia = require('../models/postMedia.model');
const { config } = require('dotenv');
require('dotenv').config();
/**
 * Tạo bài viết mới
 * Yêu cầu:
 *  - Đã qua middleware auth: thông tin user được lưu trong req.user.
 *  - Body cần chứa: content và (tùy chọn) title.
 *  - Nếu có file ảnh được upload qua multer (req.files) thì lưu thông tin vào PostMedia.
 */
exports.createPost = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Nội dung bài viết không được để trống.' });
    }

    const post_id = uuidv4();

    const newPost = await Post.create({
      post_id,
      user_id,
      content,
      title: title || null
    });

    // Nếu có file ảnh được upload, lưu thông tin vào bảng PostMedia
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const postmedia_id = uuidv4();
        await PostMedia.create({
          postmedia_id,
          post_id,
          media_type: 'image', // hoặc 'video'
          media_link: file.path,
          user_id: user_id
        });
      }
    }

    res.status(201).json({
      message: 'Bài viết và ảnh được đăng thành công.',
      post: newPost
    });
  } catch (error) {
    console.error('Lỗi tạo bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo bài viết.' });
  }
};

/**
 * Lấy danh sách bài viết với phân trang.
 * Bao gồm thông tin của người viết, danh sách comment (với thông tin người bình luận),
 * danh sách like (với thông tin người thích) và thông tin media (không hiển thị media_link).
 */
exports.getPosts = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page  = parseInt(page)  || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const host = process.env.HOST || req.get('host');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const currentUserId = req?.user?.user_id;
    console.log('currentUserId:', currentUserId);

    const posts = await Post.findAll({
      offset,
      limit,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['user_id','username','profile_image_path'] },
        { model: PostMedia, as: 'media', attributes: ['postmedia_id','media_type','media_link'] },
        { 
          model: Comment, 
          as: 'comments', 
          include: [
            { model: User, as: 'user', attributes: ['user_id','username','profile_image_path'] }
          ]
        },
        { 
          model: Like, 
          as: 'likes', 
          include: [
            { model: User, as: 'user', attributes: ['user_id','username','profile_image_path'] }
          ]
        }
      ]
    });

    // Chuyển từng instance thành JSON, rồi format các URL
    const result = posts.map(post => {
      const p = post.toJSON();

      // Check if user liked the post
      p.liked_by_user = currentUserId ? 
        p.likes.some(like => like.user.user_id === currentUserId) : 
        false;

      // Format post creator's profile image
      if (p.user && p.user.profile_image_path) {
        p.user.profile_image_path = `${baseUrl}/${p.user.profile_image_path.replace(/\\/g, '/')}`;
      }

      // Format media URLs
      p.media = p.media.map(m => ({
        ...m,
        media_link: `${baseUrl}/${m.media_link.replace(/\\/g, '/')}`
      }));

      // Format profile images for comment users
      if (p.comments && p.comments.length) {
        p.comments = p.comments.map(comment => {
          if (comment.user && comment.user.profile_image_path) {
            return {
              ...comment,
              user: {
                ...comment.user,
                profile_image_path: `${baseUrl}/${comment.user.profile_image_path.replace(/\\/g, '/')}`
              }
            };
          }
          return comment;
        });
      }

      // Format profile images for like users
      if (p.likes && p.likes.length) {
        p.likes = p.likes.map(like => {
          if (like.user && like.user.profile_image_path) {
            return {
              ...like,
              user: {
                ...like.user,
                profile_image_path: `${baseUrl}/${like.user.profile_image_path.replace(/\\/g, '/')}`
              }
            };
          }
          return like;
        });
      }

      return p;
    });

    res.json({ page, limit, posts: result });
  } catch (error) {
    console.error('Lỗi lấy danh sách bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy danh sách bài viết.' });
  }
};

/**
 * Lấy chi tiết bài viết theo post_id.
 * Bao gồm thông tin của người viết, danh sách comment (với thông tin người bình luận),
 * danh sách like (với thông tin người thích) và thông tin media (không hiển thị media_link).
 */
exports.getPostById = async (req, res) => {
  try {
    const { post_id } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const post = await Post.findOne({
      where: { post_id },
      include: [
        { model: User, as: 'user', attributes: ['user_id','username','profile_image_path'] },
        { model: PostMedia, as: 'media', attributes: ['postmedia_id','media_type','media_link'] },
        { model: Comment, as: 'comments', include:[
            { model: User, as: 'user', attributes: ['user_id','username'] }
          ]
        },
        { model: Like, as: 'likes', include:[
            { model: User, as: 'user', attributes: ['user_id','username'] }
          ]
        }
      ]
    });

    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    // Chuyển thành JSON và prefix media_link
    const p = post.toJSON();
    p.media = p.media.map(m => ({
      ...m,
      media_link: baseUrl + '/' + m.media_link.replace(/\\/g, '/')
    }));

    res.json(p);
  } catch (error) {
    console.error('Lỗi lấy chi tiết bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy chi tiết bài viết.' });
  }
};

/**
 * Cập nhật bài viết.
 * Yêu cầu:
 *  - post_id trong params.
 *  - Body chứa dữ liệu cập nhật: content và (tùy chọn) title.
 *  - Yêu cầu token xác thực.
 */
exports.updatePost = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { content, title } = req.body;

    const post = await Post.findOne({ where: { post_id } });
    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    // (Tùy chọn): Kiểm tra quyền cập nhật
    // if (req.user.user_id !== post.user_id) {
    //   return res.status(403).json({ error: 'Bạn không có quyền cập nhật bài viết này.' });
    // }

    const updatedPost = await post.update({
      content: content || post.content,
      title: title || post.title,
      updated_at: new Date()
    });

    res.json({
      message: 'Bài viết đã được cập nhật thành công.',
      post: updatedPost
    });
  } catch (error) {
    console.error('Lỗi cập nhật bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật bài viết.' });
  }
};

/**
 * Xoá bài viết.
 * Yêu cầu:
 *  - post_id trong params.
 *  - Yêu cầu token xác thực.
 */
exports.deletePost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const post = await Post.findOne({ where: { post_id } });
    if (!post) {
      return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    }

    // (Tùy chọn): Kiểm tra quyền xoá
    // if (req.user.user_id !== post.user_id) {
    //   return res.status(403).json({ error: 'Bạn không có quyền xoá bài viết này.' });
    // }

    await post.destroy();
    res.json({ message: 'Bài viết đã được xoá thành công.' });
  } catch (error) {
    console.error('Lỗi xoá bài viết:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xoá bài viết.' });
  }
};
