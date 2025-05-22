const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/auth');

router.post('/', notificationController.createNotification);
router.get('/', authMiddleware, notificationController.getNotificationsByUser);

module.exports = router;