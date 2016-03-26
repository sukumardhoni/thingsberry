'use strict';


angular.module('companies')
  .directive('productDisplay', function (dataShare, $state) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/product-display.client.view.html',
      link: function (scope, elem, attrs) {

        scope.proImgUrl = function () {
          return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
        };

        scope.editProduct = function (Pro) {
          //console.log('Edit Product details on Direc. : ' + JSON.stringify(Pro));
          dataShare.setData(Pro);
          $state.go('companies.add');
        };

      }
    };
  });