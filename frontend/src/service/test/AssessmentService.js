import axios from 'axios';
import { apiConfig } from '../../config';

// Use the everywhere else to fetch questions, only professor can access this
const fetchCodingQuestions = (testId) => axios.get(`${apiConfig.baseUrl}/api/test/${testId}/fetch-coding-questions`);

// Use it only inside assessment, it creates a new entry in details table everytime it is called
const fetchCodingQuestionsForTest = (testId) => axios.get(`${apiConfig.baseUrl}/api/test/${testId}/fetch-coding-questions-for-test`);

const addCodingQuestion = (testId, question) => axios.post(`${apiConfig.baseUrl}/api/test/${testId}/add-coding-question`, question);

const addSubjectiveQuestion = (testId, question) => axios.post(`${apiConfig.baseUrl}/api/test/${testId}/add-subjective-question`, question);

const addMcqs = (testId, question) => axios.post(`${apiConfig.baseUrl}/api/test/${testId}/add-mcqs`, question);

const copyAssignment = (testId) => axios.post(`${apiConfig.baseUrl}/api/test/copy-assignment`, { testId });

const addSample = (questionId, sample) => axios.post(`${apiConfig.baseUrl}/api/test/${questionId}/add-sample`, sample);

const deleteSample = (questionId, sampleId) => axios.post(`${apiConfig.baseUrl}/api/test/${questionId}/delete-sample`, { sampleId });

const addTestCase = (questionId, testCase) => axios.post(`${apiConfig.baseUrl}/api/test/${questionId}/add-test-case`, testCase);

const deleteTestCase = (questionId, testCaseId) => axios.post(`${apiConfig.baseUrl}/api/test/${questionId}/delete-test-case`, { testCaseId });

const changeTestCaseVisibility = (questionId, testCaseId, isHidden) => axios.post(`${apiConfig.baseUrl}/api/test/${questionId}/change-test-case-visibility`, { testCaseId, isHidden });

const updateCodingQuestionDetails = (questionId, details) => axios.post(`${apiConfig.baseUrl}/api/test/${questionId}/update-coding-question-details`, details);

const compileAndRun = (details) => axios.post(`${apiConfig.baseUrl}/api/compile/post-single-submission`, details);

const checkCustomStatus = (details) => axios.post(`${apiConfig.baseUrl}/api/compile/get-single-submission`, details);

const submitQuestion = (details) => axios.post(`${apiConfig.baseUrl}/api/compile/submit-question-for-compilation`, details);

const checkSubmitStatus = (details) => axios.post(`${apiConfig.baseUrl}/api/compile/get-submission-result`, details);

const checkFeedbackGiven = (details) => axios.post(`${apiConfig.baseUrl}/api/test/check-feedback-given`, details);

const submitMcq = (answer, mcqId, detailsId) => axios.post(`${apiConfig.baseUrl}/api/test/add-mcq-details`, {
  selectedAnswer: answer,
  mcqId: mcqId,
  detailsId: detailsId,
});

const submitSubjective = (answer, quesId, detailsId) => axios.post(`${apiConfig.baseUrl}/api/test/add-subjective-details`, {
  answer,
  quesId,
  detailsId,
});

const endTest = (details) => axios.post(`${apiConfig.baseUrl}/api/end-test`, details);


const fetchMcqs = (testId) => axios.post(`${apiConfig.baseUrl}/api/test/add-mcqs`, {
  "testId": testId
});

const addFeedbacks = (testId, obj) => axios.post(`${apiConfig.baseUrl}/api/test/${testId}/add-feedbacks`, obj);

const fetchFeedbacks = (testId) => axios.post( `${apiConfig.baseUrl}/api/test/fetch-feedbacks`, testId);

const fetchWarningDetails = (testId) => axios.post( `${apiConfig.baseUrl}/api/fetch-warning-details`, testId);

const fetchCodingQuestionsForStudent = (testId) => axios.get(`${apiConfig.baseUrl}/api/test/${testId}/fetch-coding-questions-for-student`);

const fetchProctoringMode = (testId) => axios.get(`${apiConfig.baseUrl}/api/test/${testId}/fetch-proctoring-mode`);

const fetchDetails = (details) => axios.post(`${apiConfig.baseUrl}/api/fetch-details`, details);

const getScore = (obj) => axios.post(`${apiConfig.baseUrl}/api/test/get-score`, obj);

const uploadScreenshots = (payload) => axios.post(`${apiConfig.baseUrl}/api/test/upload-screenshots`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });

const addWarningDetails = (payload) => axios.post(`${apiConfig.baseUrl}/api/add-warning-details`, payload);

export const assessmentService = {
  addMcqs,
  submitMcq,
  submitSubjective,
  fetchMcqs,
  fetchCodingQuestions,
  addCodingQuestion,
  addSubjectiveQuestion,
  addSample,
  deleteSample,
  addTestCase,
  deleteTestCase,
  changeTestCaseVisibility,
  updateCodingQuestionDetails,
  fetchCodingQuestionsForTest,
  fetchCodingQuestionsForStudent,
  compileAndRun,
  checkCustomStatus,
  submitQuestion,
  checkSubmitStatus,
  addFeedbacks,
  fetchFeedbacks,
  endTest,
  fetchDetails,
  checkFeedbackGiven,
  copyAssignment,
  getScore,
  uploadScreenshots,
  addWarningDetails,
  fetchWarningDetails,
  fetchProctoringMode
};
