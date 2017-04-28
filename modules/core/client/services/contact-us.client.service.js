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
    return $resource('api/getListed', {}, {
      send: {
        method: 'POST'
      }
    });
	}
])

.factory('SubscribeService', ['$resource',
	function ($resource) {
    return $resource('api/subscribe', {}, {
      send: {
        method: 'POST'
      }
    });
	}
])

.factory('FeedbackService', ['$resource',
	function ($resource) {
    return $resource('api/feedback', {}, {
      send: {
        method: 'POST'
      }
    });
	}
])
