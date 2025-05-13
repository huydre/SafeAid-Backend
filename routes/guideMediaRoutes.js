const express = require('express');
const router = express.Router({ mergeParams: true }); // Để sử dụng params từ parent route
const guideMediaController = require('../controllers/guideMediaController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Lấy danh sách media của một guide
router.get('/', guideMediaController.getGuideMedia);

// Thêm media cho guide
router.post('/', authMiddleware, upload.single('media'), guideMediaController.addMedia);

// Cập nhật media
router.put('/:media_id', authMiddleware, upload.single('media'), guideMediaController.updateMedia);

// Xóa media
router.delete('/:media_id', authMiddleware, guideMediaController.deleteMedia);

module.exports = router;