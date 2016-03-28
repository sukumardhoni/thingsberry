'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$localStorage',
  function ($scope, Authentication, $localStorage) {
    $scope.user = Authentication.user;
    $scope.user = $localStorage.user;
  }
]);
