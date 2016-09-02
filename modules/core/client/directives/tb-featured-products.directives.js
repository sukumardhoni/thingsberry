'use strict';


angular.module('core')
  .directive('tbFeaturedProducts', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-featured-products-display.html',
      link: function (scope, elem, attrs) {
        console.log("entering into the featurred products link furnctions");
      }
    };
  });
