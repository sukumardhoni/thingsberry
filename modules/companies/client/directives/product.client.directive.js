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




        scope.rate1 = 4;
        scope.max1 = 5;
        scope.isReadonly1 = false;


        scope.rate = Math.floor(Math.random() * 6) + 1;
        scope.reviewsCount = Math.floor(Math.random() * 1000) + 1
        scope.max = 5;
        scope.isReadonly = true;


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




        scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };


        scope.hoveringOver = function (value) {
          //console.log('hoveringOver is called');
          scope.overStar = value;
          scope.percent = 100 * (value / scope.max);
        };

      }
    };
  });
