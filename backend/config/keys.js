const JWT_SECRET = process.env.JWT_SECRET;
const MONGO_URI = process.env.MONGO_URI;
const IMAGE_UPLOAD_PATH = process.env.IMAGE_UPLOAD_PATH;
const COMPILATION_BACKEND_URL = process.env.COMPILATION_BACKEND_URL;

module.exports = {
  mongoURI: MONGO_URI,
  secretOrKey: JWT_SECRET,
  imageUploadPath: IMAGE_UPLOAD_PATH,
  COMPILATION_BACKEND_URL: COMPILATION_BACKEND_URL,
};