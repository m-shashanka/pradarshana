const {
  TestSchema: Test,
  MCQSchema: MCQ,
  SimpleQuestionSchema: SimpleQuestion,
  QuestionSchema: CodingQuestion,
  TestCaseSchema: TestCase,
  SamplesSchema: SampleTestCase
} = require("../../models/Test");
const { getResponse } = require("../../util/commonReponseUtil");
const { SUCCESS_RESPONSE } = require("../../constants/response");
const keys = require("../../config/keys");
const path = require('path');
const fs = require('fs');

// Creates a new test and adds it to the course
const addNewTest = (req, res) => {
  const newTest = new Test({
    title: req.body.assignment.title,
    courseId: req.body.courseId,
    startDate: req.body.assignment.startDate,
    deadline: req.body.assignment.dueDate,
    tags: req.body.assignment.tags,
    totalAttempts: req.body.assignment.attempts,
    minutes: req.body.assignment.totalTime
  });
  newTest.save();
  return getResponse(null, 
    {
      ...SUCCESS_RESPONSE,
      id: newTest._id
    }, res);
};

// Updates the test with the given id
const editTest = (req, res) => {
  Test.findByIdAndUpdate(
    req.body.assignmentId,
    {
      title: req.body.assignment.title,
      startDate: req.body.assignment.startDate,
      deadline: req.body.assignment.dueDate,
      tags: req.body.assignment.tags,
      totalAttempts: req.body.assignment.attempts,
      minutes: req.body.assignment.totalTime
    },
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
}

// Updates the visibility of test with the given id
const updateTest = (req, res) => {
  Test.findByIdAndUpdate(
    req.body.id,
    { isAccessible: req.body.isAccessible },
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
};

// Updates the proctoring of test with the given id
const updateProctoring = (req, res) => {
  Test.findByIdAndUpdate(
    req.body.id,
    { isProctored: req.body.isProctored },
    (err) => getResponse(err, SUCCESS_RESPONSE, res)
  );
};

const getProctoringMode = async (req, res) => {
  try{
    const test = await Test.findById(req.params.testId);
    return res.status(200).json({isProctored: test.isProctored});
  } catch(e){
    return res.status(404).json({message: 'Test not found'});
  }
}

// Creates a copy of test with new id and adds it to the course
const copyTest = async (req, res) => {

  // Copy Test
  const test = await Test.findById(req.body.testId);
  const newTest = new Test({
    title: `${test.title} - Copy`,
    courseId: test.courseId,
    startDate: test.startDate,
    deadline: test.deadline,
    tags: test.tags,
    totalAttempts: test.totalAttempts,
    minutes: test.minutes
  });
  await newTest.save();

  // Copy Test MCQ Questions
  const mcqs = await MCQ.find({ testId: req.body.testId });
  for (let i = 0; i < mcqs.length; i++) {
    const mcq = mcqs[i];
    const newMcq = new MCQ({
      testId: newTest._id,
      title: mcq.title,
      options: mcq.options,
      description: mcq.description,
      answer: mcq.answer
    });
    await newMcq.save();
  }

  // Copy Test Subjective Questions
  const questions = await SimpleQuestion.find({ testId: req.body.testId });
  for (let i = 0; i < questions.length; i++) {
    const ques = questions[i];
    const newQues = new SimpleQuestion({
      testId: newTest._id,
      title: ques.title,
      description: ques.description,
      expectedAnswer: ques.expectedAnswer
    });
    await newQues.save();
  }

  // Copy Test Coding Questions
  const codingQuestions = await CodingQuestion.find({ testId: req.body.testId });
  for (let i = 0; i < codingQuestions.length; i++) {
    const codingQuestion = codingQuestions[i];
    const newCodingQuestion = new CodingQuestion({
      testId: newTest._id,
      title: codingQuestion.title,
      description: codingQuestion.description,
      inputFormat: codingQuestion.inputFormat,
      outputFormat: codingQuestion.outputFormat,
      codeTemplate: codingQuestion.codeTemplate,
      time: codingQuestion.time,
      lang: codingQuestion.lang,
    });
    await newCodingQuestion.save();

    // Copy Test Coding Question Test Cases
    const testCases = await TestCase.find({ questionId: codingQuestion._id });
    for (let j = 0; j < testCases.length; j++) {
      const testCase = testCases[j];
      const newTestCase = new TestCase({
        questionId: newCodingQuestion._id,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        hidden: testCase.hidden,
      });
      await newTestCase.save();
    }

    // Copy Test Coding Question Sample Test Cases
    const sampleTestCases = await SampleTestCase.find({ questionId: codingQuestion._id });
    for (let j = 0; j < sampleTestCases.length; j++) {
      const sampleTestCase = sampleTestCases[j];
      const newSampleTestCase = new SampleTestCase({
        questionId: newCodingQuestion._id,
        input: sampleTestCase.input,
        output: sampleTestCase.output,
        explanation: sampleTestCase.explanation,
      });
      await newSampleTestCase.save();
    }
  }

  return getResponse(null, {
    ...SUCCESS_RESPONSE,
    id: newTest._id
  }, res);
}

// Fetches all tests of the course
const fetchTests = (req, res) => {
  // courseId
  Test.find({ courseId: req.params.courseId }, (err, tests) =>
    getResponse(err, tests, res)
  );
};

const getImagesForTest = (req, res) => {
  const {testId, usn, imageNumber} = req.query;
  const filePath = path.join(keys.imageUploadPath, 'dataset', testId, usn, imageNumber+'.jpg');
  if (fs.existsSync(filePath))
    res.sendFile(filePath);
  else
    return res.status(404).json({ message: "Image not found" });
}

const uploadScreenshots = async (req, res) => {
  const {testId} = req.body;
  try{
    const count = await Test.countDocuments({_id: testId});
    if(count == 0)
      return res.status(404).json({message: 'Invalid Test Id'});
    for(const file of req.files){
      const dir = path.join(keys.imageUploadPath, testId, 'screenshots', file.originalname.split('_')[0]);
      if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, file.originalname.split('_')[1]), file.buffer);
    }
  }catch(e){
    return res.status(500).json({ message: e.toString() });
  }
  return res.status(200).json({ message: "Screenshots Uploaded Successfully" });
}

module.exports = {
  addNewTest,
  updateTest,
  updateProctoring,
  fetchTests,
  editTest,
  copyTest,
  uploadScreenshots,
  getProctoringMode
};
