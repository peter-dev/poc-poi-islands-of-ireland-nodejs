'use strict';
// import required modules
const Boom = require('boom');
const Mongoose = require('mongoose');
// define mongoose user schema
const userSchema = new Mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String
});
// define static method associated with a Schema
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email });
};
// define instance method associated with an Object
userSchema.methods.comparePassword = function(candidatePassword) {
  const isMatch = this.password === candidatePassword;
  if (!isMatch) {
    throw new Boom('Password mismatch');
  }
  return this;
};
// define and export 'User' model compiled from Schema definition
module.exports = Mongoose.model('User', userSchema);
