(function () {
  'use strict';

  angular
    .module('companies.services')
    .factory('CompanyService', CompanyService)
    .factory('CategoryService', CategoryService)
    .factory('dataShare', dataShare)
    .factory('ratingService', ratingService)
    /*  .factory('productService', productService)*/




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
      }),
      getProduct: $resource('api/companies/:companyId', {
        companyId: '@companyId'
      }, {
        query: {
          method: 'GET'
        }
      })
    }
}]);




  CategoryService.$inject = ['$resource'];

  function CategoryService($resource) {
    return $resource('api/categories', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  };



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


  /* function CompanyService($resource) {
     return $resource('api/companies/:productId', {
       productId: '@productId'
     }, {
       update: {
         method: 'PUT'
       }
     });
   };*/



  function dataShare($rootScope, $timeout) {
    var service = {};
    service.data = false;
    service.setData = function (proDetails, proDetailsState) {
      var data = {
        data: proDetails,
        detailsState: proDetailsState
      }
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

  ratingService.$inject = ['$resource'];

  function ratingService($resource) {

    return $resource('api/updateRating/:companyId/:previousRatingValue/:userRating', {
      previousRatingValue: '@previousRatingValue',
      companyId: '@companyId'
    }, {
      update: {
        method: 'PUT'
      }
    });

  };

})();
