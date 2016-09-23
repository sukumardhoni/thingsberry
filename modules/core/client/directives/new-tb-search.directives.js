'use strict';


angular.module('core')
  .directive('tbSearch', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        headersearch: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-search-display.html',
      controller: 'HomeController',
      link: function (scope, elem, attrs) {
        // console.log("entering into the tbSearch link furnctions");
        // console.log("directive:" + scope.headersearch);

        if (attrs.state == 'headerSearchInput') {
          scope.headerSearch = function (value) {
            console.log("befor return incontroler");
            scope.headersearch = value;
            console.log("after return incontroler");
          }
        }
      }
    };
  });
