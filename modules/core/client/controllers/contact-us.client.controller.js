'use strict';

angular.module('core').controller('ContactUsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;


    $scope.contactUs = function () {
      console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));
    }


  }
]);
