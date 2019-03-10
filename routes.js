'use strict';
// import controllers
const Accounts = require('./app/controllers/accounts');
const Dashboard = require('./app/controllers/dashboard');

module.exports = [
  { method: 'GET', path: '/', config: Accounts.index },
  { method: 'GET', path: '/signup', config: Accounts.showSignup },
  { method: 'GET', path: '/login', config: Accounts.showLogin },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'GET', path: '/logout', config: Accounts.logout },
  { method: 'POST', path: '/signup', config: Accounts.signup },
  { method: 'POST', path: '/login', config: Accounts.login },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  { method: 'POST', path: '/delete', config: Accounts.delete },
  { method: 'GET', path: '/dashboard', config: Dashboard.showDashboard },
  { method: 'GET', path: '/create', config: Dashboard.showCreate },
  { method: 'GET', path: '/edit/{poiId}', config: Dashboard.showEdit },
  { method: 'POST', path: '/create', config: Dashboard.create },
  { method: 'POST', path: '/edit', config: Dashboard.updateIsland },
  { method: 'POST', path: '/delete/{poiId}', config: Dashboard.delete },
  {
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './public'
      }
    },
    options: { auth: false }
  }
];
