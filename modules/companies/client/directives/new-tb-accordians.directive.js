'use strict';

angular.module('companies').directive('tbAccordions', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      categories: '='
    },
    controller: 'CompanyListController',
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-accordions.display.client.view.html',
    link: function (scope, elem, attr) {
      // console.log("coming to accordns directive link function");
      // console.log("coming to share directive link function" + JSON.stringify(scope.listcount));
      /*  scope.getCategoryProduct = function (Catproducts) {

          console.log("accrdns: " + Catproducts);

          GetCatProducts.query({
            getCatProducts: Catproducts
          }, function (res) {
            console.log("succesfully geting product");
            console.log(JSON.stringify(res));
            vm.companys = res.products;
          }, function (err) {
            console.log("error while getting product");
          })

        }*/



    }
  }
});
