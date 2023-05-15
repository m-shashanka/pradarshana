const express = require("express");
const multer = require('multer');
const upload = multer();
const router = express.Router();
const { addNewTest, editTest, updateTest, updateProctoring, getProctoringMode, copyTest, uploadScreenshots } = require("../../service/test/testService");
const {
  deleteSimpleQuestions,
  fetchSimpleQuestions,
  addSimpleQuestion,
  addSimpleDetails,
  getScore
} = require("../../service/test/descriptiveQuestionService");
const {
  deleteMCQs,
  fetchMCQs,
  fetchMCQsById,
  addMCQs,
  addMcqDetails,
  checkCorrectMCQsByUser
} = require("../../service/test/objectiveQuestionService");
const {
  addCodingQuestion,
  fetchCodingQuestionsForTest,
  deleteCodingQuestion,
  deleteTestCase,
  addTestCases,
  changeTestCaseVisibility,
  updateCodingQuestion,
  addSample,
  deleteSample,
  fetchCodingQuestions,
  fetchCodingQuestionsForStudent
} = require("../../service/test/codingQuestionService");

const {
  addFeedbacks,
  fetchFeedbacks,
  deleteFeedbacks,
  checkFeedbackGiven
} = require("../../service/feedback/feedbackService");

const {
  authorizeProfessor,
  permitAllUsers,
  authorizeStudent
} = require("../../middleware/passportAuth");

router.post("/add", authorizeProfessor, addNewTest);

router.post("/copy-assignment", authorizeProfessor, copyTest);

router.post("/update-assignment", authorizeProfessor, editTest);

router.post("/change-assignment-visibility", authorizeProfessor, updateTest);

router.post("/change-assignment-proctoring", authorizeProfessor, updateProctoring);

router.get("/:testId/fetch-proctoring-mode", permitAllUsers, getProctoringMode);

router.post("/add-mcqs", authorizeProfessor, addMCQs);
router.post("/:testId/add-mcqs", authorizeProfessor, addMCQs);

router.post("/:testId/add-feedbacks", permitAllUsers, addFeedbacks);

router.post("/:testId/add-subjective-question", authorizeProfessor, addSimpleQuestion);

router.post("/:testId/add-coding-question", authorizeProfessor, addCodingQuestion);

router.post("/:questionId/add-test-case", authorizeProfessor, addTestCases);

router.post("/:questionId/delete-test-case", authorizeProfessor, deleteTestCase);

router.post("/:questionId/change-test-case-visibility", authorizeProfessor, changeTestCaseVisibility);

router.post("/:questionId/update-coding-question-details", authorizeProfessor, updateCodingQuestion);

router.post("/:questionId/add-sample", authorizeProfessor, addSample);

router.post("/:questionId/delete-sample", authorizeProfessor, deleteSample);

router.get("/:courseId/fetch-coding-questions", authorizeProfessor, fetchCodingQuestions);

router.get("/:courseId/fetch-coding-questions-for-test", permitAllUsers, fetchCodingQuestionsForTest);

router.get("/:courseId/fetch-coding-questions-for-student", permitAllUsers, fetchCodingQuestionsForStudent);

router.post("/fetch-mcqs", permitAllUsers, fetchMCQs);

router.post("/fetch-mcqs-by-id", permitAllUsers, fetchMCQsById);

router.post("/fetch-feedbacks", permitAllUsers, fetchFeedbacks);

router.post("/fetch-simpleQuestions", permitAllUsers, fetchSimpleQuestions);

router.post("/get-score", authorizeProfessor, getScore);

router.post("/upload-screenshots", authorizeStudent, upload.any(), uploadScreenshots);

router.post("/delete-questions", authorizeProfessor, deleteCodingQuestion);

router.post("/delete-mcqs", authorizeProfessor, deleteMCQs);

router.post("/delete-feedbacks", authorizeProfessor, deleteFeedbacks);

router.post("/add-mcq-details", permitAllUsers, addMcqDetails);

router.post("/add-subjective-details", permitAllUsers, addSimpleDetails);

router.post("/check-correct-mcqs-by-user", permitAllUsers, checkCorrectMCQsByUser);

router.post("/check-feedback-given", permitAllUsers, checkFeedbackGiven);

router.post("/delete-simpleQuestions",authorizeProfessor,deleteSimpleQuestions);

module.exports = router;
