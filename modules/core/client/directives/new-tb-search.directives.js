'use strict';


angular.module('core')
  .directive('tbSearch', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-search-display.html',
      link: function (scope, elem, attrs) {
        console.log("entering into the tbSearch link furnctions");
      }
    };
  });
