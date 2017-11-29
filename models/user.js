'use strict';
const mongoose = require('mongoose');
//const Schema = mongooseure.Schema;
const findOrCreate = require('mongoose-find-or-create');

// Export our mongoose model
const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
    //unique: true,
    //lowercase: true
  },
  password: {
    type: String,
    default: ""
  },
  token: {
    type: String,
    default: ""
  },
  api_key: {
    type: String,
    default: Math.random().toString(36).substring(2, 15) 
  }
});
UserSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', UserSchema);
