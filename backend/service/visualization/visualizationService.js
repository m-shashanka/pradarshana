const { QuestionSchema: Question, TestSchema: Test, MCQSchema: MCQs, SimpleQuestionSchema: SimpleQuestion } = require("../../models/Test");
const Details = require("../../models/Details");
const { TestCaseSchema: TestCase } = require("../../models/Test");
const { SamplesSchema: Sample } = require("../../models/Test");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");
const mongoose = require("mongoose");

let feedbacks = [{
    difficulty: 3,
    mcqId: '123451',
    questionId: "",
    detailsId: '12345671',
    note : 'Exam was moderately tough'
},{
    difficulty: 4,
    mcqId: '',
    questionId: "1234561",
    detailsId: '12345671',
    note : 'Exam was tough'
},{
    difficulty: 2,
    mcqId: '123452',
    questionId: "",
    detailsId: '12345671',
    note : 'Exam was not tough'
},{
    difficulty: 5,
    mcqId: '',
    questionId: "1234562",
    detailsId: '12345671',
    note : 'Exam was very tough'
},{
    difficulty: 3,
    mcqId: '123451',
    questionId: "",
    detailsId: '12345672',
    note : 'Exam was moderately tough'
},{
    difficulty: 4,
    mcqId: '',
    questionId: "1234561",
    detailsId: '12345672',
    note : 'Exam was tough'
},{
    difficulty: 2,
    mcqId: '123452',
    questionId: "",
    detailsId: '12345672',
    note : 'Exam was not tough'
},{
    difficulty: 5,
    mcqId: '',
    questionId: "1234562",
    detailsId: '12345672',
    note : 'Exam was very tough'
},];

const details = [{
    _id : '12345671',
    attempt: 2,
    feedback: "",
    fullScreenExitCount: 1,
    endReason: "String",
    endTime: 5,
    startTime: 10,
    testId: '121',
    student: 'Himangshu',
},{
    _id : '12345672',
    attempt: 2,
    feedback: "",
    fullScreenExitCount: 1,
    endReason: "String",
    endTime: 5,
    startTime: 10,
    testId: '122',
    student: 'Jhabar',
}]

const fetchDifficultAreasByTags = (req, res) => {
  
};

const fetchDifficultyByFeedbacks = (req, res) => {
  
};

const updateCodingQuestion = (req, res) => {
  Question.findByIdAndUpdate(
    req.params.questionId,
    {
      ...req.body
    },
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
}

const addTestCases = (req, res) => {
  const newTestCase = new TestCase({
    ...req.body,
    questionId: req.params.questionId,
  });
  newTestCase.save();
  return getResponse(null, { id: newTestCase._id, ...SUCCESS_RESPONSE }, res);
};

const deleteTestCase = (req, res) => {
  TestCase.findByIdAndRemove(req.body.testCaseId, (err) => {
    getResponse(err, SUCCESS_RESPONSE, res);
  });
};

const changeTestCaseVisibility = (req, res) => {
  TestCase.findByIdAndUpdate(req.body.testCaseId, {
    hidden: req.body.isHidden
  }, (err) => {
    getResponse(err, SUCCESS_RESPONSE, res);
  })
};

const addSample = (req, res) => {
  const newSample = new Sample({
    ...req.body,
    questionId: req.params.questionId,
  });
  newSample.save();
  return getResponse(null, { id: newSample._id, ...SUCCESS_RESPONSE }, res);
};

const deleteSample = (req, res) => {
  Sample.findByIdAndRemove(req.body.sampleId, (err) => {
    getResponse(err, SUCCESS_RESPONSE, res);
  });
};

const fetchCodingQuestionForTest = (req, res) => {
  Question.aggregate([
    {
      "$match": {
        testId: mongoose.Types.ObjectId(req.params.courseId),
      },
    },
    {
      "$lookup": {
        from: 'testcases',
        'localField': '_id',
        'foreignField': 'questionId',
        'as': 'testCases'
      }
    },
    {
      "$lookup": {
        from: 'samples',
        'localField': '_id',
        'foreignField': 'questionId',
        'as': 'samples'
      }
    }
  ]).exec((err, questions) => {
    getResponse(err, questions, res);
  });
};

const fetchCodingQuestions = async (req, res) => {
  const test = await Test.findById(req.params.courseId);
  if (test) {
    // Verify if the test window is still open
    const startDate = new Date(test.startDate);
    const endDate = new Date(test.deadline);
    const now = new Date();
    if (startDate <= now && now <= endDate) {
      // Verify if the student has attempts left
      const count = await Details.count({ testId: test._id, student: req.user._id });
      if (count < test.totalAttempts) {
        const newDetails = new Details({
          attempt: count + 1,
          testId: test._id,
          student: req.user._id
        });
        newDetails.save();
        Question.aggregate([
          {
            "$match": {
              testId: mongoose.Types.ObjectId(req.params.courseId),
            },
          },
          {
            "$lookup": {
              from: 'testcases',
              'localField': '_id',
              'foreignField': 'questionId',
              'as': 'testCases'
            }
          },
          {
            "$lookup": {
              from: 'samples',
              'localField': '_id',
              'foreignField': 'questionId',
              'as': 'samples'
            }
          }
        ]).exec(async (err, questions) => {
          const maskedQuestions = questions.map(question => {
            return {
              ...question,
              testCases: question.testCases.map(testCase => {
                return testCase.hidden ? { hidden: true, _id: testCase._id } : testCase
              })
            }
          });
          
          const mcqQuestions = await MCQs.find({testId: test._id});

          const simpleQuestions = await SimpleQuestion.find({testId: test._id})

          getResponse(err, {
            details: newDetails,
            codingQuestions: maskedQuestions,
            mcqQuestions: mcqQuestions,
            simpleQuestions
          }, res);
        });
      }
      else {
        res.status(500).json({ message: 'No Attempts left' });
      }

    }
    else {
      res.status(500).json({ message: 'Test time window is not open' });
    }
  }
};

const deleteCodingQuestion = (req, res) => {
  Question.remove({ testId: req.body.testId }, (err) =>
    getResponse(err, SUCCESS_RESPONSE, res)
  );
};

module.exports = {
  addCodingQuestion,
  fetchCodingQuestionForTest,
  deleteCodingQuestion,
  addTestCases,
  deleteTestCase,
  changeTestCaseVisibility,
  updateCodingQuestion,
  addSample,
  deleteSample,
  fetchCodingQuestions
};
