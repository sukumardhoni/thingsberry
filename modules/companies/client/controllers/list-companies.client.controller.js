(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', '$stateParams', 'SearchProducts', 'ListOfProducts'];

  function CompanyListController(CompanyService, $scope, $stateParams, SearchProducts, ListOfProducts) {
    var vm = this;

    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    /*CompanyService.query(function (res) {
  //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
  vm.companys = res;
});*/
    // article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString() ? true : false;

    $scope.getSearchedProductsList = function () {
      $scope.spinnerLoading = true;
      $scope.searchOrder = {};
      $scope.searchOrder.Lists = [
        {
          'name': 'Sort by',
          'value': ''
        },
        {
          'name': 'Latest',
          'value': '-created'
        },
        {
          'name': 'Ratings',
          'value': 'created'
        }
  ];
      $scope.searchOrder.List = $scope.searchOrder.Lists[0].value;

      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({}, function (res) {
          vm.companys = res;
          $scope.spinnerLoading = false;
        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {
        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name
        }, function (res) {
          vm.companys = res;
          $scope.spinnerLoading = false;
        }, function (err) {
          console.log('Failed to fetch the product details : ' + JSON.stringify(err));
        });
      }
    };
  }
})();
