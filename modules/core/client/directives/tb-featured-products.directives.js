'use strict';

angular.module('core')
  .directive('tbFeaturedProducts', function (dataShare, $state, $localStorage, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-featured-products-display.html',
      link: function (scope, elem, attrs) {
      }
    };
  }).directive('checkImg', function (dataShare, $state, $localStorage, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
    return {
      restrict: 'EA',
      scope: {
        name: '=',
        prdct: '&prdctData'
      },
      controller: 'HomeController',
      link: function (scope, element, attrs) {
        // var errImagesPrdcts = [];
        element.bind('error', function ($event) {
          scope.prdct({
            val: scope.name
          });
        });
      }
    }
  });
