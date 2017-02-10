'use strict';

angular.module('core').directive('tbSmallSnippet', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-small-snippet.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {
      //  console.log("coming to small snippet");
      scope.smallDescription = attr.desc;

    }
  }
});
