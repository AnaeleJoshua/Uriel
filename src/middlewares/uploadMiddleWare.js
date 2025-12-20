// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');
const path = require('path');

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
const fileSize = 5 * 1024 * 1024; // 5MB

// ✅ Configure Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    try {
      const { id } = req.params;
      const ext = path.extname(file.originalname).substring(1);
      const timestamp = Date.now();

      return {
        folder: `user_${id}/avatars`,  // Dynamic folder per user
        public_id: `avatar_${timestamp}`,
        format: ext,
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      };
    } catch (err) {
      console.error('Error in Cloudinary params:', err);
      throw new Error('Error configuring Cloudinary upload.');
    }
  },
});

// ✅ File filter + upload setup
const upload = multer({
  storage,
  limits: { fileSize },
  fileFilter: (req, file, cb) => {
    if (!allowedFileTypes.includes(file.mimetype)) {
      return cb(new Error(`Invalid file type. Only ${allowedFileTypes.join(', ')} allowed.`));
    }
    cb(null, true);
  },
});

module.exports = upload;
