const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WarningDetailsSchema = new Schema(
{
  LOOKING_AWAY_FROM_SCREEN: {type: Number},
  VOICE_DETECTED: {type: Number},
  PHONE_DETECTED: {type: Number},
  NO_PERSON_DETECTED: {type: Number},
  MULTIPLE_PERSONS_DETECTED: {type: Number},
  FACE_NOT_RECOGNIZED: {type: Number},
  testId: { type: Schema.Types.ObjectId, ref: "tests" },
  studentId: { type: Schema.Types.ObjectId, ref: "users" }
},
{
  versionKey: false,
});

module.exports = {
    WarningDetailsSchema: mongoose.model("warnings", WarningDetailsSchema),
};
