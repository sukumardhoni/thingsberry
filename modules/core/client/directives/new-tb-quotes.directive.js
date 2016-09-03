'use strict';


angular.module('core')
  .directive('tbQuotes', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        tbquote: '='

      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-quotes-display.html',
      link: function (scope, elem, attrs) {
        //  console.log("entering into the quotes link furnctions");
        //  console.log(scope.tbquote);

      }
    };
  });
