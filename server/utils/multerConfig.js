const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mkv|pdf|doc|docx|xls|xlsx/;
    const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidType && isValidMime) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
};

// Multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB file size limit
});

const saveFileMetadata = (file) => {
    console.log({
        originalName: file.originalname,
        size: file.size,
        type: file.mimetype,
        uploadTime: new Date(),
    });
};

module.exports = { 
    upload, 
    saveFileMetadata 
};

