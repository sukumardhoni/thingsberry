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
      scope.date1 = attr.dateOnProduct;

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
          console.log("REMOVING PRODUCTS");
          if (product) {
            console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $window.location.reload();
              /*$state.go('companies.list', {
                isSearch: false
              });*/
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        console.log("DEACTIVE PRDCT IS CALLED");
        deactiveService.update({
          companyId: scope.details.productId,
          deactive: 'deactive'
        }, scope.details, successUpdateCallback, errorUpdateCallback);

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list') {
            $window.location.reload();
          } else {
            $state.go('companies.list', {
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
      scope.date1 = attr.dateOnProduct;
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
          console.log("REMOVING PRODUCTS");
          if (product) {
            console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $window.location.reload();
              /*$state.go('companies.list', {
                isSearch: false
              });*/
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        console.log("DEACTIVE PRDCT IS CALLED");
        deactiveService.update({
          companyId: scope.details.productId,
          deactive: 'deactive'
        }, scope.details, successUpdateCallback, errorUpdateCallback);

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list') {
            $window.location.reload();
          } else {
            $state.go('companies.list', {
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



      /* scope.editProductFunc = function (productDetails) {
         // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));
         dataShare.setData(productDetails);
         $state.go('companies.add');
       }*/

      /* var proDetails = '';
       scope.$on('data_shared', function () {
         var proDetails = dataShare.getData();
         console.log("datashare localstorage");
         $localStorage.editProductDetails = proDetails;
         console.log(JSON.stringify($localStorage.editProductDetails));

         if (proDetails.logo)
           scope.previewImg(proDetails.logo);
         scope.productImg = proDetails.logo;

         scope.operationalRegionsList = (proDetails.operationalRegions.length != 0) ? proDetails.operationalRegions : scope.operationalRegionsList;

         vm.company = proDetails;
       });
       if (proDetails) {
         vm.company = proDetails;
       } else {
         vm.company = $localStorage.editProductDetails;
       }*/

      //  console.log("date in directive" + scope.date1);
      // console.log(scope.details);
      /* scope.productImageUrl = attr.productImage;
       scope.productName = attr.productName;
       scope.productUrl = attr.productUrl;
       scope.productDescription = attr.productDesc;*/
      // console.log(scope.productName);

    }
  }
});
