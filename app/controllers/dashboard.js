'use strict';
// import .env
require('dotenv').config();
// import required modules
const Boom = require('boom');
const Joi = require('joi');
const User = require('../models/user');
const Region = require('../models/region');
const Island = require('../models/island');
const Image = require('../models/image');
const Utils = require('../utils/utils');

const Dashboard = {
  // load user dashboard page, enable authentication
  showDashboard: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const islands = await Island.find({})
          .populate('costalZone')
          .populate('images', 'uuid'); //populate uuid for images only
        // convert to plain js object and enhance result to add 'category' field required by semantic ui search control
        const jsIslands = islands.map(function(model) {
          return model.toObject();
        });
        // enhance result to add 'category' field required by semantic ui search control
        jsIslands.forEach(island => {
          island.category = island.costalZone.name;
        });
        // convert enhanced collection into string json to be used by semantic ui search control
        const jsonIslands = JSON.stringify(jsIslands);
        return h.view('dashboard', {
          title: 'Islands of Ireland',
          user: user,
          jsonIslands: jsonIslands,
          apiKey: process.env.google_api_key
        });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  },
  // load add island page, enable authentication
  showCreate: {
    handler: async function(request, h) {
      let regions;
      try {
        // get list of categories / regions, reduce the result to 'name' field only
        regions = await Region.find({}, 'name');
        return h.view('create', { title: 'Add Island', categories: regions });
      } catch (err) {
        return h.view('create', { title: 'Add Island', categories: regions, errors: [{ message: err.message }] });
      }
    }
  },
  // process add island request, enable authentication
  create: {
    // configure form encoding type
    payload: {
      output: 'stream',
      allow: 'multipart/form-data'
    },
    // enable validation for this handler
    validate: {
      payload: {
        region: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        lat: Joi.number()
          .precision(6)
          .required(),
        long: Joi.number()
          .precision(6)
          .required(),
        file: Joi.any().optional()
      },
      options: {
        abortEarly: false
      },
      // handler to invoke if one or more of the fields fails the validation
      failAction: async function(request, h, error) {
        const payload = request.payload;
        payload.file = undefined;
        // get list of categories / regions, reduce the result to 'name' field only
        const regions = await Region.find({}, 'name');
        return h
          .view('create', { title: 'Add Island', errors: error.details, categories: regions, payload: payload })
          .takeover()
          .code(400);
      }
    },
    // main handler for add island, includes joi validation
    // https://medium.com/today-i-learned-chai/how-to-upload-files-with-node-js-hapi-js-c788b5c8586a
    // https://medium.com/@alvenw/how-to-store-images-to-mongodb-with-node-js-fb3905c37e6d
    handler: async function(request, h) {
      let regions;
      try {
        const payload = request.payload;
        // process form input and map into models
        const region = await Region.findOne({ name: payload.region });
        let newIsland = new Island({
          uuid: Utils.generateRandomUUID(),
          name: payload.name,
          identifier: '**' + payload.name + '**',
          description: payload.description,
          geo: {
            lat: payload.lat,
            long: payload.long
          },
          costalZone: region._id,
          images: []
        });
        // image file is optional
        if (payload.file._data.length > 0) {
          const imgObject = new Image();
          imgObject.data = payload.file._data;
          imgObject.name = payload.file.hapi.filename;
          imgObject.uuid = Utils.generateRandomUUID();
          // save image into mongo db
          const savedImage = await imgObject.save();
          // save file locally in public directory
          Utils.handleFileDownload(savedImage, newIsland.uuid);
          // update images reference in mongo db
          newIsland.images.push(savedImage);
        }
        // save island into mongo db
        const savedIsland = await newIsland.save();

        // get list of categories / regions, reduce the result to 'name' field only
        regions = await Region.find({}, 'name');
        const message = "Your island '" + payload.name + "' has been added successfully";
        return h.view('create', { title: 'Add Island', categories: regions, success: { message: message } });
      } catch (err) {
        regions = await Region.find({}, 'name');
        return h.view('create', { title: 'Add Island', categories: regions, errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Dashboard;
