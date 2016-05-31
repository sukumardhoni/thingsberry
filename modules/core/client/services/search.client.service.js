'use strict';

//Search service used for quering Products

angular.module('core')

.factory('SearchProducts', function ($resource) {
  return $resource('api/search/products/:ProCategory/:ProCompany/:ProName/:ProRegions/:pageId', {
    ProCategory: '@ProCategory',
    ProCompany: '@ProCompany',
    ProName: '@ProName',
    ProRegions: '@ProRegions',
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
  console.log("@@@@@@coming from premiumproducts controller to premiumproduct service");
  return $resource('api/premiumProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})
