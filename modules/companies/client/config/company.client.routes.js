(function () {
  'use strict';

  angular
    .module('companies.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('companies', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>',
        data: {
          breadcrumbProxy: 'companies.list'
        }
      })
      .state('companies.list', {
        url: '/list/:cat?/:com?/:name?/:isSearch',
        templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      })
      .state('companies.create', {
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
      .state('companies.add', {
        url: '/add_your_product',
        templateUrl: 'modules/companies/client/views/add-company.client.view.html',
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
      .state('companies.edit', {
        url: '/:companyId/edit',
        templateUrl: 'modules/companies/client/views/add-company.client.view.html',
        controller: 'CompanyController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: getCompany
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Company {{ companyResolve.Proname }}'
        }
      })
      .state('companies.view', {
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
  }

  newCompany.$inject = ['CompanyService'];

  function newCompany(CompanyService) {
    return new CompanyService();
  }
})();
