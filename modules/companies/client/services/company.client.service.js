(function () {
  'use strict';

  angular
    .module('companies.services')
    .factory('CompanyService', CompanyService)
    .factory('dataShare', dataShare)




  .factory('CompanyServiceUpdate', ['$resource', function ($resource) {
    return {
      UpdateProduct: $resource('api/companies/:companyId', {
        companyId: '@companyId'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      DeleteProduct: $resource('api/companies/:companyId', {
        companyId: '@companyId'
      }, {
        remove: {
          method: 'DELETE'
        }
      })
    }
}]);




  CompanyService.$inject = ['$resource', '$rootScope', '$timeout'];

  function CompanyService($resource) {
    return $resource('api/companies/:companyId', {
      companyId: '@companyId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  };









  function dataShare($rootScope, $timeout) {
    var service = {};
    service.data = false;
    service.setData = function (data) {
      this.data = data;
      $timeout(function () {
        $rootScope.$broadcast('data_shared');
      }, 100);
    };
    service.getData = function () {
      return this.data;
    };
    return service;
  };


})();
