(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', '$stateParams', 'SearchProducts'];

  function CompanyListController(CompanyService, $scope, $stateParams, SearchProducts) {
    var vm = this;

    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    /*CompanyService.query(function (res) {
  //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
  vm.companys = res;
});*/



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


      SearchProducts.query({
        ProCategory: $stateParams.cat,
        ProCompany: $stateParams.com,
        ProName: $stateParams.name
      }, function (res) {
        //console.log('Successfully fetched the Searched details');
        //console.log('Searched details length : ' + res.length);
        vm.companys = res;
        $scope.spinnerLoading = false;
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });
    };






  }
})();
