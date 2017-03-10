(function () {
  'use strict';

  angular
    .module('core')
    .controller('CompanyController', CompanyController)


  /*.controller('LoginSignUpModalCtrl', function ($scope, $uibModalInstance) {
    $scope.LogIn = function () {
      $scope.LogInSignUpCondition = true;
      $uibModalInstance.close($scope.LogInSignUpCondition);
    };
    $scope.SignUp = function () {
      $scope.LogInSignUpCondition = false;
      $uibModalInstance.close($scope.LogInSignUpCondition);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })*/


  .controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', 'productFromModal', function ($scope, $uibModalInstance, productFromModal) {
    $scope.product = productFromModal;
    $scope.ok = function (product) {
      $uibModalInstance.close(product);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);




  CompanyController.$inject = ['$scope', '$state', 'companyResolve', 'Authentication', '$localStorage', 'ratingService', 'NotificationFactory', '$timeout', 'dataShare', 'CompanyServiceUpdate', '$uibModal', '$log', '$q', 'CategoryService', '$location', '$stateParams', 'CategoryServiceRightPanel', 'FrequentlyProducts', 'FirebaseApp', '$anchorScroll', '$rootScope', '$window'];

  function CompanyController($scope, $state, company, Authentication, $localStorage, ratingService, NotificationFactory, $timeout, dataShare, CompanyServiceUpdate, $uibModal, $log, $q, CategoryService, $location, $stateParams, CategoryServiceRightPanel, FrequentlyProducts, FirebaseApp, $anchorScroll, $rootScope, $window) {

    var vm = this;
    vm.company = company;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    //vm.save = save;
    vm.addCompanyDetails = addCompanyDetails;
    $scope.path = $location.absUrl();
    $scope.imagefile;

    /*--------------------- FIRE BASE CONFIG--------------------------------------*/

    $scope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };


    /*--------------------- FIRE BASE CONFIG--------------------------------------*/
    $scope.goToPreviousState = function () {
      if ($localStorage.fromState.name == "") {
        // console.log(" previous state is null: ");
        $state.go('home.companies.products');
      } else {
        // console.log(" previous state : "+ JSON.stringify($localStorage.fromState));
        window.history.back();
      }
    };


    $scope.addBtnText = 'SUBMIT';


    if ($localStorage.user) {
      if ($localStorage.user.roles.indexOf('admin') !== -1) {
        // console.log("coming to true");
        $scope.editIcon = true;
      } else {
        // console.log("coming to true");
        $scope.editIcon = false;
      }
    }

    $scope.getCategoriesForSide = function () {
      CategoryServiceRightPanel.query({}, function (res) {
        $scope.accrdnsPanelArray = res;
      }, function (err) {
        console.log('error while getting the list from server side');
      })
    };

    $scope.getFrequentlyProducts = function () {
      FrequentlyProducts.query({}, function (res) {
        $scope.frequentProducts = res;
      }, function (err) {
        console.log('error while getting the list from server side');
      })
    }


    $scope.userValidation = function () {
      if (vm.authentication.user) {} else {
        var modalInstance = $uibModal.open({
          templateUrl: 'modules/companies/client/views/modals/userNotLoggedIn-modal.html',
          backdrop: "static",
          $scope: $scope,
          controller: 'LoginSignUpModalCtrl'
        });
        modalInstance.result.then(function (LogInSignUpCondition) {
          console.log('$scope.LogInSignUpCondition value : ' + LogInSignUpCondition);
          if (LogInSignUpCondition) $state.go('authentication.signin');
          else $state.go('authentication.signup');
        }, function () {});
      }
    }

    function imageExists(url, callback) {
      var img = new Image();
      img.onload = function () {
        callback(true);
      };
      img.onerror = function () {
        callback(false);
      };
      img.src = url;
    }

    /* ----------------  TO GET THE PRODUCT DETAILS IN EDIT PRODUCT PAGE----------------------*/
    if ($state.current.name == 'home.add') {
      if ($stateParams.companyId) {
        // console.log("coming to correct list");
        $scope.spinnerShow = true;
        //  console.log("coming to correct list@@@@:" + $stateParams.companyId);
        $scope.productIdIs = $stateParams.companyId;
        //  console.log("coming to correct list@@@@:" + $scope.productIdIs);
        CompanyServiceUpdate.getProduct.query({
          companyId: $scope.productIdIs
        }, vm.company, successgetProductCallback, errorgetProductCallback);

        function successgetProductCallback(res) {
          if (res.firebaseImageUrl) {
            // $scope.imageSrc = res.firebaseImageUrl;
            imageExists(res.firebaseImageUrl, function (exists) {
              // console.log('RESULT: url=' + res.firebaseImageUrl + ', exists=' + exists);
              if (exists == true) {
                $scope.imageSrc = res.firebaseImageUrl;
              } else {
                $scope.imageSrc = '';
              }
            });

          } else {}
          $timeout(callAtTimeout, 3000);

          function callAtTimeout() {
            $scope.spinnerShow = false;
            vm.company = res;
            //  console.log("succes callback from get productdetails:" + JSON.stringify(res.firebaseImageUrl));
          }
        }

        function errorgetProductCallback(res) {
          vm.error = res.data.message;
          // console.log("error callback from get productdetails");
          NotificationFactory.error('Failed to get Product details...', res.data.message);
        }

      }
    }
    /* ----------------Up to Here  TO GET THE PRODUCT DETAILS IN EDIT PRODUCT PAGE----------------------*/

    $scope.dynamicPopover = {
      templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
    };


    $scope.loadCategories = function ($query) {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      return catsList.$promise.then(function (result) {
        defObj.resolve(result);
        return result.filter(function (catList) {
          return catList.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
      return defObj.promise;
    };

    $scope.changeLimit = function (pro) {
      if ($scope.limit == pro.description.length)
        $scope.limit = 100;
      else
        $scope.limit = pro.description.length;
    };

    $scope.$watch('vm.company.productImageURL', function (value) {
      if (/^https/.test(vm.company.productImageURL)) {
        vm.company.httpImageUrl = value;
      } else {
        vm.company.httpImageUrl = '';
      }
    });

    $scope.$watch('vm.company.httpImageUrl', function (value) {
      //  console.log("HTTP image URl : " + JSON.stringify(value));
      if (/^https/.test(vm.company.httpImageUrl)) {
        vm.company.productImageURL = value;
      } else {
        vm.company.productImageURL = '';
      }
    });


    $scope.removeImage = function (imageName) {
      // console.log("REMOVE IMAGE : " + JSON.stringify(imageName));
      firebase.database().ref('Products/' + imageName).once('value', function (snap) {
        // console.log("CHECK IMAGE IN FIREBASE DATABEASE : " + JSON.stringify(snap.val()));
        if ((snap.val() != null) || (snap.val() != undefined)) {
          var removeProdImage = snap.val().storageImgName;
          firebase.storage().ref('Products/' + imageName + '/' + removeProdImage).delete().then(function () {
            // console.log("Deleted image from firebase ");
            firebase.database().ref('Products/' + imageName).remove();
            $scope.safeApply(function () {
              $scope.imageSrc = false;
              vm.company.firebaseImageUrl = '';
            })

          })
        } else {
          $scope.safeApply(function () {
            $scope.imageSrc = '';
            $scope.imgSizeError = false;
            // vm.company.firebaseImageUrl = '';
          })

        }


      })
    };

    $scope.goToMoreProd = function () {
      $state.go($state.current, {}, {
        reload: true
      });
    };

    $scope.removeProduct = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
        controller: 'ModalInstanceCtrl',
        backdrop: 'static',
        resolve: {
          productFromModal: function () {
            return vm.company;
          }
        }
      });

      modalInstance.result.then(function (product) {
        if (product) {
          //console.log('remove func. on if condition : ');
          if (product.firebaseImageUrl) {
            // console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(product.firebaseImageUrl));
            var removeFirebaseProdId = vm.company.productId.replace(/\./g, "|");

            firebase.database().ref('Products/' + removeFirebaseProdId + '/').once('value', function (snapshot) {
              // console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(snapshot.val()))
              if (snapshot.val() != null) {
                var imageName = snapshot.val().storageImgName;
                firebase.storage().ref('Products/' + removeFirebaseProdId + '/' + imageName).delete().then(function (result) {
                  // console.log("DELETED PRODUCT IMAGE AND FULL DATA ");
                  firebase.database().ref('Products/' + removeFirebaseProdId + '/').remove().then(function () {
                    CompanyServiceUpdate.DeleteProduct.remove({
                      companyId: product.productId
                    }, function (res) {
                      //console.log('Res details on remove success cb : ' + JSON.stringify(res));
                      $state.go('home.companies.products');
                      NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                    }, function (err) {
                      //console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                      NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
                    })
                  });
                })
              } else {
                CompanyServiceUpdate.DeleteProduct.remove({
                  companyId: product.productId
                }, function (res) {
                  //console.log('Res details on remove success cb : ' + JSON.stringify(res));
                  $state.go('home.companies.products');
                  NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
                }, function (err) {
                  //console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                  NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
                })
              }
            })
          } else {
            // console.log(" FIREBASE IMG URL NOT THERE ");
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              //console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $state.go('home.companies.products');
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              //console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          }
        } else {
          //console.log('remove func. on else condition : ');
        }
      }, function () {
        //$log.info('Modal Task Delete dismissed at: ' + new Date());
      });
    };


    function genBusinessArray(businessArray) {
      var businessSecArr = [];
      for (var i = 0; i < businessArray.length; i++) {
        businessSecArr.push(businessArray[i].id);
      }
      if (businessArray.length === businessSecArr.length) {
        return businessSecArr;
      }
    }
    // console.log("PRODUCT RESOLVE : " + JSON.stringify(vm.company))

    // addCompanyDetails company
    function addCompanyDetails(isValid) {
      //console.log('vm.company.categories value is : ' + vm.company.ProCat);
      //console.log('vm.company.categories value is : ' + JSON.stringify(vm.company.ProCat));
      $scope.addBtnText = 'Submiting...';
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }
      // TODO: move create/update logic to service
      if (vm.company.productId) {
        //  console.log('Update product is called : ' + JSON.stringify(vm.company));
        //   console.log('Update product is called : ' + JSON.stringify(vm.company.productId));
        //vm.company.$update(successUpdateCallback, errorUpdateCallback);
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);
        // console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));
        vm.company.operationalRegions = $scope.operationalRegionsList;

        if (vm.company.productImageURL) {
          vm.company.firebaseImageUrl = '';
          // console.log('Created product is called : ' + JSON.stringify(vm.company));
          CompanyServiceUpdate.UpdateProduct.update({
            companyId: vm.company.productId
          }, vm.company, successUpdateCallback, errorUpdateCallback);
        } else {
          //  console.log('Created product is called : ' + JSON.stringify($scope.imageSrc));

          if ($scope.imagefile) {
            // console.log('Image file : ' + JSON.stringify($scope.imagefile.name));
            var firebaseProdId = vm.company.productId.replace(/\./g, "|");
            firebase.database().ref('Products/' + firebaseProdId + '/').once('value', function (snapshot) {
              var snapVal = snapshot.val();
              if (snapVal != undefined) {
                // console.log("GETTING FROM FIREBASE IMG URL: " + JSON.stringify(snapVal))
                var imageName = snapVal.storageImgName;
                firebase.storage().ref('Products/' + firebaseProdId + '/' + imageName).delete().then(function (result) {
                  // console.log("DELTE : " + JSON.stringify(result));
                  firebase.storage().ref('Products/' + firebaseProdId + '/' + $scope.imagefile.name).put($scope.imagefile).then(function (updatedImage) {
                    var updatedImageUrl = updatedImage.a.downloadURLs[0];
                    firebase.database().ref('Products/' + firebaseProdId + '/').update({
                      storageImgName: $scope.imagefile.name
                    }).then(function () {
                      vm.company.firebaseImageUrl = updatedImageUrl;
                      CompanyServiceUpdate.UpdateProduct.update({
                        companyId: vm.company.productId
                      }, vm.company, successUpdateCallback, errorUpdateCallback);
                    })
                  })
                });

              } else {
                //  console.log("PRODUCT ID UNDEFINED ADDINING IMG TO FIREBASE ");
                firebase.storage().ref('Products/' + firebaseProdId + '/' + $scope.imagefile.name + '/').put($scope.imagefile).then(function (snap) {
                  var NewImageUrl = snap.a.downloadURLs[0];
                  firebase.database().ref('Products/' + firebaseProdId + '/').update({
                    storageImgName: $scope.imagefile.name
                  }).then(function (resul) {
                    // console.log("DATA STORE IN DATABASE : " + JSON.stringify(resul));
                    vm.company.firebaseImageUrl = NewImageUrl;
                    // console.log('Created product is called : ' + JSON.stringify(vm.company));
                    CompanyServiceUpdate.UpdateProduct.update({
                      companyId: vm.company.productId
                    }, vm.company, successUpdateCallback, errorUpdateCallback);
                  })

                })
              }
            })
          } else {
            // console.log('Image file not updated ');
            CompanyServiceUpdate.UpdateProduct.update({
              companyId: vm.company.productId
            }, vm.company, successUpdateCallback, errorUpdateCallback);
          }
        }
        /*  CompanyServiceUpdate.UpdateProduct.update({
            companyId: vm.company.productId
          }, vm.company, successUpdateCallback, errorUpdateCallback);*/
      } else {

        // vm.company.ProCat = $scope.selectedCategory;
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);

        /*var replacedTitle = doc.Proname.replace(/\s/g, "-");
        productId: replacedTitle*/
        var productName = vm.company.Proname.replace(/\s/g, "-");
        // console.log("company productId :" + productName);

        vm.company.productId = productName;
        // console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));
        vm.company.operationalRegions = $scope.operationalRegionsList;

        if (vm.company.productImageURL) {
          // console.log('Created product is called : ' + JSON.stringify(vm.company));
          vm.company.$save(successCallback, errorCallback);
        } else {
          //console.log('Created product is called : ' + JSON.stringify($scope.imageSrc));
          // console.log('Image file : ' + JSON.stringify($scope.imagefile.name));
          var NewFirebaseProdId = vm.company.productId.replace(/\./g, "|");
          var storageRef = firebase.storage().ref('Products/' + NewFirebaseProdId + '/' + $scope.imagefile.name + '/');
          storageRef.put($scope.imagefile).then(function (snap) {
            var imageUrl = snap.a.downloadURLs[0];
            // console.log("IMAGE URL : " + JSON.stringify(imageUrl));

            firebase.database().ref('Products/' + NewFirebaseProdId + '/').update({
              storageImgName: $scope.imagefile.name
            }).then(function (resul) {
              //  console.log("DATA STORE IN DATABASE : " + JSON.stringify(resul));
              vm.company.firebaseImageUrl = imageUrl;
              // console.log('Created product is called : ' + JSON.stringify(vm.company));
              vm.company.$save(successCallback, errorCallback);
            })
          })
        }
        //  vm.company.$save(successCallback, errorCallback);
      }

      function successUpdateCallback(res) {
        $state.go('home.companies.products');
        NotificationFactory.success('Successfully Updated Product details...', 'Product Name : ' + res.Proname);
      }

      function errorUpdateCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to Update Product details...', res.data.message);
      }

      function successCallback(res) {
        $scope.showAddMoreProds = true;
        $scope.prodObj = {
          proName: res.Proname,
          proId: res.productId
        };
        NotificationFactory.success('Successfully Saved Product details...', 'Product Name : ' + res.Proname);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }

    /*
        $scope.$on('data_shared', function () {
          var proDetails = dataShare.getData();
          //  console.log("datashare localstorage");
          //  $localStorage.editProductDetails = proDetails;
          console.log(JSON.stringify(proDetails.detailsState));


          if (proDetails.data.logo)
            $scope.previewImg(proDetails.data.logo);
          $scope.productImg = proDetails.data.logo;

          $scope.operationalRegionsList = (proDetails.data.operationalRegions.length != 0) ? proDetails.operationalRegions : $scope.data.operationalRegionsList;

          vm.company = proDetails.data;
          console.log('datashare last: ' + JSON.stringify(vm.company));
        });*/

    $scope.businessSectorSelectedArray = [];

    $scope.businessSectorList = [{
      id: 1,
      label: "Agriculture & Fisheries applications"
    }, {
      id: 2,
      label: "Automotive"
    }, {
      id: 3,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 4,
      label: "Agriculture"
    }, {
      id: 5,
      label: "Automotive Products"
    }, {
      id: 6,
      label: "Asset & Cargo Tracking"
    }, {
      id: 7,
      label: "Fisheries applications"
    }, {
      id: 8,
      label: "Fleet Management"
    }, {
      id: 9,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 10,
      label: "Agriculture applications"
    }, {
      id: 11,
      label: "Automotive Products"
    }, {
      id: 12,
      label: "Personal Tracking"
    }];

    $scope.businessSectorSettings = {
      displayProp: 'label',
      idProp: 'label',
      showCheckAll: false,
      showUncheckAll: false,
      dynamicTitle: false,
      buttonClasses: 'business_sector_select',
    };
    $scope.businessSectorTexts = {
      buttonDefaultText: 'Business Sector'
    };




    $scope.removebusinessSectorSelectedVal = function (indexVal) {
      $scope.businessSectorSelectedArray.splice(indexVal, 1);
      //console.log('Business sector vals : ' + JSON.stringify($scope.businessSectorSelectedArray));
    };



    $scope.serviceOfferedSelectedArray = [];

    $scope.serviceOfferedList = [{
      id: 1,
      label: "Agriculture & Fisheries applications"
    }, {
      id: 2,
      label: "Automotive"
    }, {
      id: 3,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 4,
      label: "Agriculture"
    }, {
      id: 5,
      label: "Automotive Products"
    }, {
      id: 6,
      label: "Asset & Cargo Tracking"
    }, {
      id: 7,
      label: "Fisheries applications"
    }, {
      id: 8,
      label: "Fleet Management"
    }, {
      id: 9,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 10,
      label: "Agriculture applications"
    }, {
      id: 11,
      label: "Automotive Products"
    }, {
      id: 12,
      label: "Personal Tracking"
    }];

    $scope.serviceOfferedSettings = {
      displayProp: 'label',
      idProp: 'label',
      showCheckAll: false,
      showUncheckAll: false,
      dynamicTitle: false,
      buttonClasses: 'business_sector_select',
    };
    $scope.serviceOfferedTexts = {
      buttonDefaultText: 'Service Offered'
    };


    $scope.removeserviceOfferedSelectedVal = function (indexVal) {
      $scope.serviceOfferedSelectedArray.splice(indexVal, 1);
    };


    $scope.operationalRegionsList = [{
      name: "Africa",
      checked: false
    }, {
      name: "Asia-Pacific",
      checked: false
    }, {
      name: "Europe",
      checked: false
    }, {
      name: "Latin America",
      checked: false
    }, {
      name: "Middle East",
      checked: false
    }, {
      name: "North America",
      checked: false
    }, {
      name: "All Regions",
      checked: false
    }];


    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES', 'ENTERTAINMENT', 'ACCESORIES',
'TOYS', 'SPORT', 'ELECTRONICS', 'OFFICE PRODUCTS', 'BABY PRODUCTS', 'MOTORS'];
    $scope.SelectedCat = function (val) {
      //console.log('SelectedCat cal is : ' + val);
    };

    // $scope.imageSrc = 'https';
    $scope.uploadNewImage = function () {
      // console.log("###############");
      // console.log(JSON.stringify(event.target.files[0].size));
      if (event.target.files[0].size > 1000000) {
        $scope.imgSizeError = true;
      } else {
        var newFile = event.target.files[0];
        $scope.imagefile = newFile;
        $scope.imgSizeError = false;
      }
      $scope.safeApply(function () {
        $scope.imgSizeError;
        if (newFile) {
          $scope.imageSrc = URL.createObjectURL(newFile);
          // console.log("SRC >>> : " + JSON.stringify($scope.imageSrc));
        }
      });
    };
  }
})();
