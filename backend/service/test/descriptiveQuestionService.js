const { SimpleQuestionSchema } = require("../../models/Test");
const { SimpleQuestionDetailsSchema: SimpleDetails } = require("../../models/QuestionDetails");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");
const axios = require('axios');

const fetchSimpleQuestions = (req, res) => {
  SimpleQuestionSchema.find({ testId: req.body.testId }, (err, questions) =>
    getResponse(err, questions, res)
  );
};

const deleteSimpleQuestions = (req, res) => {
  SimpleQuestionSchema.remove({ testId: req.body.testId }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const addSimpleDetails = async (req, res) => {
  const ques = await SimpleDetails.findOne({quesId : req.body.quesId});

  if(!ques){
    const newSimpleDetails = new SimpleDetails(req.body);
    const ques1 = await newSimpleDetails.save();  

    return getResponse(null, { id: ques1._id, ...SUCCESS_RESPONSE }, res);
  }
  else{
    const updateSimpleDetails = await SimpleDetails.findOneAndUpdate({quesId : req.body.quesId}, req.body, {
      new: true
    });
    return getResponse(null, { id: updateSimpleDetails._id, ...SUCCESS_RESPONSE }, res);
  } 
};

const addSimpleQuestion = async (req, res) => {
  const { quesId } = req.body;
  if(!quesId){
    const newQuestion = new SimpleQuestionSchema({
      ...req.body,
      testId: req.params.testId,
    });
    const savedQuestion = await newQuestion.save();
    return getResponse(null, { id: savedQuestion._id, ...SUCCESS_RESPONSE }, res);
  } else {
    const updateQuestion = await SimpleQuestionSchema.findByIdAndUpdate(quesId, {
      ...req.body,
      testId: req.params.testId,
    });
    return getResponse(null, { id: updateQuestion._id, ...SUCCESS_RESPONSE }, res);
  }
};

const updateSimpleQuestion = (req, res) => {
  SimpleQuestionSchema.findByIdAndUpdate(
    req.params.questionId,
    {
      ...req.body
    },
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
}

const getScore = async (req,res) =>{
  const {studentAns, expectedAns} = req.body;
  try{
    const response = await axios.post('http://172.1.14.168:5000',{
      expected: expectedAns,
      answer: studentAns,
      key: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    });
    let score = response.data.score;
    score = +score/100;
    return getResponse(null, {score}, res);
  } catch(e){
    return getResponse(null, {score: -1}, res);
  }
}

module.exports = {
  fetchSimpleQuestions,
  deleteSimpleQuestions,
  addSimpleQuestion,
  updateSimpleQuestion,
  addSimpleDetails,
  getScore
};
