(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', '$stateParams', 'SearchProducts', 'ListOfProducts'];

  function CompanyListController(CompanyService, $scope, $stateParams, SearchProducts, ListOfProducts) {
    var vm = this;
    var pageId = 0;

    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    /*CompanyService.query(function (res) {
  //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
  vm.companys = res;
});*/
    // article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString() ? true : false;

    $scope.getSearchedProductsList = function () {

      // var pageId = 0;


      $scope.productsDisplayText = $stateParams.isSearch;

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
      $scope.searchOrder.List = $scope.searchOrder.Lists[1].value;

      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          pageId: pageId
        }, function (res) {
          //console.log('response is : ' + JSON.stringify(res));
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          pageId++;
        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {
        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProRegions: $stateParams.regions,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          pageId: pageId
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          pageId++;
        }, function (err) {
          console.log('Failed to fetch the product details : ' + JSON.stringify(err));
        });
      }
    };



    $scope.LoadMoreProducts = function () {
      //console.log('LoadMoreProducts function is called');
      var onScroll = {};
      $scope.spinnerLoading = true;
      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          pageId: pageId
        }, function (res) {
          //vm.companys = res;
          $scope.spinnerLoading = false;
          pageId++;
          onScroll = res.products;
          if (res.length == 0) {
            $scope.noMoreProductsAvailable = true;
          }
          var oldProducts = vm.companys;
          vm.companys = oldProducts.concat(onScroll);

        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {
        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          pageId: pageId
        }, function (res) {
          //vm.companys = res;
          $scope.spinnerLoading = false;
          pageId++;
          onScroll = res.products;
          if (res.length == 0) {
            $scope.noMoreProductsAvailable = true;
          }
          var oldProducts = vm.companys;
          vm.companys = oldProducts.concat(onScroll);
        }, function (err) {
          console.log('Failed to fetch the product details : ' + JSON.stringify(err));
        });
      }


    };



  }
})();
