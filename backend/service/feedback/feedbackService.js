const { FeedbackSchema : Feedbacks } = require("../../models/Feedback");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");

const addFeedbacks = async (req, res) => {
  const { feedbacks } = req.body
  for(let feedback of feedbacks){
    const newFeedbacks = new Feedbacks({
      ...feedback,
      testId: req.params.testId,
    });
    await newFeedbacks.save();
  }
  return getResponse(null, { message: 'Successfully Saved', ...SUCCESS_RESPONSE }, res);
};

const fetchFeedbacks = (req, res) => {
  Feedbacks.find({ testId: req.body.testId }, (err, Feedbackss) =>
    getResponse(err, Feedbackss, res)
  );
};

const deleteFeedbacks = (req, res) => {
  Feedbacks.remove({ testId: req.body.testId }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const checkFeedbackGiven = async (req, res) => {
  const { testId, studentId } = req.body;
  const given = await Feedbacks.exists({ testId , studentId})
  
  return getResponse(null, { given , ...SUCCESS_RESPONSE }, res);
};

module.exports = {
  addFeedbacks,
  fetchFeedbacks,
  deleteFeedbacks,
  checkFeedbackGiven
};
