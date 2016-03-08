'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


    $scope.signoutFirebase = function () {
      console.log('signoutFirebase is called');
      var ref = new Firebase("https://thingsberry.firebaseio.com");
      ref.unauth(function authHandler(error, authData) {
        if (error) {
          console.log("signout Failed!", error);
        } else {
          console.log("signout successfully with payload:", authData);
          $scope.authentication.user = '';
        }
      });
    };



  }
]);
