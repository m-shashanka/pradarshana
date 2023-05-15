const axios = require('axios');
const keys = require('../../config/keys');
const { QuestionSchema: Question } = require("../../models/Test");
const { CodingDetailsSchema: CodingDetails } = require("../../models/QuestionDetails");
const { TestCaseSchema: TestCase } = require("../../models/Test");
const mongoose = require("mongoose");

const headers = {};

const getSingleSubmission = async (req, res) => {
  const { submissionToken } = req.body;
  try {
    const resp = await axios.get(`${keys.COMPILATION_BACKEND_URL}/submissions/${submissionToken}`, {
      headers
    });

    return res.send(resp.data);
  }
  catch (e) {
    res.status(500).send({
      "stderr": "error with submission",
      "status": {
        "id": 12
      }
    })
  }
}

const postSingleSubmission = async (req, res) => {
  const goingReq = req.body;
  goingReq['enable_network'] = true;
  try {
    const resp = await axios.post(`${keys.COMPILATION_BACKEND_URL}/submissions`, goingReq, {
      headers
    })
    return res.send(resp.data);
  }
  catch (e) {
    return res.status(500).send({
      "stderr": "error with submission",
      "status": 12
    })
  }
}
const getMultipleSubmission = async (req, res) => {
  const { submissionTokens, questionId, detailsId } = req.body;
  const resp = await axios.get(`${keys.COMPILATION_BACKEND_URL}/submissions/batch?tokens=${submissionTokens}&base612_encoded=false&fields=token,stdout,stderr,status_id,language_id,source_code`, {
    headers
  })

  // Fetch all the testcases of the question
  const testCases = await TestCase.find({ questionId });

  const passed = [];
  let i = 0;
  for (const sub of resp.data.submissions) {
    if (sub.status_id === 3)
      passed.push(testCases[i]._id);
    i++;
  }

  // Add to coding question details
  //Record time

  await CodingDetails.findOneAndUpdate({
    questionId, detailsId
  }, {
    code: resp.data.submissions[0].source_code,
    passed,
    time: Date.now()
  }, {
    new: true,
    upsert: true,
  });


  //Remove stdout and std err for hidden testcases

  //send back updated response

  return res.send({
    submissions: resp.data.submissions.map((s, index) => (
      testCases[index].hidden ? { status_id: s.status_id } : s
    )),
    lastSaved: Date.now()
  });

}

const postMultipleSubmission = async (req, res) => {
  const { source_code, question_id } = req.body;

  //code to get mongo db input output
  const question = await Question.aggregate([
    {
      "$match": {
        _id: mongoose.Types.ObjectId(question_id),
      },
    },
    {
      "$lookup": {
        from: 'testcases',
        'localField': '_id',
        'foreignField': 'questionId',
        'as': 'testCases'
      }
    }
  ]).exec();

  var batchSubmission = []

  question[0].testCases.forEach(input => {
    console.log(input)
    batchSubmission.push({
      source_code,
      language_id: question[0].lang,
      stdin: input.input,
      expected_output: input.expectedOutput,
      cpu_time_limit: "3",
      enable_network: true
    })
  });
  try {
    batchSubmissionReq = { "submissions": batchSubmission }
    const resp = await axios.post(`${keys.COMPILATION_BACKEND_URL}/submissions/batch`, batchSubmissionReq, {
      headers
    })
    return res.send(resp.data);
  }
  catch (e) {
    return res.status(500).send({
      "stderr": "error with submission",
      "status": 12
    })
  }

}

module.exports = {
  getSingleSubmission,
  postSingleSubmission,
  getMultipleSubmission,
  postMultipleSubmission
}
