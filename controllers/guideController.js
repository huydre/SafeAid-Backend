const { v4: uuidv4 } = require('uuid');
const Guide = require('../models/guide.model');
const GuideMedia = require('../models/guideMedia.model');
const GuideCategory = require('../models/guideCategory.model');
const { Op } = require('sequelize');

// Lấy danh sách hướng dẫn với phân trang và lọc theo category
exports.getGuides = async (req, res) => {
  try {
    let { page, limit, category_id } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = category_id ? { category_id } : {};

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

    res.json({
      page,
      limit,
      guides
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

    res.json(guide);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết hướng dẫn:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy chi tiết hướng dẫn.' });
  }
};

// Tạo hướng dẫn mới
exports.createGuide = async (req, res) => {
  try {
    const { title, description, category_id } = req.body;
    const thumbnail_path = req.file ? req.file.path : null;

    if (!title || !description || !category_id) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc.' });
    }

    // Kiểm tra category có tồn tại
    const category = await GuideCategory.findByPk(category_id);
    if (!category) {
      return res.status(400).json({ error: 'Danh mục không tồn tại.' });
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

    res.status(201).json({
      message: 'Tạo hướng dẫn thành công.',
      guide: newGuide
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
    const thumbnail_path = req.file ? req.file.path : undefined;

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

    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category_id && { category_id }),
      ...(thumbnail_path && { thumbnail_path }),
      updated_at: new Date()
    };

    await guide.update(updateData);

    res.json({
      message: 'Cập nhật hướng dẫn thành công.',
      guide: await guide.reload()
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

exports.searchGuides = async (req, res) => {
  try {
    const { keyword, page, limit, category_id } = req.query;
    
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

    // Build where clause
    const whereClause = {
      [Op.or]: [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    };
    
    // Add category filter if provided
    if (category_id) {
      whereClause.category_id = category_id;
    }

    console.log('Search query params:', { keyword, category_id, currentPage, itemsPerPage });

    // Search query with Sequelize
    const { count, rows } = await Guide.findAndCountAll({
      where: whereClause,
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
      ],
      order: [['created_at', 'DESC']],
      limit: itemsPerPage,
      offset: offset
    });

    console.log(`Found ${count} guide results for keyword "${keyword}"`);

    const results = rows.map(row => {
      const guide = row.toJSON();
      
      // Format thumbnail URL
      guide.thumbnail_url = guide.thumbnail_path
        ? `${baseUrl}/${guide.thumbnail_path.replace(/\\/g, '/')}`
        : null;
      
      // Format media URLs
      if (Array.isArray(guide.media)) {
        guide.media.forEach(media => {
          if (media.media_url) {
            media.media_url = `${baseUrl}/${media.media_url.replace(/\\/g, '/')}`;
          }
        });
      }
      
      return guide;
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / itemsPerPage);

    // Return search results with pagination metadata
    res.status(200).json({
      success: true,
      message: `Tìm thấy ${count} kết quả hướng dẫn cho từ khóa "${keyword}"`,
      keyword: keyword,
      category_id: category_id || null,
      pagination: {
        total_items: count,
        total_pages: totalPages,
        current_page: currentPage,
        items_per_page: itemsPerPage,
        has_next_page: currentPage < totalPages,
        has_previous_page: currentPage > 1
      },
      guides: results
    });
  } catch (error) {
    console.error('Lỗi khi tìm kiếm hướng dẫn:', error);
    res.status(500).json({ 
      success: false,
      error: 'Đã xảy ra lỗi khi tìm kiếm hướng dẫn: ' + error.message 
    });
  }
};