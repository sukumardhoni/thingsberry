'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$http', '$localStorage', '$mdSidenav', 'SubscribeService', 'NotificationFactory', '$rootScope', '$mdDialog',
  function ($scope, $state, Authentication, Menus, $http, $localStorage, $mdSidenav, SubscribeService, NotificationFactory, $rootScope, $mdDialog) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    if ($localStorage.thingsberySubscribe) {
      if (($localStorage.thingsberySubscribe.thingsberry_subscriber == "y") && ($localStorage.thingsberySubscribe.closeSubscribeForm = "y")) {
        $scope.showTopFooBar = false;
      } else {
        $scope.showTopFooBar = false;
        $scope.alreadySubScribedTxt = false;
      }
    } else {
      $scope.showTopFooBar = true;
      $scope.alreadySubScribedTxt = false;
    }

    $scope.closeSubScribe = function () {
      // console.log("CLICKING");
      if ($localStorage.thingsberySubscribe) {
        if ($localStorage.thingsberySubscribe.thingsberry_subscriber == "y") {
          $localStorage.thingsberySubscribe.closeSubscribeForm = "y";
        } else {
          $localStorage.thingsberySubscribe.thingsberry_subscriber == "N"
          $localStorage.thingsberySubscribe.closeSubscribeForm = "y";
        }
      } else {
        $localStorage.thingsberySubscribe = {
          thingsberry_subscriber: "N",
          closeSubscribeForm: "y"
        }
      }
    }

    $scope.foobarStatus = function () {
      if ($localStorage.thingsberySubscribe) {
        if ($localStorage.thingsberySubscribe.thingsberry_subscriber == "y") {
          $localStorage.thingsberySubscribe.closeSubscribeForm = "y";
          $scope.alreadySubScribedTxt = true;
          $scope.showTopFooBar = true;
        } else {
          $scope.showTopFooBar = true;
        }
      } else {
        $scope.showTopFooBar = true;
      }
      $("html, body").animate({
        scrollTop: 0
      }, "slow");
    }

    /*  $scope.toggleLeft = function () {
        $mdSidenav('left').isOpen();
      };*/

    $scope.toggleLeft = buildToggler('left');

    function buildToggler(navID) {
      return function () {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID).toggle()
      };
    }

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

    $scope.subscribe = {};
    $scope.subscribeEmail = function () {
      // console.log("SUBSCRIBER MAIL : "+JSON.stringify(subscriberMail));
      // console.log("SUBSCRIBER MAIL : " + $scope.subscribe.email);
      // console.log("SUBSCRIBER MAIL : " + JSON.stringify($scope.authentication.user));
      SubscribeService.send($scope.subscribe, successCalback, errorCalback);

      function successCalback(res) {
        // console.log('Success while sending the Contactus details : ' + JSON.stringify(res.length));
        if (res.length != 0) {
          // console.log("length is there");
          NotificationFactory.success('Thank you for subscribing for product updates with ' + res.email);

          $localStorage.thingsberySubscribe = {
              thingsberry_subscriber: "y",
              closeSubscribeForm: "y"
            }
            // $localStorage.thingsberry_subscriber = "y";
          $scope.showSubscribeForm = false;

          $scope.subscribeForm.$setPristine();
          $scope.subscribeForm.$setUntouched();
        } else {
          //  console.log("length is 0");
          $scope.alreadySubScribedTxt = true;
        }


      }

      function errorCalback(res) {
        // console.log("length is 0");
        // console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        $scope.alreadySubScribedTxt = true;
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }

    $scope.subscribeInIt = function () {
      if ($localStorage.thingsberySubscribe) {
        if ($localStorage.thingsberySubscribe.thingsberry_subscriber == "y") {
          //show Thanks for subscribe
          $scope.showSubscribeForm = false;
        } else {
          //show subscribe form
          $scope.showSubscribeForm = true;
        }
      } else {
        //show subscribe form
        $scope.showSubscribeForm = true;
      }
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
