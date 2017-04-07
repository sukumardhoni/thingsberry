'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$http', '$localStorage', '$mdSidenav',
  function ($scope, $state, Authentication, Menus, $http, $localStorage, $mdSidenav) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;


    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };

    $scope.date1 = new Date();
    $scope.showBoxOne = false;

    $scope.showSearchDirective = function () {
      if ($state.current.name === 'home') {
        $scope.showBoxOne;
      } else {
        $scope.showBoxOne = !$scope.showBoxOne;
      }

      // console.log($state.current.name)
    }



    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      console.log('id="tb-navbar-collapse" is called : ' + $scope.isCollapsed);
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    /*    console.log('@@#outside' + JSON.stringify($localStorage.token));
        console.log('@@# outside' + JSON.stringify($localStorage.user));
        console.log('@@# outside' + JSON.stringify($scope.authentication.user));*/
    $scope.signout = function () {
      //console.log('signout is called');
      /*      console.log('@@# in $http' + JSON.stringify($localStorage.token));
            console.log('@@# in $http' + JSON.stringify($localStorage.user));
            console.log('@@# in $http' + JSON.stringify($scope.authentication.user));*/
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
      $http.get('/api/auth/jwtSignout').then(function (response) {
        // console.log('Signout callback : ' + JSON.stringify(response));
        $scope.authentication.user = '';
        delete $localStorage.token;
        delete $localStorage.user;
        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go('home');
      }, function (err) {
        //  console.log("SIGnout : " + JSON.stringify(err));
      });

    };

  }
]);
