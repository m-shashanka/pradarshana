const express = require("express");
const router = express.Router();
const { updateTest, fetchTests } = require("../../service/test/testService");
const {
  updateCourse,
  fetchCourses,
  fetchCourse,
  addCourse,
  editCourse,
  addMaterial
} = require("../../service/course/courseService");
const {
  addTestDetails,
  fetchTestDetails,
  endTest,
  addWarningDetails,
  fetchWarningDetails
} = require("../../service/detail/detailService");
const {
  permitAllUsers,
  authorizeStudent,
  authorizeProfessor,
} = require("../../middleware/passportAuth");

const upload = require("../../util/multerUtil");

router.post(
  "/add-details",
  authorizeStudent,
  // uncomment below line once we send id in the request body
  // authorizeOwnership,
  addTestDetails
);

router.post("/fetch-details", permitAllUsers, fetchTestDetails);

router.post("/add-course", authorizeProfessor, upload.single('file'), addCourse);

router.post("/add-material", authorizeProfessor, upload.single('file'), addMaterial);

router.post("/fetch-courses", permitAllUsers, fetchCourses);

router.post("/fetch-course", permitAllUsers, fetchCourse);

router.post("/update-course", authorizeProfessor, updateCourse);

router.post("/edit-course", authorizeProfessor, editCourse);

router.post("/fetch-tests", permitAllUsers, fetchTests);

router.post("/update-test", authorizeProfessor, updateTest);

router.post("/end-test", authorizeStudent, endTest);

router.post("/add-warning-details", authorizeStudent, addWarningDetails);

router.post("/fetch-warning-details", authorizeProfessor, fetchWarningDetails);

module.exports = router;
