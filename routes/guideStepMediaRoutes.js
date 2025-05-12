const express = require('express');
const router = express.Router();
const guideStepMediaController = require('../controllers/guideStepMediaController');
const authMiddleware = require('../middlewares/auth');

// Lấy tất cả media của một step
router.get('/step/:step_id', guideStepMediaController.getMediaByStepId);

// Lấy chi tiết một media
router.get('/:media_id', guideStepMediaController.getMediaById);

// Thêm media mới
router.post('/', authMiddleware, guideStepMediaController.createMedia);

// Cập nhật media
router.put('/:media_id', authMiddleware, guideStepMediaController.updateMedia);

// Xóa media
router.delete('/:media_id', authMiddleware, guideStepMediaController.deleteMedia);

module.exports = router;