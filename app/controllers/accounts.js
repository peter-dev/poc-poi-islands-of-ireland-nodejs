'use strict';
// import required modules
const Boom = require('boom');
const Joi = require('joi');
const User = require('../models/user');
const Utils = require('../utils/utils');

const Accounts = {
  // load main page, disable authentication
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view('main', { title: 'Welcome to Islands of Ireland' });
    }
  },
  // load sign up page, disable authentication
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view('signup', { title: 'Sign up for Islands of Ireland' });
    }
  },
  // load login page, disable authentication
  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view('login', { title: 'Login to Islands of Ireland' });
    }
  },
  // load settings page, enable authentication
  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        if (!user) {
          const message = 'User details not available';
          throw new Boom(message);
        }
        return h.view('settings', { title: 'User Settings', user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  // process sign up form request, disable authentication
  signup: {
    auth: false,
    // enable validation for this handler
    validate: {
      // defines a joi schema which defines rules that our fields must adhere to
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      // handler to invoke if one or more of the fields fails the validation
      failAction: function(request, h, error) {
        return h
          .view('signup', { title: 'Sign up error', errors: error.details })
          .takeover()
          .code(400);
      }
    },
    // main handler for sign up, includes joi validation
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email.toLowerCase());
        if (user) {
          const message = 'Email address is already registered';
          throw new Boom(message);
        }
        const newUser = new User({
          firstName: Utils.capitalize(payload.firstName),
          lastName: Utils.capitalize(payload.lastName),
          email: payload.email.toLowerCase(),
          password: payload.password
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/dashboard');
      } catch (err) {
        return h.view('signup', { errors: [{ message: err.message }] });
      }
    }
  },
  // process login form request, disable authentication
  login: {
    auth: false,
    // enable validation for this handler
    validate: {
      // defines a joi schema which defines rules that our fields must adhere to
      payload: {
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      // handler to invoke if one or more of the fields fails the validation
      failAction: function(request, h, error) {
        return h
          .view('login', { title: 'Sign in error', errors: error.details })
          .takeover()
          .code(400);
      }
    },
    // main handler for login, includes joi validation
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email.toLowerCase());
        if (!user) {
          const message = 'Email address is not registered';
          throw new Boom(message);
        }
        user.comparePassword(payload.password);
        request.cookieAuth.set({ id: user.id });
        return h.redirect('/dashboard');
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  // process update settings request, enable authentication
  updateSettings: {
    // enable validation for this handler
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
          .email()
          .required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false
      },
      // handler to invoke if one or more of the fields fails the validation
      failAction: function(request, h, error) {
        const payload = request.payload;
        return h
          .view('settings', { title: 'Update settings error', errors: error.details, user: payload })
          .takeover()
          .code(400);
      }
    },
    // main handler for update settings, includes joi validation
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        const id = request.auth.credentials.id;
        let user = await User.findById(id);
        user.firstName = Utils.capitalize(payload.firstName);
        user.lastName = Utils.capitalize(payload.lastName);
        user.email = payload.email.toLowerCase();
        user.password = payload.password;
        await user.save();
        return h.redirect('/settings');
      } catch (err) {
        return h.view('settings', { errors: [{ message: err.message }] });
      }
    }
  },
  // process delete account request, enable authentication
  delete: {
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        // if delete checkbox is not set, throw custom error object and pass user in custom payload
        // https://github.com/hapijs/hapi/blob/master/API.md#error-transformation
        if (!payload.delete) {
          const message = 'You need to confirm to delete your account';
          const error = new Boom(message);
          error.output.payload.custom = user;
          throw error;
        }
        // returns deleted object if success, null if error
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
          const message = 'There was an error during delete operation, please try again later';
          const error = new Boom(message);
          error.output.payload.custom = user;
          throw error;
        }
        const message = 'Your account has been deleted successfully';
        request.cookieAuth.clear();
        return h.view('login', { success: { message: message } });
      } catch (err) {
        return h.view('settings', { errors: [{ message: err.message }], user: err.output.payload.custom });
      }
    }
  },
  // logout, redirect to home page
  logout: {
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect('/');
    }
  }
};

module.exports = Accounts;
