const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isadmin: { type: Boolean, default: false },
  isrest: { type: Boolean, default: false },
  isuser: { type: Boolean, default: false },
  restid: { type: mongoose.Schema.Types.ObjectId,ref: "Restaurants" },
  name: { type: String, default: 'user' }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ZomatoUser", userSchema);
