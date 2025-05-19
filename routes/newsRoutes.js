const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');


router.post(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media',     maxCount: 5 }
  ]),
  newsController.createNews
);

// Lấy danh sách tin tức
router.get('/', newsController.getNewsList);

// Lấy chi tiết tin tức
router.get('/:news_id', newsController.getNewsDetail);

// Cập nhật tin tức
router.put('/:news_id', authMiddleware, newsController.updateNews);

// Xoá tin tức
router.delete('/:news_id', authMiddleware, newsController.deleteNews);

module.exports = router;
