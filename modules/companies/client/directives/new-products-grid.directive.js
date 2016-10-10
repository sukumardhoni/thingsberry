'use strict';

angular.module('companies').directive('tbProductsGrid', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-grid.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      // console.log("coming to tb productsList");
      // console.log(scope.editIcon.roles);
      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          // console.log('directive admin is there');
          scope.editProduct = true;

        } else {
          //  console.log('directive admin not there');
          scope.editProduct = false;
        }
      }
      scope.date1 = attr.dateOnProduct;

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };
      /* scope.editProductFunc = function (productDetails) {
         console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));

         dataShare.setData(productDetails);
         $state.go('companies.add');
       }*/

      /*  scope.editProductFunc = function (productDetails) {
            // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));

            dataShare.setData(productDetails);
            $state.go('companies.add');
          }*/
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
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-list.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to tb productsList");
      scope.date1 = attr.dateOnProduct;
      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          // console.log('directive admin is there');
          scope.editProduct = true;

        } else {
          // console.log('directive admin not there');
          scope.editProduct = false;
        }
      }

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };
      /* scope.editProductFunc = function (productDetails) {
         // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));
         dataShare.setData(productDetails);
         $state.go('companies.add');
       }*/

      /* var proDetails = '';
       scope.$on('data_shared', function () {
         var proDetails = dataShare.getData();
         console.log("datashare localstorage");
         $localStorage.editProductDetails = proDetails;
         console.log(JSON.stringify($localStorage.editProductDetails));

         if (proDetails.logo)
           scope.previewImg(proDetails.logo);
         scope.productImg = proDetails.logo;

         scope.operationalRegionsList = (proDetails.operationalRegions.length != 0) ? proDetails.operationalRegions : scope.operationalRegionsList;

         vm.company = proDetails;
       });
       if (proDetails) {
         vm.company = proDetails;
       } else {
         vm.company = $localStorage.editProductDetails;
       }*/

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
