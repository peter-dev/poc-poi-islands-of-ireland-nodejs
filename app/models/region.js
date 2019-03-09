'use strict';
// import required modules
const Mongoose = require('mongoose');
// define mongoose region schema
const regionSchema = new Mongoose.Schema({
  name: String,
  identifier: String,
  geo: {
    lat: String,
    long: String
  }
});
// define and export 'Region' model compiled from Schema definition
module.exports = Mongoose.model('Region', regionSchema);
