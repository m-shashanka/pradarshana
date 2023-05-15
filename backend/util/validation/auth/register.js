const { check } = require("express-validator");
const { validate } = require("../common");

const validateRegister = validate([
  check("password")
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    )
    .withMessage(
      "Password must have at least 8 chars and should contain at least one number, one small case letter one cap and one special character"
    ),
  check("email").isEmail().withMessage("Invalid email"),
  check("password2").custom((password2, { req }) => {
    if (password2 !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),
  check("roles").custom((roles, { req }) => {
    if (roles.length === 0) {
      throw new Error("Must select at least one role");
    }
    if (roles.includes("student") && (!req.body.usn || req.body.usn.length < 8)) {
      throw new Error("USN is required for student");
    }
    return true;
  }),
  check("name").isLength({ min: 3 }),
]);

module.exports = {
  validateRegister,
};
