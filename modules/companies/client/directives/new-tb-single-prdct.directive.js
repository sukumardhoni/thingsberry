'use strict';

angular.module('companies').directive('tbSingleProduct', function (dataShare, $state, $localStorage, ratingService, NotificationFactory,Authentication) {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-single-prdct.display.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to tb single product");
      console.log("coming to tb single product:" + JSON.stringify(scope.details));
      // console.log(scope.editIcon.roles);
      scope.adminUser = Authentication.user;
        console.log(scope.adminUser.roles);

        if (scope.adminUser) {
          if (scope.adminUser.roles.indexOf('admin') !== -1) {
            // console.log('directive admin is there');
            scope.editProduct = true;

          } else {
            // console.log('directive admin not there');
            scope.editProduct = false;
          }
        }
      scope.date1 = attr.dateOnProduct;

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };


    }
  }
})
