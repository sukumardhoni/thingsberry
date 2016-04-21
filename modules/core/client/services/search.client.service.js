'use strict';

//Search service used for quering Products

angular.module('core')

.factory('SearchProducts', function ($resource) {
  return $resource('api/search/products/:ProCategory/:ProCompany/:ProName', {
    ProCategory: '@ProCategory',
    ProCompany: '@ProCompany',
    ProName: '@ProName'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})



.factory('ListOfProducts', function ($resource) {
  return $resource('api/listOfProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})
