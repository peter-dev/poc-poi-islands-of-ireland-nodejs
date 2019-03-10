'use strict';
// import env
const dotenv = require('dotenv');
// read .env file, parse the contents, assign it to process.env object
const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  process.exit(1);
}

const Hapi = require('hapi');
// create a server with a host and port
const server = Hapi.server({
  host: 'localhost',
  port: 3000
});
// import database connection
require('./app/models/db');
// start the server
const start = async function() {
  try {
    await server.register(require('inert'));
    await server.register(require('vision'));
    await server.register(require('hapi-auth-cookie'));
    // vision templates rendering plugin configuration
    server.views({
      engines: {
        hbs: require('handlebars')
      },
      relativeTo: __dirname,
      path: './app/views',
      layoutPath: './app/views/layouts',
      partialsPath: './app/views/partials',
      layout: true,
      isCached: false,
      // register helper method to be used in templates
      // https://hapijs.com/tutorials/views ->View helpers
      helpersPath: './app/helpers'
    });
    // hapi-auth-cookie configuration
    server.auth.strategy('standard', 'cookie', {
      password: process.env.cookie_password,
      cookie: process.env.cookie_name,
      isSecure: false,
      ttl: 24 * 60 * 60 * 1000,
      redirectTo: '/'
    });
    // guard all routes with cookie based authentication mechanism
    server.auth.default({
      mode: 'required',
      strategy: 'standard'
    });
    // add the routes
    server.route(require('./routes'));
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

start();
