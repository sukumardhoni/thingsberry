'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
console.log('from server side route to controller');
module.exports = _.extend(
  require('./users/users.authentication.server.controller'),
  require('./users/users.authorization.server.controller'),
  require('./users/users.password.server.controller'),
  require('./users/users.profile.server.controller')
);
