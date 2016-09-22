'use strict';

angular.module('core').controller('ContactUsController', ['$scope', 'Authentication', 'ContactUsService', 'NotificationFactory', 'GetListedService',
  function ($scope, Authentication, ContactUsService, NotificationFactory, GetListedService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.contactUs = function () {
      console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));
      ContactUsService.send($scope.contact, successCallback, errorCallback);
      /*ContactUsService.send($scope.contact);*/



      function successCallback(res) {
        //console.log('Success while sending the Contactus details : ' + res);
        NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.name);
        $scope.contactUsForm.$setPristine();
        $scope.contactUsForm.$setUntouched();
        $scope.contact = {};
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }


    $scope.getListedEmail = function () {

      console.log('getlisted form details on controller : ' + JSON.stringify($scope.getListed));


      console.log("entering into getlisted function");
      /*   console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));*/

      /*if ($stateParams.isPremium == 'isPremium')
        $scope.getListed.isPremium = true;*/

      $scope.getListed.isPremium = false;

      GetListedService.send($scope.getListed, successCallback, errorCallback);

      function successCallback(res) {
        console.log('Success while sending the Contactus details : ' + res);
        NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.contactName);
        $scope.getListedForm.$setPristine();
        $scope.getListedForm.$setUntouched();
        $scope.getListed = '';
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }
  }
]);
