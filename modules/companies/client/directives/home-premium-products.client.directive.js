'use strict';


angular.module('companies')
  .directive('premiumProductDisplay', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/premium-product-display.client.view.html',
      link: function (scope, elem, attrs) {
        scope.user = $localStorage.user;
        scope.proImgUrl = function () {
          if (scope.details.image) {
            return scope.details.image
          } else if (scope.details.logo != undefined) {
            //console.log('Detaisl of product getting eroor : ' + JSON.stringify(scope.details));
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
          }
        };
        //console.log('Product details are : ' + JSON.stringify(scope.details));


        /*scope.ProductDetails = function () {
          console.log('ProductDetails is triggred');
        }*/


      }
    };
  });
