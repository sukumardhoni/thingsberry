(function () {
  'use strict';

  angular
    .module('companies.services')
    .factory('CompanyService', CompanyService);

  CompanyService.$inject = ['$resource'];

  function CompanyService($resource) {
    return $resource('api/companies/:companyId', {
      companyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
