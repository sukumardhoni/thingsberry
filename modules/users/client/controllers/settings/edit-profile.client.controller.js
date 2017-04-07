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
      console.log("USER : " + JSON.stringify($scope.user));
      // var user = new Users($scope.user);

      $http.post('/api/users', $scope.user).then(function (response) {
        // console.log("ERR : ");
        // console.log("USER : " + JSON.stringify(response));
        $scope.$broadcast('show-errors-reset', 'userForm');
        $scope.success = true;
        $scope.authentication.user = response.data;
      }, function (err) {
        $scope.error = err.data.message;
        console.log("ERROR : " + JSON.stringify($scope.error));
      })

      /* user.$update(function (response) {
         console.log("ERR : ");
         $scope.$broadcast('show-errors-reset', 'userForm');
         $scope.success = true;
         $scope.authentication.user = response;
       }, function (response) {
         $scope.error = response.data.message;
         console.log("ERR : " + JSON.stringify($scope.error));
       });*/
    };
  }
]);
