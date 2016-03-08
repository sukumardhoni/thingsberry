'use strict';


angular.module('companies')
  .directive('productThumbnail', function () {
    return {
      restrict: 'E',
      templateUrl: 'modules/companies/client/views/directive-partials/product-thumbnail.client.view.html',
      link: function (scope, elem, attrs) {

      }
    };
  });
