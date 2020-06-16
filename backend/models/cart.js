const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  restid: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurants", required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "zomatousers", required: true },
  restname: { type: String, required: true },
  orders:[{
    name: { type: String, default:true },
    cost: {type: String, default:true},
    itemid: { type: mongoose.Schema.Types.ObjectId, ref: "zomatomenu", required: true }
  }]
});

module.exports = mongoose.model('ZomatoCart', cartSchema);
