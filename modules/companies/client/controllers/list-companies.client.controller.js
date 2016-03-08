(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService'];

  function CompanyListController(CompanyService) {
    var vm = this;

    vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    //vm.companys = CompanyService.query();
  }
})();
