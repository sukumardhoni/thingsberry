'use strict';

angular.module('core').controller('ContactUsController', ['$scope', 'Authentication', 'ContactUsService', 'NotificationFactory',
  function ($scope, Authentication, ContactUsService, NotificationFactory) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.contactUs = function () {
      //console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));
      ContactUsService.send($scope.contact, successCallback, errorCallback);

      function successCallback(res) {
        //console.log('Success while sending the Contactus details : ' + res);
        NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.firstName);
        $scope.contact = '';
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }
  }
]);
