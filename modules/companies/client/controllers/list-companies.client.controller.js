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

      SearchProducts.query({
        ProCategory: $stateParams.ProCat,
        ProCompany: $stateParams.ProCom,
        ProName: $stateParams.ProName
      }, function (res) {
        console.log('Successfully fetched the Searched details');
        console.log('Searched details length : ' + res.length);
        vm.companys = res;
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });
    };






  }
})();
