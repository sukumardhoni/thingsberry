
'use strict';


angular.module('core')
  .directive('premiumProductsDisplay', function (dataShare, $state, $localStorage) {

     console.log("entering into premiumProductsDisplay directive1");
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/tb-premium-products-display.html',


      link: function (scope, elem, attrs) {


          console.log("entering into the premium products link furnctions");
        scope.user = $localStorage.user;
        scope.proImgUrl = function () {
          if (scope.details.image) {
            return scope.details.image
          } else if (scope.details.logo != undefined) {
            console.log('Detaisl of product getting eroor : ' + JSON.stringify(scope.details));
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
          }
        };


        console.log('Product details are : ' + JSON.stringify(scope.details));


        scope.ProductDetails = function () {
          console.log('ProductDetails is triggred');
        }


      }
    };
  });


















