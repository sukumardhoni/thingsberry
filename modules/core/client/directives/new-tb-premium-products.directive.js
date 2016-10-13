'use strict';


angular.module('core')
  .directive('tbPremiumProducts', function (dataShare, $state, $localStorage, Authentication) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-premium-products-display.html',
      link: function (scope, elem, attrs) {
        //  console.log("entering into the tbPremiumProducts products link furnctions");
        // console.log(scope.details);
        scope.adminUser = Authentication.user;
        // console.log(scope.adminUser.roles);

        if (scope.adminUser) {
          if (scope.adminUser.roles.indexOf('admin') !== -1) {
            // console.log('directive admin is there');
            scope.editProduct = true;

          } else {
            // console.log('directive admin not there');
            scope.editProduct = false;
          }
        }

        scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };

      }
    };
  });
