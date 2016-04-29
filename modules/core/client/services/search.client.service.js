'use strict';

//Search service used for quering Products

angular.module('core')

.factory('SearchProducts', function ($resource) {
  return $resource('api/search/products/:ProCategory/:ProCompany/:ProName/:pageId', {
    ProCategory: '@ProCategory',
    ProCompany: '@ProCompany',
    ProName: '@ProName',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})



.factory('ListOfProducts', function ($resource) {
  return $resource('api/listOfProducts/:pageId', {
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})


.factory('PremiumProducts', function ($resource) {
  return $resource('api/premiumProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})
