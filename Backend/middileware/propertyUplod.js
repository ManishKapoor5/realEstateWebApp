import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudnary.js';

// Storage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'real-estate-properties',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Multer config
const upload = multer({
  storage,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB limit total
  },
});

export default upload;
