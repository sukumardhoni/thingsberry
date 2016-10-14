'use strict';


angular.module('core')
  .directive('tbFeaturedProducts', function (dataShare, $state, $localStorage, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
    return {
      restrict: 'E',
      scope: {
        details: '=',
        editIcon: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-featured-products-display.html',
      link: function (scope, elem, attrs) {
        // console.log("entering into the featurred products link furnctions");

        scope.date1 = attrs.dateOnProduct;

        if (scope.editIcon.user) {
          if (scope.editIcon.user.roles.indexOf('admin') !== -1) {
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
            //  console.log("REMOVING PRODUCTS");
            if (product) {
              // console.log('remove func. on if condition : ');
              CompanyServiceUpdate.DeleteProduct.remove({
                companyId: product.productId
              }, function (res) {
                //   console.log('Res details on remove success cb : ' + JSON.stringify(res));
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
          //  console.log("DEACTIVE PRDCT IS CALLED");
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'deactive'
          }, scope.details, successUpdateCallback, errorUpdateCallback);

          function successUpdateCallback(res) {
            $window.location.reload();

            NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
          }

          function errorUpdateCallback(res) {
            vm.error = res.data.message;
            NotificationFactory.error('Failed to Update Product details...', res.data.message);
          }

        };



        /*  scope.editProductFunc = function (productDetails) {
            console.log($state.current.name);
            // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));
            dataShare.setData(productDetails, $state.current.name);
            $state.go('companies.add');
          }*/
      }
    };
  });
