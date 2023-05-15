const User = require("../../models/User");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");

const getTestTaken = (req, res) => {
  // Form validation
  res.setHeader("Access-Control-Allow-Origin", "*");

  const usn = req.body.usn;
  User.find({ usn: usn }, (error, success) => getResponse(error, success, res));
};

const testTaken = (req, res) => {
  // Form validation
  res.setHeader("Access-Control-Allow-Origin", "*");

  const usn = req.body.usn;
  const testId = req.body.testId;

  User.findOneAndUpdate({ usn }, { $push: { tests: testId } }, (error) =>
    getResponse(error, SUCCESS_RESPONSE, res)
  );
};

module.exports = {
  testTaken,
  getTestTaken,
};
