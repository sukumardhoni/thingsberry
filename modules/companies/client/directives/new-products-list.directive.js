'use strict';

angular.module('companies').directive('tbProductsList', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-list.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to tb productsList");
      // console.log(scope.details);
      /* scope.productImageUrl = attr.productImage;
       scope.productName = attr.productName;
       scope.productUrl = attr.productUrl;
       scope.productDescription = attr.productDesc;*/
      // console.log(scope.productName);

    }
  }
});
