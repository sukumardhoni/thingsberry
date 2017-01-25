'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
])

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('SignUpCondition', function () {
  return false;
})






  .factory('Users', ['$resource', 'ConfigService', function ($resource, ConfigService, $localStorage) {
  return {
    Signup: $resource(ConfigService.API_URL + '/users/signup', {}, {
      create: {
        method: 'POST',
        timeout: 30000
      }
    }),
    Login: $resource(ConfigService.API_URL + '/users/signin', {}, {
      create: {
        method: 'POST',
        timeout: 20000
      }
    }),


  }
}])

/*provides environment specific API url */
.service('ConfigService', function ($window) {
  if ($window.location.host.match(/localhost:3000\.com/)) {
    //console.log('its prod: ' + $window.location.host);
    this.API_URL = 'http://www.qa.thingsberry.com';
    return this.API_URL;
  } else if ($window.location.host.match(/202.83.31.92\:3000/)) {
    //console.log('its test: ' + $window.location.host);
    this.API_URL = 'http://localhost:3000';
    return this.API_URL;
  } else {
    //console.log('its dev: ' + $window.location.host);
    this.API_URL = 'https://' + $window.location.host;
    return this.API_URL;
  }
})

