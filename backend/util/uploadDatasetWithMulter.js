const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { imageUploadPath } = require('../config/keys');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(imageUploadPath, 'dataset', file.originalname.split('$')[0]);
    if (!fs.existsSync(dir))
      fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('$')[1])
  }
});

module.exports = multer({ storage: storage });