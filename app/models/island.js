'use strict';
// import required modules
const Mongoose = require('mongoose');
// define mongoose island schema
const islandSchema = new Mongoose.Schema({
  uuid: String,
  name: String,
  identifier: String,
  description: String,
  geo: {
    lat: String,
    long: String
  },
  costalZone: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Region'
  },
  images: [{
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }]
});
// define and export 'Island' model compiled from Schema definition
module.exports = Mongoose.model('Island', islandSchema);
