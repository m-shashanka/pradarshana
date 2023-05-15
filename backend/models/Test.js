const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    title: String,
    description: String,
    inputFormat: String,
    outputFormat: String,
    codeTemplate: String,
    time: Object,
    lang: String,
    testId: { type: Schema.Types.ObjectId, ref: "tests" },
  },
  {
    versionKey: false,
  }
);

const TestCaseSchema = new Schema(
  {
    input: String,
    expectedOutput: String,
    hidden: Boolean,
    questionId:{ type: Schema.Types.ObjectId, ref: "question" },
  },
  {
    versionKey: false,
  }
);

const SamplesSchema = new Schema(
  {
    input: String,
    output: String,
    explanation: String,
    questionId:{ type: Schema.Types.ObjectId, ref: "question" },
  },
  {
    versionKey: false,
  }
);

const MCQSchema = new Schema(
  {
    title: String,
    description: String,
    options: [String],
    answer: Number,
    testId: { type: Schema.Types.ObjectId, ref: "tests" },
  },
  {
    versionKey: false,
  }
);

const SimpleQuestionSchema = new Schema(
  {
    simpleQuestionId: Number,
    title: String,
    description: String,
    expectedAnswer: String,
    testId: { type: Schema.Types.ObjectId, ref: "tests" },
  },
  {
    versionKey: false,
  }
);

const TestSchema = new Schema(
  {
    title: String,
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date, default: Date.now },
    courseId: { type: Schema.Types.ObjectId, ref: "courses" },
    isAccessible: { type: Boolean, default: false },
    isProctored: { type: Boolean, default: false },
    minutes: {type: Number, required: true},
    tags: {
      type: [String],
      default: [],
    },
    totalAttempts: { type: Number, required: true },
  },
  {
    versionKey: false,
  }
);

module.exports = {
  QuestionSchema: mongoose.model("question", QuestionSchema),
  TestSchema: mongoose.model("tests", TestSchema),
  TestCaseSchema: mongoose.model("testcases", TestCaseSchema),
  SamplesSchema: mongoose.model("samples", SamplesSchema),
  MCQSchema: mongoose.model("mcqs", MCQSchema),
  SimpleQuestionSchema: mongoose.model("simpleQuestions", SimpleQuestionSchema),
};
