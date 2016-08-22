'use strict';

angular.module('companies').directive('tbRatingsContainer', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'modules/companies/client/views/directive-partials/new-ratins-popover.display.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {
      console.log("coming to ratings container");
      console.log(attr.prodId);
      scope.rate = 4;
      scope.isReadonly = true;
      scope.hoveringOver = function (value) {
        scope.overStar = value;
        scope.percent = 100 * (value / scope.max);
      };
    }
  }
});
