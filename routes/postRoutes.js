// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         post_id:
 *           type: string
 *           description: ID của bài viết (UUID).
 *         user_id:
 *           type: string
 *           description: ID của người tạo bài viết.
 *         content:
 *           type: string
 *           description: Nội dung bài viết.
 *         title:
 *           type: string
 *           description: Tiêu đề bài viết.
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       example:
 *         post_id: "550e8400-e29b-41d4-a716-446655440000"
 *         user_id: "user-123"
 *         content: "Nội dung bài viết"
 *         title: "Tiêu đề bài viết"
 *         created_at: "2025-04-13T10:00:00.000Z"
 *         updated_at: "2025-04-13T10:00:00.000Z"
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *       example:
 *         error: "Bạn chưa đăng nhập. Vui lòng cung cấp token."
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Posts
 *     description: Các endpoint quản lý bài viết
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Tạo bài viết mới (có kèm upload ảnh)
 *     description: Tạo bài viết mới trong hệ thống. Yêu cầu xác thực (token Bearer) và cho phép upload tối đa 5 file ảnh với field "images". Nếu không upload ảnh, chỉ cần gửi JSON chứa "content" và (tùy chọn) "title".
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung bài viết.
 *               title:
 *                 type: string
 *                 description: Tiêu đề bài viết.
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Mảng file ảnh (tối đa 5 file).
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Bài viết được tạo thành công.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Dữ liệu không hợp lệ.
 *       401:
 *         description: Bạn chưa đăng nhập hoặc token không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết
 *     description: Trả về danh sách bài viết, hỗ trợ phân trang qua các query parameters: page và limit.
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số bài viết trên mỗi trang.
 *     responses:
 *       200:
 *         description: Danh sách bài viết.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *       500:
 *         description: Lỗi từ server.
 */

/**
 * @swagger
 * /api/posts/{post_id}:
 *   get:
 *     summary: Lấy chi tiết bài viết
 *     description: Trả về thông tin chi tiết của bài viết được xác định bởi post_id, bao gồm thông tin người tạo, danh sách bình luận (với thông tin người bình luận) và lượt thích.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết.
 *     responses:
 *       200:
 *         description: Thông tin chi tiết bài viết.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Không tìm thấy bài viết.
 */

/**
 * @swagger
 * /api/posts/{post_id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     description: Cập nhật nội dung hoặc tiêu đề của bài viết. Yêu cầu xác thực.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần cập nhật.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nội dung mới của bài viết.
 *               title:
 *                 type: string
 *                 description: Tiêu đề mới của bài viết.
 *             example:
 *               content: "Nội dung cập nhật của bài viết."
 *               title: "Tiêu đề cập nhật"
 *     responses:
 *       200:
 *         description: Bài viết được cập nhật thành công.
 *       400:
 *         description: Dữ liệu cập nhật không hợp lệ.
 *       401:
 *         description: Bạn chưa đăng nhập hoặc token không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy bài viết.
 */

/**
 * @swagger
 * /api/posts/{post_id}:
 *   delete:
 *     summary: Xoá bài viết
 *     description: Xoá bài viết dựa trên post_id. Yêu cầu xác thực.
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết cần xoá.
 *     responses:
 *       200:
 *         description: Bài viết đã được xoá thành công.
 *       401:
 *         description: Bạn chưa đăng nhập hoặc token không hợp lệ.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy bài viết.
 */

router.post('/', authMiddleware, upload.array('images', 5), postController.createPost);

// Tạo bài viết mới (yêu cầu xác thực)
router.post('/', authMiddleware, postController.createPost);

// Lấy danh sách bài viết (có thể không yêu cầu xác thực)
router.get('/', postController.getPosts);

// Lấy chi tiết bài viết theo post_id (có thể không yêu cầu xác thực)
router.get('/:post_id', postController.getPostById);

// Cập nhật bài viết (yêu cầu xác thực)
router.put('/:post_id', authMiddleware, postController.updatePost);

// Xoá bài viết (yêu cầu xác thực)
router.delete('/:post_id', authMiddleware, postController.deletePost);

module.exports = router;
