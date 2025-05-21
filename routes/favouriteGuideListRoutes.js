const express = require('express');
const router = express.Router();
const favouriteGuideListController = require('../controllers/favouriteGuideListController');
const authMiddleware = require('../middlewares/auth');

// Lấy danh sách yêu thích của người dùng
router.get('/', authMiddleware, favouriteGuideListController.getFavouriteList);

// Tạo danh sách yêu thích mới
router.post('/', authMiddleware, favouriteGuideListController.createFavouriteList);

// Xóa danh sách yêu thích
router.delete('/', authMiddleware, favouriteGuideListController.deleteFavouriteList);

module.exports = router;