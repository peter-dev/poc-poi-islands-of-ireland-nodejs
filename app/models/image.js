'use strict';
// import required modules
const Mongoose = require('mongoose');
// define mongoose image schema
const imageSchema = new Mongoose.Schema({
  data: Buffer,
  name: String,
  uuid: String
});
// define and export 'Image' model compiled from Schema definition
module.exports = Mongoose.model('Image', imageSchema);
