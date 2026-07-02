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
  'application/pdf', // ✅ PDF added
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
        'Only jpg, jpeg, png ,pdf and webp images are allowed'
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

// Like singleImageUpload, but does NOT error when no file is sent — lets the
// same route accept either multipart (with a new image) or plain JSON
// (editing other fields only, e.g. toggling isActive).
export const optionalImageUpload = (fieldName = 'image') => [
  upload.single(fieldName),
  async (req, res, next) => {
    if (!req.file) return next();
    try {
      const publicId = crypto.randomUUID();
      const fileName = `${publicId}.webp`;
      const outputPath = path.join(UPLOAD_DIR, fileName);
      await sharp(req.file.buffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      req.uploadedFile = {
        publicId,
        actualPath: outputPath,
        publicPath: `/uploads/${fileName}`,
        fileName,
        mimeType: 'image/webp',
      };
      next();
    } catch (error) {
      console.error('Optional image upload error:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to process image' });
    }
  },
];

export const singleFileUpload = (fieldName = 'file') => [
  upload.single(fieldName),

  async (req, res, next) => {

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const publicId = crypto.randomUUID();

      const ext = req.file.mimetype === 'application/pdf'
        ? 'pdf'
        : 'webp';

      const fileName = `${publicId}.${ext}`;
      const outputPath = path.join(UPLOAD_DIR, fileName);

      let publicPath = `/uploads/${fileName}`;

      // 🖼️ IMAGE PROCESSING
      if (req.file.mimetype.startsWith('image/')) {
        await sharp(req.file.buffer)
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);

        publicPath = `/uploads/${publicId}.webp`;
      }

      // 📄 PDF PROCESSING (NO sharp, direct write)
      else if (req.file.mimetype === 'application/pdf') {
        fs.writeFileSync(outputPath, req.file.buffer);
      }

      req.uploadedFile = {
        publicId,
        actualPath: outputPath,
        publicPath,
        fileName,
        mimeType: req.file.mimetype,
      };

      next();
    } catch (error) {
      console.error('Upload error:', error);

      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to process file',
      });
    }
  },
];
export const multiplePdfUpload = (fieldName = 'files') => [
  upload.array(fieldName, 10), // max 10 PDFs

  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
      }

      const results = [];

      for (const file of req.files) {
        // only pdf allowed here (extra safety)
        if (file.mimetype !== 'application/pdf') continue;

        const publicId = crypto.randomUUID();
        const fileName = `${publicId}.pdf`;
        const outputPath = path.join(UPLOAD_DIR, fileName);

        fs.writeFileSync(outputPath, file.buffer);

        results.push({
          publicId,
          fileName,
          publicPath: `/uploads/${fileName}`,
          mimeType: file.mimetype,
        });
      }

      req.uploadedFiles = results;

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Upload failed',
      });
    }
  },
];