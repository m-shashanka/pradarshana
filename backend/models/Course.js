const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "users",
      required: true
    },
    courseId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    isAccessible: { 
      type: Boolean, 
      default: true,
      required: true
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("courses", CourseSchema);
