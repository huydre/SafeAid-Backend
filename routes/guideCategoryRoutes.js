const express = require('express');
const router = express.Router();
const guideCategoryController = require('../controllers/guideCategoryController');
const authMiddleware = require('../middlewares/auth');

// Lấy danh sách danh mục
router.get('/', guideCategoryController.getCategories);

// Lấy chi tiết một danh mục
router.get('/:category_id', guideCategoryController.getCategoryById);

// Tạo danh mục mới (yêu cầu đăng nhập)
router.post('/', authMiddleware, guideCategoryController.createCategory);

// Cập nhật danh mục
router.put('/:category_id', authMiddleware, guideCategoryController.updateCategory);

// Xóa danh mục
router.delete('/:category_id', authMiddleware, guideCategoryController.deleteCategory);

module.exports = router;