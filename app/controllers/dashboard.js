'use strict';
// import .env
require('dotenv').config();
// import required modules
const User = require('../models/user');
const Region = require('../models/region');
const Island = require('../models/island');
const Image = require('../models/image');

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
  }
};

module.exports = Dashboard;
