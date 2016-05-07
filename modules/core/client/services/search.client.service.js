'use strict';

//Search service used for quering Products

angular.module('core')

.factory('SearchProducts', function ($resource) {
  return $resource('api/search/products/:ProCategory/:ProRegions/:ProCompany/:ProName/:pageId', {
    ProCategory: '@ProCategory',
    ProRegions: '@ProRegions',
    ProCompany: '@ProCompany',
    ProName: '@ProName',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
    }
  });
})



.factory('ListOfProducts', function ($resource) {
  return $resource('api/listOfProducts/:pageId', {
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
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
