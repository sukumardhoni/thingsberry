'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$http', '$localStorage',
  function ($scope, $state, Authentication, Menus, $http, $localStorage) {


      console.log("entering into header controller");


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
      console.log('id="tb-navbar-collapse" is called : ' + $scope.isCollapsed);
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


    //console.log('Signout callback : ' + JSON.stringify($localStorage.user));



    $scope.signout = function () {
      //console.log('signout is called');
      //console.log('@@# in $http'+JSON.stringify($localStorage));
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
       $http.get('/api/auth/jwtSignout').success(function (response) {
        //console.log('Signout callback : ' + JSON.stringify(response));
        $scope.authentication.user = '';
        delete $localStorage.token;
        delete $localStorage.user;
        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go('home');
      });

    };



       $scope.content=[

                {

                    link:'HoMe',

                    route: 'home'



                },

                {

                    link:'ALLPRODUCTS',
                    route: 'allproducts'


                },

                {

                    link:'BLOG',
                    route: 'blog'

                },

                {

                    link:'GETLISTED',
                    route: 'getListed'

                },

                {

                    link:'CONTACTUS',
                    route:'contactus'

                }

                ];




            $scope.slides=[



                {

                    title:'STACKBOX: BEAUTIFUL SIMPLE AND CONNECTED',

                    description:'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',

                    /*image:'stackbox.jpg'*/

                    image:'stackbox.jpg'






                },

                 {

                    title:'XKUTY ONE: BEAUTIFUL SIMPLE AND CONNECTED',

                    description:'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',

                    image:'http://www.xkuty.com/images/xkuty.jpg',

                },

                 {

                    title:'STACKBOX: BEAUTIFUL SIMPLE AND CONNECTED',

                    description:'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',


                      image:'stackbox.jpg',

                }

            ];



  }
]);
