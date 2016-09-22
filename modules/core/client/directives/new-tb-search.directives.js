'use strict';


angular.module('core')
  .directive('tbSearch', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope:{
        searchInHeader:'='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-search-display.html',
      controller: 'HomeController',
      link: function (scope, elem, attrs) {
        // console.log("entering into the tbSearch link furnctions");
      //  var searchInHeader=attrs.searchInHeader;
        console.log(scope.searchInHeader);
      }
    };
  });
