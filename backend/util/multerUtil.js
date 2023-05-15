const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { imageUploadPath } = require('../config/keys');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(imageUploadPath, 'materials');
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true });
    cb(null, dir)
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
});

module.exports = multer({ storage: storage });