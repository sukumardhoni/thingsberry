'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }
      // console.log("forgot password:" + JSON.stringify($scope.credentials));
      $http.post('/api/auth/jwtForgot', $scope.credentials).then(function (response) {
        // Show user success message and clear form
        // console.log("forgot password:" + JSON.stringify(response));
        $scope.forgotPasswordForm.$setPristine();
        $scope.forgotPasswordForm.$setUntouched();
        $scope.credentials = null;
        $scope.success = response.data.message;

      }, function (err) {
        // console.log("forgot password:" + JSON.stringify(err));
        $scope.credentials = null;
        $scope.error = err.data.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).then(function (response) {
        // If successful show success message and clear form
        // console.log("reset password:" + JSON.stringify(response));
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response.data;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }, function (err) {
        console.log("reset password:" + JSON.stringify(err.message));
        $scope.error = err.message;
      });
    };
  }
]);
