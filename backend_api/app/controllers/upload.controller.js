const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'temp_uploads/'); // Temp directory for uploads
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname)); // UUID as filename
    },
    onError: (err, next) => {
        console.log('Failed to write file', err);
        next(err);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
