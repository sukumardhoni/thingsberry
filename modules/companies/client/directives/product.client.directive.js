'use strict';


angular.module('companies')
  .directive('productDisplay', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/product-display.client.view.html',
      link: function (scope, elem, attrs) {
        scope.user = $localStorage.user;
        scope.proImgUrl = function () {
          if (scope.details.productImageURL)
            return scope.details.productImageURL
          else
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
        };

        scope.changeLimit = function (pro) {
          if (scope.limit == pro.description.length)
            scope.limit = 100;
          else
            scope.limit = pro.description.length;
        }


        scope.editProduct = function (Pro) {
          //console.log('Edit Product details on Direc. : ' + JSON.stringify(Pro));
          dataShare.setData(Pro);
          $state.go('companies.add');
        };
      }
    };
  });
