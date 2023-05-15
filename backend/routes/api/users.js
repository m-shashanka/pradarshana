const express = require("express");
const router = express.Router();
const { login, register } = require("../../service/auth/authService");
const { updateProfile } = require("../../service/user/profileService");
const {
  getTestTaken,
  testTaken,
} = require("../../service/test/testLookUpService");
const {
  permitAllUsers,
  authorizeOwnership,
} = require("../../middleware/passportAuth");
const { validateRegister } = require("../../util/validation/auth/register");
const { validateLogin } = require("../../util/validation/auth/login");
const {
  validateProfileUpdate,
} = require("../../util/validation/user/validateProfile");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", validateRegister, register);

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", validateLogin, login);

router.post("/testTaken", permitAllUsers, testTaken);

router.post("/getTestTaken", permitAllUsers, getTestTaken);
/**
 * currently can only update the password.
 * and only Admin can enable the user.
 */
router.post(
  "/updateUser",
  permitAllUsers,
  authorizeOwnership,
  validateProfileUpdate,
  updateProfile
);

module.exports = router;
