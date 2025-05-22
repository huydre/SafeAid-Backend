const { v4: uuidv4 } = require('uuid');
const Guide = require('../models/guide.model');
const GuideMedia = require('../models/guideMedia.model');
const GuideCategory = require('../models/guideCategory.model');

// Lấy danh sách hướng dẫn với phân trang và lọc theo category
exports.getGuides = async (req, res) => {
  try {
    let { page, limit, category_id } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = category_id ? { category_id } : {};
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const guides = await Guide.findAll({
      where: whereClause,
      offset,
      limit,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: GuideCategory,
          as: 'category',
          attributes: ['category_id', 'name']
        },
        {
          model: GuideMedia,
          as: 'media',
          attributes: ['media_id', 'media_type', 'media_url', 'caption']
        }
      ]
    });

    // Xử lý URL cho thumbnail và media
    const data = guides.map(guide => {
      const obj = guide.toJSON();
      // Xử lý thumbnail_url
      obj.thumbnail_url = obj.thumbnail_path
        ? `${baseUrl}/${obj.thumbnail_path.replace(/\\/g, '/')}`
        : null;

      // Xử lý media_url
      if (Array.isArray(obj.media)) {
        obj.media.forEach(m => {
          m.media_url = `${baseUrl}/${m.media_url.replace(/\\/g, '/')}`;
        });
      }

      return obj;
    });

    res.json({
      page,
      limit,
      guides: data
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy danh sách hướng dẫn.' });
  }
};

// Lấy chi tiết một hướng dẫn
exports.getGuideById = async (req, res) => {
  try {
    const { guide_id } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const guide = await Guide.findOne({
      where: { guide_id },
      include: [
        {
          model: GuideCategory,
          as: 'category',
          attributes: ['category_id', 'name']
        },
        {
          model: GuideMedia,
          as: 'media',
          attributes: ['media_id', 'media_type', 'media_url', 'caption']
        }
      ]
    });

    if (!guide) {
      return res.status(404).json({ error: 'Không tìm thấy hướng dẫn.' });
    }

    // Tăng số lượt xem
    await guide.increment('view_count', { by: 1 });

    // Xử lý URL cho thumbnail và media
    const result = guide.toJSON();
    result.thumbnail_url = result.thumbnail_path
      ? `${baseUrl}/${result.thumbnail_path.replace(/\\/g, '/')}`
      : null;

    if (Array.isArray(result.media)) {
      result.media.forEach(m => {
        m.media_url = `${baseUrl}/${m.media_url.replace(/\\/g, '/')}`;
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy chi tiết hướng dẫn.' });
  }
};

// Tạo hướng dẫn mới
exports.createGuide = async (req, res) => {
  try {
    const { title, description, category_id } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (!title || !description || !category_id) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
    }

    // Kiểm tra category có tồn tại
    const category = await GuideCategory.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ error: 'Danh mục không tồn tại.' });
    }

    // Lấy thumbnail_path nếu upload
    let thumbnail_path = null;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      thumbnail_path = req.files.thumbnail[0].path;
    }

    const guide_id = uuidv4();
    const newGuide = await Guide.create({
      guide_id,
      title,
      description,
      thumbnail_path,
      category_id,
      view_count: 0
    });

    // Xử lý media upload
    if (req.files && req.files.media) {
      for (let i = 0; i < req.files.media.length; i++) {
        const file = req.files.media[i];
        await GuideMedia.create({
          media_id: uuidv4(),
          media_type: file.mimetype,
          media_url: file.path,
          order_index: i,
          caption: file.originalname,
          guide_id,
        });
      }
    }

    // Build full URL cho response
    const result = newGuide.toJSON();
    result.thumbnail_url = result.thumbnail_path
      ? `${baseUrl}/${result.thumbnail_path.replace(/\\/g, '/')}`
      : null;

    res.status(201).json({
      message: 'Tạo hướng dẫn thành công.',
      guide: result
    });
  } catch (error) {
    console.error('Lỗi khi tạo hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo hướng dẫn.' });
  }
};

// Cập nhật hướng dẫn
exports.updateGuide = async (req, res) => {
  try {
    const { guide_id } = req.params;
    const { title, description, category_id } = req.body;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const guide = await Guide.findByPk(guide_id);
    if (!guide) {
      return res.status(404).json({ error: 'Không tìm thấy hướng dẫn.' });
    }

    if (category_id) {
      const category = await GuideCategory.findByPk(category_id);
      if (!category) {
        return res.status(400).json({ error: 'Danh mục không tồn tại.' });
      }
    }

    // Xử lý thumbnail nếu có upload mới
    let thumbnail_path = undefined;
    if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
      thumbnail_path = req.files.thumbnail[0].path;
    }

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category_id && { category_id }),
      ...(thumbnail_path && { thumbnail_path }),
      updated_at: new Date()
    };

    await guide.update(updateData);

    // Xử lý media mới nếu có
    if (req.files && req.files.media) {
      // Xóa media cũ
      await GuideMedia.destroy({ where: { guide_id } });

      // Thêm media mới
      for (let i = 0; i < req.files.media.length; i++) {
        const file = req.files.media[i];
        await GuideMedia.create({
          media_id: uuidv4(),
          guide_id,
          media_type: file.mimetype,
          media_url: file.path,
          order_index: i,
          caption: file.originalname
        });
      }
    }

    // Lấy guide đã cập nhật kèm media
    const updatedGuide = await Guide.findOne({
      where: { guide_id },
      include: [
        {
          model: GuideMedia,
          as: 'media',
          attributes: ['media_id', 'media_type', 'media_url', 'caption']
        }
      ]
    });

    // Build full URL cho response
    const result = updatedGuide.toJSON();
    result.thumbnail_url = result.thumbnail_path
      ? `${baseUrl}/${result.thumbnail_path.replace(/\\/g, '/')}`
      : null;

    if (Array.isArray(result.media)) {
      result.media.forEach(m => {
        m.media_url = `${baseUrl}/${m.media_url.replace(/\\/g, '/')}`;
      });
    }

    res.json({
      message: 'Cập nhật hướng dẫn thành công.',
      guide: result
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật hướng dẫn.' });
  }
};

// Xóa hướng dẫn
exports.deleteGuide = async (req, res) => {
  try {
    const { guide_id } = req.params;

    const guide = await Guide.findByPk(guide_id);
    if (!guide) {
      return res.status(404).json({ error: 'Không tìm thấy hướng dẫn.' });
    }

    // Xóa các media liên quan
    await GuideMedia.destroy({ where: { guide_id } });

    // Xóa guide
    await guide.destroy();

    res.json({ message: 'Xóa hướng dẫn thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa hướng dẫn.' });
  }
};