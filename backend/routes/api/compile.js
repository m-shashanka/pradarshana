const express = require("express");
const router = express.Router();
const { authorizeAdmin } = require("../../middleware/passportAuth");
const { 
    postMultipleSubmission,
    getMultipleSubmission,
    getSingleSubmission,
    postSingleSubmission
} = require("../../service/test/compilationService");


router.post("/submit-question-for-compilation", postMultipleSubmission);
router.post("/get-submission-result", getMultipleSubmission);
router.post("/post-single-submission", postSingleSubmission);
router.post("/get-single-submission", getSingleSubmission);

module.exports = router;
