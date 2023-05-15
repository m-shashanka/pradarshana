const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CodingDetailsSchema = new Schema(
  {
    passed: [{ type : Schema.Types.ObjectId, ref: 'testcases' }],
    code: {
      type : String,
      required : true
    },
    time: { type: Date, default: Date.now },
    questionId: { type: Schema.Types.ObjectId, ref: "question"},
    detailsId: { type: Schema.Types.ObjectId, ref: "details" },
  },
  {
    versionKey: false,
  }
);

const MCQDetailsSchema = new Schema(
  {
    selectedAnswer: {
      type : String,
      required : true,
      default : ""
    },
    mcqId: { type: Schema.Types.ObjectId, ref: "mcqs"},
    detailsId: { type: Schema.Types.ObjectId, ref: "details" },
  },
  {
    versionKey: false,
  }
);

const SimpleQuestionDetailsSchema = new Schema(
  {
    answer: {
      type : String,
      required : true,
      default : ""
    },
    quesId: { type: Schema.Types.ObjectId, ref: "simpleQuestions"},
    detailsId: { type: Schema.Types.ObjectId, ref: "details" },
  },
  {
    versionKey: false,
  }
);

module.exports = {
  CodingDetailsSchema: mongoose.model("codingdetails", CodingDetailsSchema),
  MCQDetailsSchema: mongoose.model("mcqdetails", MCQDetailsSchema),
  SimpleQuestionDetailsSchema: mongoose.model("simpledetails", SimpleQuestionDetailsSchema)
};