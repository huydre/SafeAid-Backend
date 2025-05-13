const express = require('express');
const router = express.Router();
const guideStepController = require('../controllers/guideStepController');
const authMiddleware = require('../middlewares/auth');

// Lấy tất cả các bước của một guide
router.get('/guide/:guide_id', guideStepController.getStepsByGuideId);

// Lấy chi tiết một bước
router.get('/:step_id', guideStepController.getStepById);

// Tạo bước mới
router.post('/', authMiddleware, guideStepController.createStep);

// Cập nhật bước
router.put('/:step_id', authMiddleware, guideStepController.updateStep);

// Xóa bước
router.delete('/:step_id', authMiddleware, guideStepController.deleteStep);

module.exports = router;