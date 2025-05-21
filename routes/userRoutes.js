const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/upload'); // Middleware để xử lý upload file

// Add the upload.single() middleware to handle the avatar file
router.post('/update-avatar', authMiddleware, upload.single('avatar'), userController.updateAvatar);

// Add other user routes
router.get('/',authMiddleware, userController.getUser);
router.put('/', authMiddleware, userController.updateUser);

module.exports = router;