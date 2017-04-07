'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/auth/jwtChangePassword', $scope.passwordDetails).then(function (response) {
        // If successful show success message and clear form
        console.log("USER : " + JSON.stringify(response));
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
        $scope.passwordForm.$setPristine();
        $scope.passwordForm.$setUntouched();

        $scope.passwordDetails = null;
      }, function (err) {
        //console.log("USER : " + JSON.stringify(err));
        $scope.error = err.data.message;
      });
    };
  }
]);
