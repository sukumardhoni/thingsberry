(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig)
    .run(function ($state, $rootScope, $localStorage) {
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
    });

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home.companies', {
        abstract: true,
        url: 'products',
        templateUrl: 'modules/companies/client/views/new-list-companies.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm'
      })
      .state('home.companies.products', {
        url: '/list',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.category', {
        url: '/{catId}~category',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.companyName', {
        url: '/{companyId}~company',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.productName', {
        url: '/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.categoryAndCompany', {
        url: '/{catId}~category/{companyId}~company',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      }).state('home.companies.companyAndproduct', {
        url: '/{companyId}~company/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      }).state('home.companies.categoryAndproduct', {
        url: '/{catId}~category/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      }).state('home.companies.categoryAndCompanyAndProduct', {
        url: '/{catId}~category/{companyId}~company/:productName',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      })
      .state('home.add', {
        url: 'product-info/:companyId?',
        templateUrl: 'modules/companies/client/views/add-company.client.view.html',
        /*   templateUrl:'modules/companies/client/views/new-tb-add-company.client.view.html',*/
        controller: 'CompanyController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: newCompany
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle: 'Add Product'
        }
      })


    .state('home.companies.products.detail', {
      url: '/:companyId',
      templateUrl: 'modules/companies/client/views/new-tb-single-product.client.view.html',
      controller: 'CompanyController',
      controllerAs: 'vm',
      resolve: {
        companyResolve: getCompany
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
