const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
{
  difficulty: { type: Number},
  mcqId: { type: Schema.Types.ObjectId, ref: "mcqs"},
  questionId: { type: Schema.Types.ObjectId, ref: "question"},
  subjectiveQuestionId: { type: Schema.Types.ObjectId, ref: "simpleQuestions"},
  studentId: { type: Schema.Types.ObjectId, ref: "users" },
  testId: { type: Schema.Types.ObjectId, ref: "tests" },
  note : {
          type : String,
        },
},
{
  versionKey: false,
});

  module.exports = {
    FeedbackSchema: mongoose.model("feedbacks", FeedbackSchema),
  };
