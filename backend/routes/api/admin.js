const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { authorizeAdmin } = require("../../middleware/passportAuth");
const {
  activateUsers,
  deactivateUsers,
} = require("../../service/admin/userActivationService");
const {
  addUserByAdmin,
  bulkAddUserByAdmin,
  uploadDataset,
  clearDataset
} = require("../../service/auth/authService");

// const upload = require("../../util/uploadDatasetWithMulter");

router.post("/add-user", authorizeAdmin, addUserByAdmin);

router.post("/bulk-add-user", authorizeAdmin, bulkAddUserByAdmin);

router.post("/enable-users", authorizeAdmin, activateUsers);

router.post("/disable-users", authorizeAdmin, deactivateUsers);

router.post("/upload-dataset", authorizeAdmin, upload.any(), uploadDataset);

router.post("/clear-dataset", authorizeAdmin, clearDataset);

module.exports = router;
