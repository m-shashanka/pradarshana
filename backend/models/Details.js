const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Need to break down this Detail model, as they contain very huge data for a test
// We can have different model for MCQs, descriptive and objective questions
const DetailsSchema = new Schema(
  {
    attempt: Number,
    feedback: Object,
    fullScreenExitCount: Number,
    endReason: String,
    endTime: Date,
    startTime: { type: Date, default: Date.now },
    testId: { type: Schema.Types.ObjectId, ref: "tests" },
    student: { 
      type: Schema.Types.ObjectId, 
      ref: "users",
      required: true
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("details", DetailsSchema);
