'use strict';


angular.module('core')
  .directive('tbFeaturedProducts', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '=',
        editIcon: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-featured-products-display.html',
      link: function (scope, elem, attrs) {
        // console.log("entering into the featurred products link furnctions");

        scope.date1 = attrs.dateOnProduct;

        if (scope.editIcon.user) {
          if (scope.editIcon.user.roles.indexOf('admin') !== -1) {
            // console.log('directive admin is there');
            scope.editProduct = true;

          } else {
            // console.log('directive admin not there');
            scope.editProduct = false;
          }
        }


        scope.editProductFunc = function (productDetails) {
          // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));
          dataShare.setData(productDetails);
          $state.go('companies.add');
        }
      }
    };
  });
