'use strict';
// import .env
require('dotenv').config();
// import required modules
const Mongoose = require('mongoose');
// connect to the database service
Mongoose.connect(process.env.db);
const db = Mongoose.connection;

/*async function seed() {
  var seeder = require('mais-mongoose-seeder')(Mongoose);
  const data = require('./initdata.json');

  const dbData = await seeder.seed(data, { dropDatabase: false, dropCollections: true });
  console.log(dbData);
}*/
// log fail
db.on('error', function(err) {
  console.log(`database connection error: ${err}`);
});
// log disconnect
db.on('disconnected', function() {
  console.log('database disconnected');
});
// log success
db.once('open', function() {
  console.log(`database connected to ${this.name} on ${this.host}`);
  //seed();
});
