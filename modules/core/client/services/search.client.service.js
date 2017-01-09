'use strict';

//Search service used for quering Products

angular.module('core')

.factory('SearchProducts', function ($resource) {
  return $resource('api/search/products/:ProCategory/:ProCompany/:ProName/:ProRegions/:pageId/:adminStatus', {
    ProCategory: '@ProCategory',
    ProCompany: '@ProCompany',
    ProName: '@ProName',
    ProRegions: '@ProRegions',
    pageId: '@pageId',
    adminStatus: '@adminStatus'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
    }
  });
})


.factory('getDeactiveProducts', function ($resource) {
  return $resource('api/companies/getDeactiveProducts', {}, {
    'query': {
      method: 'GET',
      isArray: true
    }
  });
})

/*.factory('GetErrImgPrdcts', function ($resource) {
  return $resource('api/GetErrorImages', {}, {
    'query': {
      method: 'GET',
      isArray: true
    }
  });
})*/

.factory('ListOfProducts', function ($resource) {
  return $resource('api/listOfProducts/:adminStatus/:pageId', {
    adminStatus: '@adminStatus',
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

.factory('videos', function ($resource) {
  return $resource('api/videos', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
})
