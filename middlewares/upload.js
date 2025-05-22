const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Use the user ID for the filename if available, otherwise use a timestamp
    const userId = req.user?.user_id ? req.user.user_id : Date.now();
    const uniqueSuffix = `${userId}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  }
});

// Improved file filter with better error handling
const fileFilter = (req, file, cb) => {
  // Check if the file mimetype indicates it's an image
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'];
  
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    // File is an image, accept it
    cb(null, true);
  } else {
    // File is not an image, reject it with a specific error
    cb(new Error('Chỉ chấp nhận file hình ảnh! Các định dạng cho phép: JPG, PNG, GIF, WEBP'), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB in bytes
};

// Create the multer middleware
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

module.exports = upload;