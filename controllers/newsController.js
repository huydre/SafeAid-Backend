const { v4: uuidv4 } = require('uuid');
const News      = require('../models/news.model');
const NewsMedia = require('../models/newsMedia.model');
const User      = require('../models/User');

/**
 * Tạo tin tức mới
 * Nếu cần upload media (thumbnails hoặc nhiều media), 
 * bạn sử dụng multer tương tự postController.
 */
exports.createNews = async (req, res) => {
  try {
    const { title, content, thumbnail_path } = req.body;
    const author_id = req.user.user_id;  // từ auth middleware

    if (!title || !content) {
      return res.status(400).json({ error: 'title và content là bắt buộc.' });
    }

    const news_id = uuidv4();
    const newNews = await News.create({ news_id, title, content, thumbnail_path, author_id });

    // Xử lý upload media nếu có trong req.files (ví dụ upload.array('media'))
    if (req.files && req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        await NewsMedia.create({
          media_type: file.mimetype,
          media_url: file.path,
          order_index: i,
          caption: file.originalname,
          news_id
        });
      }
    }

    res.status(201).json({ message: 'Tạo tin tức thành công', news: newNews });
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
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const newsList = await News.findAll({
      offset, limit, order: [['created_at','DESC']],
      include: [
        { model: User,      as: 'author',  attributes: ['user_id','username'] },
        { model: NewsMedia, as: 'media',   attributes: ['media_id','media_url','order_index'] }
      ]
    });
    res.json({ page, limit, data: newsList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tức.' });
  }
};

/**
 * Lấy chi tiết tin tức theo ID
 */
exports.getNewsDetail = async (req,res) => {
  const { news_id } = req.params;
  // 1. Tăng view_count
  await News.increment('view_count',{ by:1, where:{ news_id } });

  // 2. Lấy detail kèm comments/replies
  const news = await News.findOne({
    where:{ news_id },
    include:[
      { model: User, as:'author', attributes:['user_id','username'] },
      { model: NewsMedia, as:'media', attributes:['media_id','media_url'] },
      { 
        model: NewsComment, as:'comments',
        where:{ parent_comment_id: null },
        required: false,
        include:[
          { model: User, as:'user', attributes:['user_id','username'] },
          { model: NewsComment, as:'replies',
            include:[ { model: User, as:'user', attributes:['user_id','username'] } ]
          }
        ]
      }
    ]
  });

  if(!news) return res.status(404).json({ error:'Không tìm thấy tin tức.' });
  res.json(news);
};

/**
 * Cập nhật tin tức
 */
exports.updateNews = async (req, res) => {
  try {
    const { news_id } = req.params;
    const news = await News.findOne({ where: { news_id } });
    if (!news) return res.status(404).json({ error: 'Không tìm thấy tin tức.' });

    // Chỉ author mới update (nếu cần)
    // if (req.user.user_id !== news.author_id) return res.status(403).json({ error: 'Không có quyền.' });

    const { title, content, thumbnail_path } = req.body;
    await news.update({ title, content, thumbnail_path, updated_at: new Date() });
    res.json({ message: 'Cập nhật thành công', news });
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
    const news = await News.findOne({ where: { news_id } });
    if (!news) return res.status(404).json({ error: 'Không tìm thấy tin tức.' });
    // if (req.user.user_id !== news.author_id) return res.status(403).json({ error: 'Không có quyền.' });
    await news.destroy();
    res.json({ message: 'Xoá tin tức thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi xoá tin tức.' });
  }
};
