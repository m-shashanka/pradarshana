const Details = require("../../models/Details");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");
const mongoose = require("mongoose");
const { TestSchema } = require("../../models/Test");
const { WarningDetailsSchema } = require("../../models/WarningDetails");

/**
 * pass id for this endpoint so that only owner can add their data
 * @param req
 * @param res
 */
const addTestDetails = (req, res) => {
  const query = { usn: req.body.usn, testId: req.body.testId };
  const newData = {
    name: req.body.name,
    usn: req.body.usn,
    passed: req.body.passed,
    code: req.body.code,
    timeConsumed: req.body.timeConsumed,
    feedback: req.body.feedback,
    testId: req.body.testId,
    totalTC: req.body.totalTC,
    FullScreenExitCount: req.body.FullScreenExitCount,
    totalTime: req.body.totalTime,
    endReason: req.body.endReason,
    mcqsResults: req.body.mcqsResults,
    simpleQuestionsResults: req.body.simpleQuestionsResults,
  };

  Details.findOneAndUpdate(query, newData, { upsert: true }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const fetchTestDetails = async (req, res) => {
  const details = await Details.aggregate([
    {
      "$match": {
        testId: mongoose.Types.ObjectId(req.body.testId),
      }
    },
    {
      "$lookup": {
        from: 'codingdetails',
        'localField': '_id',
        'foreignField': 'detailsId',
        'as': 'codingDetails'
      }
    },
    {
      "$lookup": {
        from: 'mcqdetails',
        'localField': '_id',
        'foreignField': 'detailsId',
        'as': 'mcqDetails'
      }
    },
    {
      "$lookup": {
        from: 'simpledetails',
        'localField': '_id',
        'foreignField': 'detailsId',
        'as': 'simpleDetails'
      }
    }
  ]).exec();

  const details2 = await Details.populate(details, {path:'student', model: 'users', select:['name', 'usn']});

  const testDetails = await TestSchema.findOne({_id: req.body.testId});

  getResponse(null, {
    ...SUCCESS_RESPONSE,
    details: details2,
    test: testDetails
  }, res);
};

const endTest = (req, res) => {
  Details.findByIdAndUpdate(req.body.detailsId, {
    fullScreenExitCount: req.body.fullScreenExitCount,
    endReason: req.body.endReason,
    endTime: Date.now(),
  }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
}

const addWarningDetails = (req, res) => {
  const query = { studentId: req.body.userId, testId: req.body.testId };
  const {warningDetails} = req.body;
  const newData = {
    ...warningDetails,
    ...query
  };
  WarningDetailsSchema.findOneAndUpdate(query, newData, { upsert: true }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
}

const fetchWarningDetails = (req, res) => {
  WarningDetailsSchema.find({ testId: req.body.testId }, (err, warnings) =>
    getResponse(err, warnings, res)
  );
}

module.exports = {
  addTestDetails,
  fetchTestDetails,
  endTest,
  addWarningDetails,
  fetchWarningDetails
};
