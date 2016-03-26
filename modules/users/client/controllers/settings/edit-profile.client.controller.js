'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.authentication = Authentication;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);


      //console.log('User details : ' + JSON.stringify($scope.user));

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        $scope.success = true;
        $scope.authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);
