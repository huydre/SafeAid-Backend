const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     News:
 *       type: object
 *       properties:
 *         news_id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         thumbnail_path:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         author_id:
 *           type: string
 *     NewsMedia:
 *       type: object
 *       properties:
 *         media_id:
 *           type: integer
 *         media_type:
 *           type: string
 *         media_url:
 *           type: string
 *         order_index:
 *           type: integer
 *         caption:
 *           type: string
 *         news_id:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   - name: News
 *     description: Các endpoint quản lý tin tức
 */

/**
 * @swagger
 * /api/news:
 *   post:
 *     summary: Tạo tin tức mới (upload media)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnail_path:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/News'
 */

/** 
 * @swagger
 * /api/news:
 *   get:
 *     summary: Lấy danh sách tin tức
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách tin tức
 */

/**
 * @swagger
 * /api/news/{news_id}:
 *   get:
 *     summary: Lấy chi tiết tin tức
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: news_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin tin tức
 */

/**
 * @swagger
 * /api/news/{news_id}:
 *   put:
 *     summary: Cập nhật tin tức
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: news_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               thumbnail_path:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */

/**
 * @swagger
 * /api/news/{news_id}:
 *   delete:
 *     summary: Xoá tin tức
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: news_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xoá thành công
 */

// Tạo tin tức mới, có thể upload nhiều media
router.post(
  '/',
  authMiddleware,
  upload.array('media', 5),
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
