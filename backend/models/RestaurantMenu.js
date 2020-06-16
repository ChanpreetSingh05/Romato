const mongoose = require("mongoose");

const ZomatoMenu = mongoose.Schema(
  {
    breakfast: [{
      name: {type: String, required: true, default: ""},
      cost: {type: Number, required: true, default: ""},
      imagepath: {type: String, default: ""},
      itemid: { type: mongoose.Schema.Types.ObjectId}
    }],
    lunch: [{
      name: {type: String, required: true, default: ""},
      cost: {type: Number, required: true, default: ""},
      imagepath: {type: String, default: ""},
      itemid: { type: mongoose.Schema.Types.ObjectId}
    }],
    dinner: [{
      name: {type: String, required: true, default: ""},
      cost: {type: Number, required: true, default: ""},
      imagepath: {type: String, default: ""},
      itemid: { type: mongoose.Schema.Types.ObjectId}
    }],
    restid: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurants"},
    restname: {type: String, required: true, default: ""}
  }
  // ,
  // { collection: "zomatomenu" }
);

module.exports = mongoose.model("ZomatoMenu", ZomatoMenu);
