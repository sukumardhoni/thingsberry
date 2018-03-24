'use strict';


angular.module('core')
  .directive('tbClients', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        clients: '='

      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-clients-display.html',
      link: function (scope, elem, attrs) {
        console.log('tbClients directive loaded 1');
        // console.log("entering into the clients link furnctions");
        // console.log(scope.clients);

      }
    };
  });
