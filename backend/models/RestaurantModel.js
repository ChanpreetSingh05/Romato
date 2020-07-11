const mongoose = require('mongoose');

const ZomatoRestaurant = mongoose.Schema({
  name: { type: String, required: true },
  cuisines: { type: String, required: true },
  contact: { type: Number, required: true },
  house_no: { type: String, required: true },
  st_name: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postal_code: { type: String, required: true },
  cost: { type: String, required: true },
  breakfast: { type: Boolean, default: true },
  takeout: { type: Boolean, default: true },
  alcohol: { type: Boolean, default: true },
  parking: { type: Boolean, default: true },
  indoor_seating: { type: Boolean, default: true },
  outdoor_seating: { type: Boolean, default: true },
  kids: { type: Boolean, default: true },
  wifi: { type: Boolean, default: true },
  imagePath: { type: String, required: true },
  cover: { type: String, required: true },
  status: { type: Boolean, default: true }
}, { collection: 'Restaurants' });

module.exports = mongoose.model('ZomatoRestaurant', ZomatoRestaurant);
