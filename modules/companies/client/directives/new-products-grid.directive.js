'use strict';

angular.module('core').directive('tbProductsGrid', function (dataShare, $state, $localStorage, ratingService, NotificationFactory, deactiveService, $window, $uibModal, CompanyServiceUpdate, Authentication) {
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
            if (product.firebaseImageUrl) {
              // console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(product.firebaseImageUrl));
              var removeFirebaseGridProdId = product.productId.replace(/\./g, "|");
              firebase.database().ref('Products/' + removeFirebaseGridProdId + '/').once('value', function (snapshot) {
                //  console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(snapshot.val()))
                if (snapshot.val() != null) {
                  var imageName = snapshot.val().storageImgName;
                  firebase.storage().ref('Products/' + removeFirebaseGridProdId + '/' + imageName).delete().then(function (result) {
                    //   console.log("DELETED PRODUCT IMAGE AND FULL DATA ");
                    firebase.database().ref('Products/' + removeFirebaseGridProdId + '/').remove().then(function () {
                      CompanyServiceUpdate.DeleteProduct.remove({
                        companyId: product.productId
                      }, function (res) {
                        //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                        //$window.location.reload();
                        $state.go($state.current, {}, {
                          reload: true
                        });

                        NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                      }, function (err) {
                        //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                        NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
                      })
                    });
                  })
                } else {
                  CompanyServiceUpdate.DeleteProduct.remove({
                    companyId: product.productId
                  }, function (res) {
                    //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                    $state.go($state.current, {}, {
                      reload: true
                    });

                    NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                  }, function (err) {
                    //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                    NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
                  })
                }
              })
            } else {
              // console.log(" FIREBASE IMG URL NOT THERE ");
              CompanyServiceUpdate.DeleteProduct.remove({
                companyId: product.productId
              }, function (res) {
                //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                // $window.location.reload();
                $state.go($state.current, {}, {
                  reload: true
                });

                NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
              }, function (err) {
                //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
              })
            }

          } else {
            //   console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }

      scope.deactivateProduct = function () {
        // console.log("DEACTIVE PRDCT IS CALLED:" + scope.details.status);
        //   console.log("DEACTIVE PRDCT IS CALLED");
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
          if ($state.current.name == 'home.companies.products') {
            // $window.location.reload();
            $state.go($state.current, {}, {
              reload: true
            });
          } else {
            $state.go('home.companies.products');
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          // vm.error = res.data.message;
          console.log(JSON.stringify(res));
          NotificationFactory.error('Failed to Update Product details...', res);
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

          $state.go($state.current, {}, {
            reload: true
          });
          NotificationFactory.success('Successfully added as Featured Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          // vm.error = res.data.message;
          NotificationFactory.error('Failed to set as Featured Product details...', res);
        }

      }

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
          $state.go($state.current, {}, {
            reload: true
          });
          NotificationFactory.success('Successfully added as Premium Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          // vm.error = res.data.message;
          NotificationFactory.error('Failed to set as Premium Product details...', res);
        }
      }

      scope.scrollToProduct = function (prod_Id) {

        /*$localStorage.ScrollPostion = prod_Id;*/


        $state.go('home.companies.products.detail', {
          companyId: scope.details.productId
        }).then(function () {
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
        })
      };

    }
  }
}).directive('tbProductsList', function (dataShare, $state, $localStorage, ratingService, NotificationFactory, deactiveService, $window, $uibModal, CompanyServiceUpdate, Authentication, FirebaseApp) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-list.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      //console.log("coming to tb productsList");
      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          // console.log('directive admin is there');
          scope.editProduct = true;

        } else {
          // console.log('directive admin not there');
          scope.editProduct = false;
        }
      }

      /* scope.proImgUrl = function () {
         if (scope.details.productImageURL) {
           return scope.details.productImageURL
         } else {
           return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
         }

       };*/

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

            if (product.firebaseImageUrl) {
              // console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(product.firebaseImageUrl));
              var removeFirebaseProdId = product.productId.replace(/\./g, "|");
              firebase.database().ref('Products/' + removeFirebaseProdId + '/').once('value', function (snapshot) {
                //  console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(snapshot.val()))
                if (snapshot.val() != null) {
                  var imageName = snapshot.val().storageImgName;
                  firebase.storage().ref('Products/' + removeFirebaseProdId + '/' + imageName).delete().then(function (result) {
                    // console.log("DELETED PRODUCT IMAGE AND FULL DATA ");
                    firebase.database().ref('Products/' + removeFirebaseProdId + '/').remove().then(function () {
                      CompanyServiceUpdate.DeleteProduct.remove({
                        companyId: product.productId
                      }, function (res) {
                        //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                        //$window.location.reload();
                        $state.go($state.current, {}, {
                          reload: true
                        });

                        NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                      }, function (err) {
                        //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                        NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
                      })
                    });
                  })
                } else {
                  CompanyServiceUpdate.DeleteProduct.remove({
                    companyId: product.productId
                  }, function (res) {
                    //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                    //$window.location.reload();
                    $state.go($state.current, {}, {
                      reload: true
                    });

                    NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                  }, function (err) {
                    //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                    NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + product.Proname);
                  })
                }
              })
            } else {
              // console.log(" FIREBASE IMG URL NOT THERE ");
              CompanyServiceUpdate.DeleteProduct.remove({
                companyId: product.productId
              }, function (res) {
                //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
                //$window.location.reload();
                $state.go($state.current, {}, {
                  reload: true
                });

                NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
              }, function (err) {
                //  console.log('Err details on remove Error cb : ' + JSON.stringify(err));
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
        // console.log("DEACTIVE PRDCT IS CALLED");
        if (scope.details.status == 'active') {
          // console.log("now PRDCT IS going to deactive ");
          scope.details.status = 'deactive';
          // console.log("now PRDCT IS going to deactive " + JSON.stringify(scope.details.status));
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        } else {
          // console.log("now PRDCT IS going to active ");
          scope.details.status = 'active';
          // console.log("now PRDCT IS going to deactive " + JSON.stringify(scope.details.status));
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: scope.details.productId
          }, scope.details, successUpdateCallback, errorUpdateCallback);
        }

        function successUpdateCallback(res) {
          if ($state.current.name == 'home.companies.products') {
            // $window.location.reload();
            $state.go($state.current, {}, {
              reload: true
            });
          } else {
            $state.go('home.companies.products');
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          // vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res);
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
          $state.go($state.current, {}, {
            reload: true
          });
          NotificationFactory.success('Successfully added as Featured Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          // vm.error = res.data.message;
          NotificationFactory.error('Failed to set as Featured Product details...', res);
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
          $state.go($state.current, {}, {
            reload: true
          });
          NotificationFactory.success('Successfully added as Premium Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          // vm.error = res.data.message;
          NotificationFactory.error('Failed to set as Premium Product...', res);
        }
      };

      scope.scrollToProduct = function () {

        $state.go('home.companies.products.detail', {
          companyId: scope.details.productId
        }).then(function () {
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
        })
      };

    }
  }
});
