const { check } = require("express-validator");
const { validate } = require("../common");

const validateLogin = validate([
  check("email").isEmail().withMessage("Invalid email"),
]);

module.exports = {
  validateLogin,
};
