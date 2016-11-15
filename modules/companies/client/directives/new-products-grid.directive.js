'use strict';

angular.module('companies').directive('tbProductsGrid', function (dataShare, $state, $localStorage, ratingService, NotificationFactory, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-grid.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      // console.log("coming to tb productsList");
      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          scope.editProduct = true;
        } else {
          scope.editProduct = false;
        }
      }


      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };
      scope.deleteProduct = function () {
        var modalInstance = $uibModal.open({
          animation: scope.animationsEnabled,
          templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
          controller: 'ModalInstanceCtrl',
          backdrop: 'static',
          resolve: {
            productFromModal: function () {
              return scope.details;
            }
          }
        });

        modalInstance.result.then(function (product) {
          // console.log("REMOVING PRODUCTS");
          if (product) {
            //   console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              //    console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $window.location.reload();
              /*$state.go('companies.list.products', {
                isSearch: false
              });*/
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            //   console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        console.log("DEACTIVE PRDCT IS CALLED:" + scope.details.status);
        //   console.log("DEACTIVE PRDCT IS CALLED");
        if (scope.details.status == 'active') {
          console.log("now PRDCT IS going to deactive ");
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'deactive'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          console.log("now PRDCT IS going to active ");
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'active'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }


        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list.products') {
            $window.location.reload();
          } else {
            $state.go('companies.list.products', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };

      scope.setAsFeatured = function () {
        if (scope.details.featuredFlag === false) {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: true
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: false
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list.products') {
            $window.location.reload();
          } else {
            $state.go('companies.list.products', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      }

      scope.setAsPremium = function () {
        if (scope.details.premiumFlag === false) {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'setPremiumToTrue'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'setPremiumToFalse'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list.products') {
            $window.location.reload();
          } else {
            $state.go('companies.list.products', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }
      }




    }
  }
}).directive('tbProductsList', function (dataShare, $state, $localStorage, ratingService, NotificationFactory, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-list.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to tb productsList");

      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          // console.log('directive admin is there');
          scope.editProduct = true;

        } else {
          // console.log('directive admin not there');
          scope.editProduct = false;
        }
      }

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };


      scope.deleteProduct = function () {
        var modalInstance = $uibModal.open({
          animation: scope.animationsEnabled,
          templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
          controller: 'ModalInstanceCtrl',
          backdrop: 'static',
          resolve: {
            productFromModal: function () {
              return scope.details;
            }
          }
        });

        modalInstance.result.then(function (product) {
          // console.log("REMOVING PRODUCTS");
          if (product) {
            // console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $window.location.reload();
              /*$state.go('companies.list.products', {
                isSearch: false
              });*/
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            // console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }

      scope.deactivateProduct = function () {
        // console.log("DEACTIVE PRDCT IS CALLED");
        if (scope.details.status == 'active') {
          // console.log("now PRDCT IS going to deactive ");
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'deactive'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          // console.log("now PRDCT IS going to active ");
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'active'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list.products') {
            $window.location.reload();
          } else {
            $state.go('companies.list.products', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };

      scope.setAsFeatured = function () {
        if (scope.details.featuredFlag === false) {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: true
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: false
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list.products') {
            $window.location.reload();
          } else {
            $state.go('companies.list.products', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };


      scope.setAsPremium = function () {
        if (scope.details.premiumFlag === false) {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'setPremiumToTrue'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'setPremiumToFalse'
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list.products') {
            $window.location.reload();
          } else {
            $state.go('companies.list.products', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }
      };

    }
  }
});
