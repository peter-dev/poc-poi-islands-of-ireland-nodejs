'use strict';
// import required modules
const User = require('../models/user');

const Dashboard = {
  // load user dashboard page, enable authentication
  showDashboard: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        return h.view('dashboard', { title: 'Islands of Ireland', user: user });
      } catch (err) {
        return h.view('login', { errors: [{ message: err.message }] });
      }
    }
  }
};

module.exports = Dashboard;
