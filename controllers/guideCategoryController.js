const { v4: uuidv4 } = require('uuid');
const GuideCategory = require('../models/guideCategory.model');
const Guide = require('../models/guide.model');

// Lấy danh sách danh mục
exports.getCategories = async (req, res) => {
  try {
    const categories = await GuideCategory.findAll({
      include: [{
        model: Guide,
        as: 'guides',
        attributes: ['guide_id', 'title']
      }]
    });

    res.json(categories);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách danh mục:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy danh sách danh mục.' });
  }
};

// Lấy chi tiết một danh mục
exports.getCategoryById = async (req, res) => {
  try {
    const { category_id } = req.params;

    const category = await GuideCategory.findOne({
      where: { category_id },
      include: [{
        model: Guide,
        as: 'guides',
        attributes: ['guide_id', 'title', 'description', 'thumbnail_path']
      }]
    });

    if (!category) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
    }

    res.json(category);
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết danh mục:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi lấy chi tiết danh mục.' });
  }
};

// Tạo danh mục mới
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tên danh mục là bắt buộc.' });
    }

    const category_id = uuidv4();
    const newCategory = await GuideCategory.create({
      category_id,
      name,
      description
    });

    res.status(201).json({
      message: 'Tạo danh mục thành công.',
      category: newCategory
    });
  } catch (error) {
    console.error('Lỗi khi tạo danh mục:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi tạo danh mục.' });
  }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name, description } = req.body;

    const category = await GuideCategory.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
    }

    await category.update({
      ...(name && { name }),
      ...(description && { description })
    });

    res.json({
      message: 'Cập nhật danh mục thành công.',
      category: await category.reload()
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật danh mục:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi cập nhật danh mục.' });
  }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.params;

    const category = await GuideCategory.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ error: 'Không tìm thấy danh mục.' });
    }

    // Kiểm tra xem có guide nào đang sử dụng category này không
    const guidesCount = await Guide.count({ where: { category_id } });
    if (guidesCount > 0) {
      return res.status(400).json({ 
        error: 'Không thể xóa danh mục này vì đang có hướng dẫn sử dụng.' 
      });
    }

    await category.destroy();

    res.json({ message: 'Xóa danh mục thành công.' });
  } catch (error) {
    console.error('Lỗi khi xóa danh mục:', error);
    res.status(500).json({ error: 'Đã có lỗi xảy ra khi xóa danh mục.' });
  }
};