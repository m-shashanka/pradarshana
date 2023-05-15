const { SUCCESS_RESPONSE } = require("../../constants/response");
const User = require("../../models/User");
const { getResponse } = require("../../util/commonReponseUtil");

const changeUserStatus = (ids, enabled, res) => {
  User.updateMany(
    { _id: { $in: ids } },
    { $set: { enabled } },
    { multi: true },
    (error) => getResponse(error, SUCCESS_RESPONSE, res)
  );
};

const activateUsers = (req, res) => {
  const { ids } = req.body;
  changeUserStatus(ids, true, res);
};

const deactivateUsers = (req, res) => {
  const { ids } = req.body;
  changeUserStatus(ids, false, res);
};

module.exports = {
  activateUsers,
  deactivateUsers,
};
