'use strict';

angular.module('core').directive('tbSingleProduct', function (dataShare, $state, $localStorage, ratingService, NotificationFactory, Authentication, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-single-prdct.display.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to tb single product");
      //  console.log("coming to tb single product:" + JSON.stringify(scope.details));
      // console.log(scope.editIcon.roles);
      scope.adminUser = Authentication.user;
      //   console.log(scope.adminUser.roles);

      if (scope.adminUser) {
        if (scope.adminUser.roles.indexOf('admin') !== -1) {
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
            if (product.firebaseImageUrl) {
              // console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(product.firebaseImageUrl));
              var removeFirebaseSingleProdId = product.productId.replace(/\./g, "|");
              firebase.database().ref('Products/' + removeFirebaseSingleProdId + '/').once('value', function (snapshot) {
                //  console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(snapshot.val()))
                var imageName = snapshot.val().storageImgName;
                firebase.storage().ref('Products/' + removeFirebaseSingleProdId + '/' + imageName).delete().then(function (result) {
                  // console.log("DELETED PRODUCT IMAGE AND FULL DATA ");
                  firebase.database().ref('Products/' + removeFirebaseSingleProdId + '/').remove().then(function () {
                    CompanyServiceUpdate.DeleteProduct.remove({
                      companyId: product.productId
                    }, function (res) {
                      //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                      $state.go('home.companies.list.products', {
                        isSearch: false
                      });
                      NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                    }, function (err) {
                      // console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                      NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
                    })
                  });
                })
              })
            } else {
              // console.log(" FIREBASE IMG URL NOT THERE ");
              CompanyServiceUpdate.DeleteProduct.remove({
                companyId: product.productId
              }, function (res) {
                // console.log('Res details on remove success cb : ' + JSON.stringify(res));
                $state.go('home.companies.list.products', {
                  isSearch: false
                });
                NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
              }, function (err) {
                // console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
              })
            }
          } else {
            // console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        //  console.log("DEACTIVE PRDCT IS CALLED");
        if (scope.details.status == 'active') {
          // console.log("now PRDCT IS going to deactive ");
          scope.details.status = 'deactive';
          // console.log("now PRDCT IS going to deactive " + JSON.stringify(scope.details.status));
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          //  console.log("now PRDCT IS going to active ");
          scope.details.status = 'active';
          // console.log("now PRDCT IS going to deactive " + JSON.stringify(scope.details.status));
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          $window.location.reload();
          $state.go('home.companies.list.products', {
            isSearch: false
          });
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };

      scope.setAsFeatured = function () {
        if (scope.details.featuredFlag === false) {
          scope.details.featuredFlag = true;
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          scope.details.featuredFlag = false;
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          /*   if ($state.current.name == 'companies.list.products') {
               $window.location.reload();
             } else {
               $state.go('companies.list.products', {
                 isSearch: false
               });
             }*/
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };


      scope.setAsPremium = function () {
        if (scope.details.premiumFlag === false) {
          scope.details.premiumFlag = true;
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          scope.details.premiumFlag = false;
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          /*  if ($state.current.name == 'companies.list.products') {
              $window.location.reload();
            } else {
              $state.go('companies.list.products', {
                isSearch: false
              });
            }*/
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }
      };
    }
  }
})
