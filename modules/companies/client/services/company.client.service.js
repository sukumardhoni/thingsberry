(function () {
  'use strict';

  angular
    .module('core.services')
    .factory('CompanyService', CompanyService)
    .factory('CategoryService', CategoryService)
    .factory('dataShare', dataShare)
    .factory('ratingService', ratingService)
    .factory('deactiveService', deactiveService)
    .factory('CategoryServiceRightPanel', CategoryServiceRightPanel)
    .factory('FrequentlyProducts', FrequentlyProducts)
    .factory('CleanUpInactiveService', CleanUpInactiveService)
    .factory('WebNotificationSubscription', WebNotificationSubscription)
    .factory('sendNotificationsService', sendNotificationsService)


    .factory('FirebaseApp', function ($q) {
      var config = {
        apiKey: "AIzaSyDOggDlAx19ssyKUGK5okP0SNUNFNe1mXU",
        authDomain: "thingsberry-cbc0e.firebaseapp.com",
        databaseURL: "https://thingsberry-cbc0e.firebaseio.com",
        storageBucket: "thingsberry-cbc0e.appspot.com",
        messagingSenderId: "549789190896"
      };
      firebase.initializeApp(config);
      var database = firebase.database();
      return {
        firebaseInitialize: function () {
          return firebase;
        }
      }
    })
    /* .factory('FirebaseApp', function ($q) {
       var config = {
         apiKey: "AIzaSyC2WpFip-xGyU44QjUoKdNrVbUjN0mrLJs",
         authDomain: "local-thingsberry.firebaseapp.com",
         databaseURL: "https://local-thingsberry.firebaseio.com",
         storageBucket: "local-thingsberry.appspot.com",
         messagingSenderId: "346700939802"
       };
       firebase.initializeApp(config);
       var database = firebase.database();
       return {
         firebaseInitialize: function () {
           return firebase;
         }
       }
     })*/



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


  deactiveService.$inject = ['$resource'];

  function deactiveService($resource) {
    return $resource('api/deactivateProduct/:companyId/:deactive', {
      deactive: '@deactive',
      companyId: '@companyId'
    }, {
      update: {
        method: 'PUT'
      }
    });

  };


  CategoryService.$inject = ['$resource'];

  function CategoryService($resource) {
    return $resource('api/categories', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  };

  WebNotificationSubscription.$inject = ['$resource'];

  function WebNotificationSubscription($resource) {
    return $resource('api/add-dataTo-subscriptionDb', {}, {
      send: {
        method: 'POST'
      }
    });
  };

  sendNotificationsService.$inject = ['$resource'];

  function sendNotificationsService($resource) {
    return $resource('api/send-notificationTo-users', {}, {
      send: {
        method: 'POST'
      }
    });
  }



  CategoryServiceRightPanel.$inject = ['$resource'];

  function CategoryServiceRightPanel($resource) {
    return $resource('api/categories/listOfCategories', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  };

  /* CleanUpInactiveService.$inject = ['$resource'];

   function CleanUpInactiveService($resource) {
     return $resource('api/cleanUpInactive/:startFrom/:endTo/:updateBool?', {}, {
       query: {
         method: 'GET',
         isArray: true
       }
     });
   };*/
  CleanUpInactiveService.$inject = ['$resource'];

  function CleanUpInactiveService($resource) {
    return $resource('api/cleanUpInactive/:skipPageId/:updateBool?', {}, {
      query: {
        method: 'GET'
      }
    });
  };


  FrequentlyProducts.$inject = ['$resource'];

  function FrequentlyProducts($resource) {
    return $resource('api/companies/frequentProducts', {}, {
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
