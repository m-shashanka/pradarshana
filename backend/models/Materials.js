const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaterialsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseId: { type: Schema.Types.ObjectId, ref: "courses" },
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("materials", MaterialsSchema);
