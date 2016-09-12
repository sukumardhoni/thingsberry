'use strict';

angular.module('companies').directive('tbShare', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    /*scope: {
      products: '='
    },*/
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-share.display.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {

      console.log("coming to share directive link function");

      if (attr.state == 'featured') {
        scope.shareStyles = {
          right: '-65px'
        }
      }
      if (attr.state == 'listview') {
        scope.shareStyles = {
          right: '-55px'
        }
      }
      if (attr.state == 'singlePrdct') {
        scope.shareStyles = {
          right: '-18px'
        }
      }

    }
  }
});
