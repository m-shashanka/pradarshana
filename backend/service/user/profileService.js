const ROLES = require("../../constants/roles");
const User = require("../../models/User");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE, BAD_REQUEST } = require("../../constants/response");
const bcrypt = require("bcryptjs");

const updateProfile = async (req, res) => {
  const { roles } = req.user;
  const fieldsToUpdate = {};
  const { id, name, password, enabled } = req.body;
  if (password) {
    fieldsToUpdate.password = bcrypt.hashSync(password, 10);
  }
  if (name) {
    fieldsToUpdate.name = name;
  }
  if (roles.includes(ROLES.ADMIN) && enabled != null) {
    fieldsToUpdate.enabled = enabled;
  }
  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ message: BAD_REQUEST });
  }
  User.findByIdAndUpdate(id, fieldsToUpdate, (error) =>
    getResponse(error, SUCCESS_RESPONSE, res)
  );
};

module.exports = {
  updateProfile,
};
