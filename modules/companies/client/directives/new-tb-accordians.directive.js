'use strict';

angular.module('companies').directive('tbAccordions', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      categories: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-accordions.display.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to share directive link function");
      console.log("coming to share directive link function" + JSON.stringify(scope.categories));

    }
  }
});
