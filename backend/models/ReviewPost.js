const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  content: { type: String, required: true },
  imagePath: { type: String, default:'' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postID: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurants", required: true}
});

module.exports = mongoose.model("Review", reviewSchema);
