const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  usn: {
    type: String,
    unique: true,
    required: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [
    {
      type: String,
      required: true,
    },
  ],
  tests: [String],
  enabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("users", UserSchema);
