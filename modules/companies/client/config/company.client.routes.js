(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig)
    .run(function ($state, $rootScope, $localStorage, WebNotificationSubscription) {
      $rootScope.$state = $state;
      $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        // console.log("to state : " + JSON.stringify(toState));
        // console.log(" fromState : " + JSON.stringify(fromState));
        $localStorage.fromState = fromState;
        if (toState.name != "home.companies.products") {
          $("html, body").animate({
            scrollTop: 0
          }, 200);
        }
      })


      if ('serviceWorker' in navigator && 'PushManager' in window) {
        console.log('Service Worker and Push is supported');

        Notification.requestPermission(function (permission) {
          console.log("request premission : " + JSON.stringify(permission))

          if (Notification.permission === 'granted') {

            var applicationServerPublicKey = 'BOPtwxsHsba4hBA3_yOQ2zrHT9U3haDNDwvxOrFCjqcbeZxeHYzgJicrydDBx1iJRjSd-Zls0AYtLLZkX_Uhe18';

            navigator.serviceWorker.register('sw.js').then(function (reg) {
                console.log('Service Worker is registered', reg);

                navigator.serviceWorker.ready.then(function (register) {
                  register.pushManager.getSubscription().then(function (userSubscription) {

                    function urlB64ToUint8Array(base64String) {
                      const padding = '='.repeat((4 - base64String.length % 4) % 4);
                      const base64 = (base64String + padding)
                        .replace(/\-/g, '+')
                        .replace(/_/g, '/');

                      const rawData = window.atob(base64);
                      const outputArray = new Uint8Array(rawData.length);

                      for (var f = 0; f < rawData.length; ++f) {
                        outputArray[f] = rawData.charCodeAt(f);
                      }
                      return outputArray;
                    }
                    console.log("subscription obj : " + userSubscription)
                    if ((userSubscription == undefined) || (userSubscription == null)) {
                      console.log("@@user not subscribed")
                      var applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
                      register.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: applicationServerKey
                      }).then(function (subscription) {
                        console.log("user now subscribed to push messages : " + JSON.stringify(subscription))

                        WebNotificationSubscription.send(subscription, function sucessCalBck(res) {
                          console.log("@##$$$%% Coming to successfull calback : " + JSON.stringify(res))
                        }, function errCalBck(err) {
                          console.log("@##$$$%% Coming to error calback : " + JSON.stringify(err))
                        })

                      }).catch(function (error) {
                        console.error('error while subscribing', error);
                      });

                    } else {
                      console.log("@@user subscribed")
                    }
                  })
                })
              })
              .catch(function (error) {
                console.error('Service Worker Error', error);
              });
          }
        })
      } else {
        console.warn('Push messaging is not supported');
      }


    });

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home.companies', {
        abstract: true,
        url: 'products',
        views: {
          'allproducts-side@home': {
            templateUrl: 'modules/companies/client/views/new-list-companies.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },

      })
      .state('home.companies.products', {
        url: '/list',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      })
      /* .state('home.companies.products', {
         url: '/list',
         templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
         controller: 'CompanyListController',
         controllerAs: 'vm',
         data: {
           pageTitle: 'Products List',
           displayName: 'Searched Products'
         }

       })*/
      .state('home.companies.category', {
        url: '/{catId}~category',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.companyName', {
        url: '/{companyId}~company',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.productName', {
        url: '/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.categoryAndCompany', {
        url: '/{catId}~category/{companyId}~company',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.companyAndproduct', {
        url: '/{companyId}~company/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      }).state('home.companies.categoryAndproduct', {
        url: '/{catId}~category/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      }).state('home.companies.categoryAndCompanyAndProduct', {
        url: '/{catId}~category/{companyId}~company/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        views: {
          'allproducts@home.companies': {
            templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
            controller: 'CompanyListController',
            controllerAs: 'vm'
          }
        },
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      })
      .state('home.add', {
        url: 'product-info/:companyId?',
        views: {
          'add-product@home': {
            templateUrl: 'modules/companies/client/views/add-company.client.view.html',
            controller: 'CompanyController',
            controllerAs: 'vm',
            resolve: {
              companyResolve: newCompany
            }
          }
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle: 'Add Product'
        }
      })


      .state('home.companies.products.detail', {
        url: '/:companyId',
        views: {
          'single-product': {
            templateUrl: 'modules/companies/client/views/new-tb-single-product.client.view.html',
            controller: 'CompanyController',
            controllerAs: 'vm',
            resolve: {
              companyResolve: getCompany
            }
          }
        },
        data: {
          pageTitle: 'Company {{ companyResolve.Proname }}'
        }
      });
  }

  getCompany.$inject = ['$stateParams', 'CompanyService'];

  function getCompany($stateParams, CompanyService) {
    return CompanyService.get({
      companyId: $stateParams.companyId
    }).$promise;
  }


  newCompany.$inject = ['CompanyService'];

  function newCompany(CompanyService) {
    return new CompanyService();
  }
})();
