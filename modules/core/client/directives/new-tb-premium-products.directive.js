'use strict';


angular.module('core')
  .directive('tbPremiumProducts', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-premium-products-display.html',
      link: function (scope, elem, attrs) {
        console.log("entering into the tbPremiumProducts products link furnctions");
        console.log(scope.details);
      }
    };
  });
