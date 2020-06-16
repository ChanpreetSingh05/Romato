const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  restid: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurants", required: true },
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "zomatousers", required: true },
  restname: { type: String, required: true },
  orders:[{
    name: { type: String   },
    cost: {type: String },
    itemid: { type: mongoose.Schema.Types.ObjectId, ref: "zomatomenu" }
  }],
  info:[{
    name: { type: String, default:'', required: true  },
    phone: {type: String, default:'', required: true },
    address: { type: String, required: true }
  }],
  status: { type: String, default:'pending', required: true  },
});

module.exports = mongoose.model('ZomatoOrders', cartSchema);
