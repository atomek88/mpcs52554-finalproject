'use strict';
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');

const state = {
  db: null,
}

exports.connect = function(url, done) {
  if (state.db) return done()

  mongoose.connect(url, { useMongoClient: true}, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}

module.exports = {
'secret': 'iloveapi',
'database': 'mongodb://artemis:atom@ds113606.mlab.com:13606/athena_api'
}
//export link to db
