(function () {
  'use strict';

  angular
    .module('companies')
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




  CompanyController.$inject = ['$scope', '$state', 'companyResolve', 'Authentication', '$localStorage', 'ratingService', 'NotificationFactory', '$timeout', 'dataShare', 'CompanyServiceUpdate', '$uibModal', '$log', '$q', 'CategoryService', '$location', '$stateParams', 'CategoryServiceRightPanel', 'FrequentlyProducts'];

  function CompanyController($scope, $state, company, Authentication, $localStorage, ratingService, NotificationFactory, $timeout, dataShare, CompanyServiceUpdate, $uibModal, $log, $q, CategoryService, $location, $stateParams, CategoryServiceRightPanel, FrequentlyProducts) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    //vm.save = save;
    vm.addCompanyDetails = addCompanyDetails;
    $scope.path = $location.absUrl();

    $scope.addBtnText = 'SUBMIT';
    // console.log("USER :" + JSON.stringify($localStorage.user));
    // console.log(vm.company);
    /*$scope.user = $localStorage.user;*/
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
      // console.log('get categories function');
      CategoryServiceRightPanel.query({}, function (res) {
        //  console.log('response from server side');
        //  console.log('response from server side: ' + JSON.stringify(res));
        $scope.accrdnsPanelArray = res;

      }, function (err) {
        console.log('error while getting the list from server side');
      })
    };

    $scope.getFrequentlyProducts = function () {
      //  console.log('getFrequentlyProducts function');
      FrequentlyProducts.query({}, function (res) {
        // console.log('response from server side');
        // console.log('response from server side:' + JSON.stringify(res));
        $scope.frequentProducts = res;
      }, function (err) {
        console.log('error while getting the list from server side');
      })
    }



    /* $scope.editProductFunc = function (productDetails) {
       // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));

       dataShare.setData(productDetails);
       $state.go('companies.add');
     }*/

    /*   $scope.userValidation = function () {
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
       }*/

    // console.log("product id there:" + $stateParams.companyId);


    if ($stateParams.companyId) {
      //  console.log("coming to correct list");
      //  console.log("coming to correct list@@@@:" + $stateParams.companyId);
      $scope.productIdIs = $stateParams.companyId;
      //  console.log("coming to correct list@@@@:" + $scope.productIdIs);
      CompanyServiceUpdate.getProduct.query({
        companyId: $scope.productIdIs
      }, vm.company, successgetProductCallback, errorgetProductCallback);

      function successgetProductCallback(res) {
        vm.company = res;
        // console.log("succes callback from get productdetails:" + JSON.stringify(res));
      }

      function errorgetProductCallback(res) {
        vm.error = res.data.message;
        console.log("error callback from get productdetails");
        NotificationFactory.error('Failed to get Product details...', res.data.message);
      }

    }

    /* $scope.loadCategories = function ($query) {
         var catsList = CategoryService.query(),
           defObj = $q.defer();
         return catsList.$promise.then(function (result) {
           defObj.resolve(result);
           return result.filter(function (catList) {
             return catList.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
           });
         });
         return defObj.promise;

       };*/


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

    /*    $scope.BackgroundImage = "https://www.sleekcover.com/covers/citizen-watch-facebook-cover.jpg";
        $scope.headerImgMainTitle = "Withings Activite Activity tracker";
        $scope.headerImgSubTitle = "ID 123456";
        $scope.prodImages = ['https://www.sleekcover.com/covers/independent-girl-facebook-cover.jpg', 'http://d2rfsfyh2505gh.cloudfront.net/wp-content/uploads/2015/07/Prabhas.jpg', 'http://www.latesthdwallpapers.in/photos/Allu-Arjun-facebook-best-hd-photos-free-for-mobile.jpg'];
        $scope.sampleDesc = "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.Only then, with the reader’s attention hooked,  ";*/


    //$scope.sName = "$state.current.name==='companies.view'"
    // console.log("sName:" + $state.current.name);



    $scope.changeLimit = function (pro) {
      if ($scope.limit == pro.description.length)
        $scope.limit = 100;
      else
        $scope.limit = pro.description.length;
    };

    /*$scope.dynamicPopover = {
      templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
    };*/
    /*$scope.hoveringOver = function (value) {
      //  console.log('hoveringOver is called');
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };*/


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
          CompanyServiceUpdate.DeleteProduct.remove({
            companyId: product.productId
          }, function (res) {
            //console.log('Res details on remove success cb : ' + JSON.stringify(res));
            $state.go('companies.list.products', {
              isSearch: false
            });
            NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
          }, function (err) {
            //console.log('Err details on remove Error cb : ' + JSON.stringify(err));
            NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
          })
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

        if (vm.company.productImageURL) {

        } else {
          vm.company.logo = {
            filetype: $scope.productImg.filetype,
            base64: $scope.productImg.base64
          };
        }
        // console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));
        vm.company.operationalRegions = $scope.operationalRegionsList;

        // console.log('adproduct1');
        CompanyServiceUpdate.UpdateProduct.update({
          companyId: vm.company.productId
        }, vm.company, successUpdateCallback, errorUpdateCallback);



      } else {

        // vm.company.ProCat = $scope.selectedCategory;
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);

        /*var replacedTitle = doc.Proname.replace(/\s/g, "-");
        productId: replacedTitle*/
        var productName = vm.company.Proname.replace(/\s/g, "-");
        // console.log("company productId :" + productName);

        vm.company.productId = productName;

        if (vm.company.productImageURL) {

        } else {
          vm.company.logo = {
            filetype: $scope.productImg.filetype,
            base64: $scope.productImg.base64
          };
        }

        //  console.log('Created product is called : ' + JSON.stringify(vm.company));
        // console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));

        //if ($scope.selectionOperational)
        vm.company.operationalRegions = $scope.operationalRegionsList;

        vm.company.$save(successCallback, errorCallback);


      }

      function successUpdateCallback(res) {
        $state.go('companies.list.products', {
          isSearch: false
        });
        NotificationFactory.success('Successfully Updated Product details...', 'Product Name : ' + res.Proname);
      }

      function errorUpdateCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to Update Product details...', res.data.message);
      }

      function successCallback(res) {
        $state.go('companies.list.products', {
          isSearch: false
        });
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
      //console.log('serviceOfferedSelectedArray sector vals : ' + JSON.stringify($scope.serviceOfferedSelectedArray));
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


    $scope.previewImg = function (val) {

      if (val)
        $scope.imgUrl = 'data:' + val.filetype + ';base64,' + val.base64;
      //console.log('Base 64 img details filetype is : ' + val.filetype);
    };


  }
})();
