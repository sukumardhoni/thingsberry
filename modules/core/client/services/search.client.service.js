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
  return $resource('api/premiumProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})

.factory('featuredProducts', function ($resource) {
  return $resource('api/featuredProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})


.factory('ourClients', function ($resource) {
  return $resource('api/clients', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})

.factory('quotes', function ($resource) {
  return $resource('api/quotes', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})
