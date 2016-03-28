'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$localStorage',
  function ($scope, $http, $location, Users, Authentication, $localStorage) {
    $scope.authentication = Authentication;

    $scope.user = $localStorage.user;


    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

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
