'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$http', '$localStorage',
  function ($scope, $state, Authentication, Menus, $http, $localStorage) {
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


      $scope.content = [

        {

          link: 'HoMe',

          route: 'home'



                  },

      {

          link: 'ALLPRODUCTS',
          route: 'not-found'


                  },

        {

          link: 'BLOG',
          route: 'blog'

                  },

        {

          link: 'GETLISTED',
          route: 'getListed'

                  },

       {

          link: 'CONTACTUS',
          route: 'contactus'

                  }

                  ];




      $scope.getSearchedProducts = function (details) {

      console.log("entering into getsearchproducts :" +details);

      console.log('details outputBrowsers is : ' + JSON.stringify(details.outputBrowsers));
      console.log('details is : ' + JSON.stringify(details));
      details.regions = $scope.outputBrowsers;

      if (details != undefined) {
        if (details.Category || details.Company || details.Product || details.outputBrowsers) {
          var catsArray = [];
          var regionsArray = [];
          if (details.Category) {
            if (details.Category.length > 0) {
              for (var i = 0; i < details.Category.length; i++) {
                catsArray.push(details.Category[i].title);
              }
            } else {
              catsArray.push(details.Category.title);
            }
          }
          if (details.outputBrowsers) {
            //console.log('details.outputBrowsers is : ' + JSON.stringify(details.outputBrowsers));

            if (details.outputBrowsers.length > 0) {
              for (var i = 0; i < details.outputBrowsers.length; i++) {
                regionsArray.push(details.outputBrowsers[i].name);
              }
            } else {
              regionsArray.push(details.outputBrowsers.name);
            }
          }

          if ((catsArray == '') && (regionsArray == '') && (details.Company == undefined) && (details.Product == undefined)) {
            $state.go('companies.list', {
              isSearch: false
            });
          } else {
            $state.go('companies.list', {
              cat: (catsArray == '') ? 'Category' : catsArray,
              com: details.Company,
              name: details.Product,
              regions: (regionsArray == '') ? '' : regionsArray,
              isSearch: true
            });
          }
        }
      } else {
        $state.go('companies.list', {
          isSearch: false
        });
      }
    };











  }
]);
