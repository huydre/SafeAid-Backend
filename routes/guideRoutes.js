const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/search', guideController.searchGuides);
// Lấy danh sách hướng dẫn
router.get('/', guideController.getGuides);

// Lấy chi tiết một hướng dẫn
router.get('/:guide_id', guideController.getGuideById);

// Tạo hướng dẫn mới (yêu cầu đăng nhập và có thể upload ảnh thumbnail)
router.post('/', authMiddleware, upload.single('thumbnail'), guideController.createGuide);

// Cập nhật hướng dẫn
router.put('/:guide_id', authMiddleware, upload.single('thumbnail'), guideController.updateGuide);

// Xóa hướng dẫn
router.delete('/:guide_id', authMiddleware, guideController.deleteGuide);

module.exports = router;