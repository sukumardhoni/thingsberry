'use strict';

//Contact Us service
angular.module('core')

.factory('ContactUsService', ['$resource',
 function ($resource) {
    return $resource('api/contactUs', {}, {
      send: {
        method: 'POST'
      }
    });
 }
])

.factory('GetListedService', ['$resource',
 function ($resource) {
    console.log("getListed service from controller");
    return $resource('api/getListed', {}, {
      send: {
        method: 'POST'
      }
    });
 }
])
