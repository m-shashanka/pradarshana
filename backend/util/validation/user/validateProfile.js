const { check } = require("express-validator");
const { validate } = require("../common");

const validateProfileUpdate = validate([
  check("id").exists().withMessage("Id is required"),
  check("password")
    .optional()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/
    )
    .withMessage(
      "Password must have at least 8 chars and should contain at least one small, cap, special character"
    ),
  check("name").optional().isLength({ min: 3 }),
  check("enabled").optional().isBoolean().withMessage("Should be boolean"),
]);

module.exports = {
  validateProfileUpdate,
};
