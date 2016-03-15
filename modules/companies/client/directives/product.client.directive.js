'use strict';


angular.module('companies')
  .directive('productThumbnail', function () {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/product-thumbnail.client.view.html',
      link: function (scope, elem, attrs) {

        scope.proImgUrl = function () {
          return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
        }

      }
    };
  });
