const express = require('express');
const router = express.Router();
const favouriteGuideItemController = require('../controllers/favouriteGuideItemController');
const authMiddleware = require('../middlewares/auth');

// Thêm hướng dẫn vào danh sách yêu thích
router.post('/', authMiddleware, favouriteGuideItemController.addGuideToFavourite);

// Xóa hướng dẫn khỏi danh sách yêu thích
router.delete('/:guide_id', authMiddleware, favouriteGuideItemController.removeGuideFromFavourite);

module.exports = router;