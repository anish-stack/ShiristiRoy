// middleware/upload.js

import multer from 'multer';
import sharp from 'sharp';

import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Upload folder
const UPLOAD_DIR = path.join(
  process.cwd(),
  'public',
  'uploads'
);

// Create folder if not exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, {
    recursive: true,
  });
}

// Memory storage for sharp processing
const storage = multer.memoryStorage();

// Allowed image types
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// File filter
const fileFilter = (req, file, cb) => {
  if (
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only jpg, jpeg, png and webp images are allowed'
      )
    );
  }
};

// Multer upload
export const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Image upload middleware with sharp
export const singleImageUpload = (
  fieldName = 'image'
) => [
  upload.single(fieldName),

  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image uploaded',
        });
      }

      const publicId =
        crypto.randomUUID();

      const fileName = `${publicId}.webp`;

      const outputPath = path.join(
        UPLOAD_DIR,
        fileName
      );

      // Compress + convert image
      await sharp(req.file.buffer)
        .resize({
          width: 1600,
          withoutEnlargement: true,
        })
        .webp({
          quality: 80,
        })
        .toFile(outputPath);

      // Public path
      const publicPath = `/uploads/${fileName}`;

      // Attach uploaded file info
      req.uploadedFile = {
        publicId,

        actualPath: outputPath,

        publicPath,

        fileName,

        mimeType: 'image/webp',
      };

      next();
    } catch (error) {
      console.error(
        'Image upload error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          'Failed to process image',
      });
    }
  },
];