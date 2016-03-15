(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope'];

  function CompanyListController(CompanyService, $scope) {
    var vm = this;

    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    CompanyService.query(function (res) {
      //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
      vm.companys = res;
    });

    $scope.getProImgUrl = function () {
      console.log('getProImgUrl is called')
    };
  }
})();
