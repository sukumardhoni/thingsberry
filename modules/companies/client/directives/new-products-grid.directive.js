'use strict';

angular.module('companies').directive('tbProductsGrid', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-grid.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      // console.log("coming to tb productsList");
      // console.log(scope.details);
      /* scope.productImageUrl = attr.productImage;
       scope.productName = attr.productName;
       scope.productUrl = attr.productUrl;
       scope.productDescription = attr.productDesc;*/
      // console.log(scope.productName);

    }
  }
}).directive('tbProductsList', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-list.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to tb productsList");
      scope.date1 = attr.dateOnProduct;
      //  console.log("date in directive" + scope.date1);
      // console.log(scope.details);
      /* scope.productImageUrl = attr.productImage;
       scope.productName = attr.productName;
       scope.productUrl = attr.productUrl;
       scope.productDescription = attr.productDesc;*/
      // console.log(scope.productName);

    }
  }
});
