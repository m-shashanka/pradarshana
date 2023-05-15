const { MCQSchema : MCQs } = require("../../models/Test");
const { MCQDetailsSchema : MCQDetails } = require("../../models/QuestionDetails");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");

const addMCQs = async (req, res) => {
  const { mcqId } = req.body;
  if(!mcqId){
    const newMCQs = new MCQs({
      ...req.body,
      testId: req.params.testId,
    });
    const savedMCQ = await newMCQs.save();
    return getResponse(null, { id: savedMCQ._id, ...SUCCESS_RESPONSE }, res);
  } else {
    const updateMCQ = await MCQs.findByIdAndUpdate(mcqId, {
      ...req.body,
      testId: req.params.testId,
    });
    return getResponse(null, { id: updateMCQ._id, ...SUCCESS_RESPONSE }, res);
  }
};

const fetchMCQs = (req, res) => {
  MCQs.find({ testId: req.body.testId }, (err, MCQss) =>
    getResponse(err, MCQss, res)
  );
};

const fetchMCQsById = (req, res) => {
  MCQs.findById(req.body.mcqId, (err, MCQs) =>
    getResponse(err, MCQs, res)
  );
};

const deleteMCQs = (req, res) => {
  MCQs.remove({ testId: req.body.testId }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const addMcqDetails = async (req, res) => {
  const mcq = await MCQDetails.findOne({mcqId : req.body.mcqId});

  if(!mcq){
    const newMCQDetails = new MCQDetails(req.body);
    const mcq1 = await newMCQDetails.save();  


    return getResponse(null, { id: mcq1._id, ...SUCCESS_RESPONSE }, res);
  }
  else{
    const updateMCQDetails = await MCQDetails.findOneAndUpdate({mcqId : req.body.mcqId}, req.body, {
      new: true
    });
    return getResponse(null, { id: updateMCQDetails._id, ...SUCCESS_RESPONSE }, res);
  } 
};

const checkCorrectMCQsByUser = async (req, res) => {
  console.log("Inside checkCorrectMCQsByUser");
  const { detailsId } = req.body;
  const mcqDetails = await MCQDetails.find({detailsId})
  const finalResult = {}
  for(const mcqDetail in mcqDetails){
    const mcq = await MCQs.findById(mcqDetail.mcqId)
    finalResult.mcqId = mcqDetail.mcqId;
    if (mcq.answer !== mcqDetails.selectedAnswer)
      finalResult.isCorrect = false
    else
      finalResult.isCorrect = true
  } 
  res.status(200).json({ finalResult : finalResult });
};



module.exports = {
  addMCQs,
  fetchMCQs,
  fetchMCQsById,
  deleteMCQs,
  addMcqDetails,
  checkCorrectMCQsByUser
};
