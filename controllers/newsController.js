const { v4: uuidv4 } = require('uuid');
const News      = require('../models/news.model');
const NewsMedia = require('../models/newsMedia.model');
const User      = require('../models/User');
const admin = require('firebase-admin');
const Notification = require('../models/notification.model');
const { calculateTimeAgo } = require('../utils/caculateTimeAgo');
const { Op } = require('sequelize');

/**
 * Tạo tin tức mới
 * Nếu cần upload media (thumbnails hoặc nhiều media),
 * bạn sử dụng multer tương tự postController.
 */
exports.createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author_id = req.user.user_id;

    if (!title || !content) {
      return res.status(400).json({ error: 'title và content là bắt buộc.' });
    }

    // Lấy thumbnail_path nếu upload
    let thumbnail_path = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      thumbnail_path = req.files.thumbnail[0].path; 
    }

    const news_id = uuidv4();
    const newNews = await News.create({
      news_id,
      title,
      content,
      thumbnail_path,
      author_id
    });

    // Xử lý media upload
    if (req.files && req.files.media) {
      for (let i = 0; i < req.files.media.length; i++) {
        const file = req.files.media[i];
        await NewsMedia.create({
          media_type:  file.mimetype,
          media_url:   file.path,
          order_index: i,
          caption:     file.originalname,
          news_id
        });
      }
    }

    await Notification.create({
      notification_id: uuidv4(),
      user_id: author_id,
      type: 'news',
      ref_id: news_id,
      title: `Tin tức mới: ${title}`,
      content: content,
      is_read: false,
      created_at: new Date()
    });

    // Bắn notification qua FCM (ví dụ gửi theo topic "news")
    const payload = {
      topic: "news",
      data: {
        type: "news",
        title: `Tin tức mới: ${title}`,
        content: content,
        ref_id: news_id
      },
      android: {
        priority: "high",
        ttl: 3600 * 1000
      }
    };
    await admin.messaging().send(payload);


    // Build full URL cho thumbnail ngay trong response
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const result  = newNews.toJSON();
    result.thumbnail_url = result.thumbnail_path
      ? `${baseUrl}/${result.thumbnail_path.replace(/\\/g, '/')}`
      : null;

    res.status(201).json({
      message: 'Tạo tin tức thành công',
      news: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi tạo tin tức.' });
  }
};

/**
 * Lấy danh sách tin tức, hỗ trợ phân trang
 */
exports.getNewsList = async (req, res) => {
  try {
    // build base URL từ request
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    let { page, limit } = req.query;
    page  = parseInt(page)  || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const rows = await News.findAll({
      offset,
      limit,
      order: [['created_at','DESC']],
      include: [
        { model: User,      as: 'author', attributes: ['user_id','username'] },
        { model: NewsMedia, as: 'media',  attributes: ['media_id','media_url','order_index','caption'] }
      ]
    });

    // map JSON để chèn thumbnail_url và chuyển media_url
    const data = rows.map(r => {
      const obj = r.toJSON();
      // thumbnail_url
      obj.thumbnail_url = obj.thumbnail_path
        ? `${baseUrl}/${obj.thumbnail_path.replace(/\\/g, '/')}`
        : null;
      // media full url
      if (Array.isArray(obj.media)) {
        obj.media.forEach(m => {
          m.media_url = `${baseUrl}/${m.media_url.replace(/\\/g, '/')}`;
        });
      }

      //sửa lại thumbnail_url từ thumbnail_path
      if (obj.thumbnail_path) {
        obj.thumbnail_url = `${baseUrl}/${obj.thumbnail_path.replace(/\\/g, '/')}`;
      } else {
        obj.thumbnail_url = null;
      }

      const createdAt = new Date(obj.created_at);
      const timeDiff = Math.floor((Date.now() - createdAt.getTime()) / 1000);
      let timeAgo;
      if (timeDiff < 60) {
        timeAgo = `${timeDiff} giây trước`;
      } else if (timeDiff < 3600) {
        timeAgo = `${Math.floor(timeDiff / 60)} phút trước`;
      } else if (timeDiff < 86400) {
        timeAgo = `${Math.floor(timeDiff / 3600)} giờ trước`;
      } else {
        timeAgo = `${Math.floor(timeDiff / 86400)} ngày trước`;
      }
      obj.time_ago = timeAgo;

      return obj;
    });

    res.json({ page, limit, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tức.' });
  }
};

/**
 * Lấy chi tiết tin tức theo ID
 */
exports.getNewsDetail = async (req, res) => {
  try {
    const { news_id } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // tăng view
    await News.increment('view_count', { by: 1, where: { news_id } });

    const row = await News.findOne({
      where: { news_id },
      include: [
        { model: User,         as: 'author',  attributes: ['user_id','username'] },
        { model: NewsMedia,    as: 'media',   attributes: ['media_id','media_url','caption'] },
        {
          model: NewsComment, as: 'comments',
          where: { parent_comment_id: null },
          required: false,
          include: [
            { model: User,       as: 'user',    attributes: ['user_id','username'] },
            { model: NewsComment, as: 'replies',
              include: [{ model: User, as: 'user', attributes: ['user_id','username'] }]
            }
          ]
        }
      ]
    });

    if (!row) return res.status(404).json({ error: 'Không tìm thấy tin tức.' });

    const news = row.toJSON();
    news.thumbnail_url = news.thumbnail_path
      ? `${baseUrl}/${news.thumbnail_path.replace(/\\/g, '/')}`
      : null;
    if (Array.isArray(news.media)) {
      news.media.forEach(m => {
        m.media_url = `${baseUrl}/${m.media_url.replace(/\\/g, '/')}`;
      });
    }

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết tin tức.' });
  }
};

/**
 * Cập nhật tin tức
 */
exports.updateNews = async (req, res) => {
  try {
    const { news_id } = req.params;
    const news = await News.findByPk(news_id);
    if (!news) return res.status(404).json({ error: 'Không tìm thấy tin tức.' });

    const { title, content, thumbnail_path } = req.body;
    await news.update({
      title,
      content,
      thumbnail_path,
      updated_at: new Date()
    });

    // trả luôn thumbnail_url nếu cần
    const updated = news.toJSON();
    updated.thumbnail_url = updated.thumbnail_path
      ? `${req.protocol}://${req.get('host')}/${updated.thumbnail_path.replace(/\\/g, '/')}`
      : null;

    res.json({ message: 'Cập nhật thành công', news: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi cập nhật tin tức.' });
  }
};

/**
 * Xoá tin tức
 */
exports.deleteNews = async (req, res) => {
  try {
    const { news_id } = req.params;
    const news = await News.findByPk(news_id);
    if (!news) return res.status(404).json({ error: 'Không tìm thấy tin tức.' });

    await news.destroy();
    res.json({ message: 'Xoá tin tức thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi xoá tin tức.' });
  }
};

exports.sendDemoNewsNotification = async (req, res) => {
  const newsId = uuidv4();
  const title = "📰 Tin tức demo #" + Math.floor(Math.random() * 1000);
  const content = "Đây là nội dung demo được tạo ngẫu nhiên.";

  const payload = {
    topic: "news",
    data: {
      title: title,
      content: content,
      news_id: newsId
    },
    android: {
      priority: "high", // giúp đẩy noti nhanh
      ttl: 3600 * 1000 // optional: 1h timeout nếu chưa gửi được
    }
  };

  try {
    const response = await admin.messaging().send(payload);
    res.status(200).json({
      message: "Đã gửi thông báo tin tức demo thành công.",
      data: { id: newsId, title, content }
    });
  } catch (error) {
    res.status(500).json({ message: "Không thể gửi thông báo." });
  }
};

exports.searchNews = async (req, res) => {
  try {
    const { keyword, page, limit } = req.query;
    
    // Validate keyword
    if (!keyword || keyword.trim() === '') {
      return res.status(400).json({ 
        success: false,
        error: 'Từ khóa tìm kiếm không được để trống.' 
      });
    }

    // Pagination parameters
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const offset = (currentPage - 1) * itemsPerPage;
    
    // Base URL for media
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Search query with Sequelize
    const { count, rows } = await News.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${keyword}%` } },
          { content: { [Op.like]: `%${keyword}%` } }
        ]
      },
      include: [
        { model: User, as: 'author', attributes: ['user_id', 'username'] },
        { model: NewsMedia, as: 'media', attributes: ['media_id', 'media_url', 'order_index', 'caption'] }
      ],
      order: [['created_at', 'DESC']],
      limit: itemsPerPage,
      offset: offset
    });

    const results = rows.map(row => {
      const news = row.toJSON();
      
      news.thumbnail_url = news.thumbnail_path
        ? `${baseUrl}/${news.thumbnail_path.replace(/\\/g, '/')}`
        : null;
      
      if (Array.isArray(news.media)) {
        news.media.forEach(media => {
          media.media_url = `${baseUrl}/${media.media_url.replace(/\\/g, '/')}`;
        });
      }

      const createdAt = new Date(news.created_at);
      news.time_ago = calculateTimeAgo(createdAt);
      
      return news;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / itemsPerPage);

    // Return search results with pagination metadata
    res.status(200).json({
      success: true,
      message: `Tìm thấy ${count} kết quả cho từ khóa "${keyword}"`,
      keyword: keyword,
      pagination: {
        total_items: count,
        total_pages: totalPages,
        current_page: currentPage,
        items_per_page: itemsPerPage,
        has_next_page: currentPage < totalPages,
        has_previous_page: currentPage > 1
      },
      data: results
    });
  } catch (error) {
    console.error('Lỗi khi tìm kiếm tin tức:', error);
    res.status(500).json({ 
      success: false,
      error: 'Đã xảy ra lỗi khi tìm kiếm tin tức.' 
    });
  }
};