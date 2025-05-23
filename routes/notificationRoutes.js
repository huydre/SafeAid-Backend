const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, notificationController.createNotification);
router.get('/', authMiddleware, notificationController.getNotificationsByUser);
router.patch('/:notification_id/read', authMiddleware, notificationController.markAsRead);
module.exports = router;