'use strict';
const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-find-or-create');

// Export our mongoose model
const ItemSchema = mongoose.Schema({
  user_api: String, // number? or string
  SKU: String,
  Status: {
    type: String,
    enum: ["in stock","shipped","preparing for shipment","returned in good condition","returned in bad condition"],
    default: "in stock"
  },
  Qty: {
    type: Number,
    min: [0, "no negative values"],
    required: [true, "i need to know your quantity"]
  },
  updated: { type: Date, default: Date.now },
});
ItemSchema.plugin(findOrCreate);

//ItemSchema.statics.Update = function()
// maybe method for updating items?
// Export our mongoose model, with a user name and friends list
module.exports = mongoose.model('Item', ItemSchema);
