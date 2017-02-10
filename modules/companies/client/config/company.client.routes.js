(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig)
    .run(function ($state, $rootScope) {
      $rootScope.$state = $state;
    });

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('home.companies', {
        abstract: true,
        url: 'products',
        template: '<ui-view/>',
        data: {
          breadcrumbProxy: 'companies.list'
        }
      })
      .state('home.companies.list', {
        url: '/list',
        abstract: true,
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      })
      .state('home.companies.list.products', {
        url: '/:cat?/:com?/:name?/:regions?/:isSearch',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies1.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }

      })
      .state('home.companies.create', {
        url: '/create',
        templateUrl: 'modules/companies/client/views/form-company.client.view.html',
        controller: 'CompanyController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: newCompany
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Create Product'
        }
      })
      .state('home.companies.add', {
        url: '/your_product/:companyId',
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


    .state('home.companies.list.products.detail', {
      url: '/productDetail/:companyId',
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



    /* .state('companies.view', {
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
     });*/
  }

  getCompany.$inject = ['$stateParams', 'CompanyService'];

  function getCompany($stateParams, CompanyService) {
    return CompanyService.get({
      companyId: $stateParams.companyId
    }).$promise;
  }
  /*   .state('companies.view', {
        url: '/:companyId',
        templateUrl: 'modules/company/client/views/view-company.client.view.html',
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
  }*/

  newCompany.$inject = ['CompanyService'];

  function newCompany(CompanyService) {
    return new CompanyService();
  }
})();
