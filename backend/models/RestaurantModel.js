const mongoose = require('mongoose');

const ZomatoRestaurant = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cuisines: { type: String, required: true },
  contact: { type: String, required: true },
  house_no: { type: String, required: true },
  st_name: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postal_code: { type: String, required: true },
  cost: { type: String, required: true },
  imagePath: { type: String, required: true },
  cover: { type: String, required: true },
  additional: { type: Array, default: ""},
  status: { type: Boolean, default: false },
  active_stts: { type: String, default: 'Pending' },
}, { collection: 'Restaurants' });

module.exports = mongoose.model('ZomatoRestaurant', ZomatoRestaurant);
