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




  CompanyController.$inject = ['$scope', '$state', 'companyResolve', 'Authentication', '$localStorage', 'ratingService', 'NotificationFactory', '$timeout', 'dataShare', 'CompanyServiceUpdate', '$uibModal', '$log', '$q', 'CategoryService'];

  function CompanyController($scope, $state, company, Authentication, $localStorage, ratingService, NotificationFactory, $timeout, dataShare, CompanyServiceUpdate, $uibModal, $log, $q, CategoryService) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    //vm.save = save;
    vm.addCompanyDetails = addCompanyDetails;

    $scope.addBtnText = 'SUBMIT';
    /*$scope.user = $localStorage.user;*/

    var previousRatingValue;
    var localStorageRatingKey;

    $scope.user = $localStorage.user;

    var productname = vm.company.Proname;
    //  console.log("company details:" + vm.company.Proname);
    var productNameLowerCase = productname.replace(/[^a-zA-Z]/g, "").toLowerCase();


    if ($scope.user == undefined) {

      localStorageRatingKey = "guest" + productNameLowerCase;
      //console.log("userId:" + localStorageRatingKey);

    } else {

      localStorageRatingKey = $scope.user._id + productNameLowerCase;
      // console.log("userId:" + localStorageRatingKey);

    }

    $scope.rating = function (userRateValue) {


      $scope.ratevalue = userRateValue;


      if ($localStorage[localStorageRatingKey] == undefined) {

        previousRatingValue = 0;
        $localStorage[localStorageRatingKey] = $scope.ratevalue;

      } else {

        previousRatingValue = $localStorage[localStorageRatingKey];
        $localStorage[localStorageRatingKey] = $scope.ratevalue;

      }


      ratingService.update({
        companyId: vm.company._id,
        userRating: $scope.ratevalue,
        previousRatingValue: previousRatingValue
      }, vm.company, successCallback, errorCallback);


      function successCallback(res) {
        // console.log("coming from callback");
        $scope.rate = res.avgRatings;
        $scope.reviewsCount = res.totalRatingsCount;
      }


      function errorCallback(res) {
        console.log("coming from callback");
        NotificationFactory.error('Failed to update the product rating...', res.data.message);
      }

    };


    $scope.rate1 = $localStorage[localStorageRatingKey];

    $scope.isReadonly1 = false;

    $scope.rate = vm.company.avgRatings;
    $scope.reviewsCount = vm.company.totalRatingsCount;

    $scope.isReadonly = true;

    $scope.showMe = function () {

      $scope.showRatings = !$scope.showRatings;

    }

    $scope.hoverOut = function () {

      if ($localStorage[localStorageRatingKey]) {

        $scope.showRatings = !$scope.showRatings;

      } else {

        $scope.showRatings = true;
      }
    }


    if ($localStorage[localStorageRatingKey]) {

      $scope.showRatings = false;

    } else {

      $scope.showRatings = true;
    }


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


    $scope.loadCategories = function () {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      catsList.$promise.then(function (result) {
        //$scope.catsList = result;
        defObj.resolve(result);
        console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });
      return defObj.promise;
    };

    $scope.BackgroundImage = "https://www.sleekcover.com/covers/citizen-watch-facebook-cover.jpg";
    /*$scope.headerImgMainTitle = "Withings Activite Activity tracker";
    $scope.headerImgSubTitle = "ID 123456";*/
    $scope.prodImages = ['https://www.sleekcover.com/covers/independent-girl-facebook-cover.jpg', 'http://d2rfsfyh2505gh.cloudfront.net/wp-content/uploads/2015/07/Prabhas.jpg', 'http://www.latesthdwallpapers.in/photos/Allu-Arjun-facebook-best-hd-photos-free-for-mobile.jpg'];
    $scope.sampleDesc = "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.Only then, with the reader’s attention hooked,  ";

    $scope.date = new Date();
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
    $scope.hoveringOver = function (value) {
      //  console.log('hoveringOver is called');
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
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
          CompanyServiceUpdate.DeleteProduct.remove({
            companyId: product._id
          }, function (res) {
            //console.log('Res details on remove success cb : ' + JSON.stringify(res));
            $state.go('companies.list', {
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
      if (vm.company._id) {
        //console.log('Update product is called : ' + JSON.stringify(vm.company));
        //console.log('Update product is called : ' + JSON.stringify(vm.company._id));
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
        console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));
        vm.company.operationalRegions = $scope.operationalRegionsList;


        CompanyServiceUpdate.UpdateProduct.update({
          companyId: vm.company._id
        }, vm.company, successUpdateCallback, errorUpdateCallback);



      } else {

        // vm.company.ProCat = $scope.selectedCategory;
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);




        if (vm.company.productImageURL) {

        } else {
          vm.company.logo = {
            filetype: $scope.productImg.filetype,
            base64: $scope.productImg.base64
          };
        }

        console.log('Created product is called : ' + JSON.stringify(vm.company));
        console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));

        //if ($scope.selectionOperational)
        vm.company.operationalRegions = $scope.operationalRegionsList;

        vm.company.$save(successCallback, errorCallback);


      }

      function successUpdateCallback(res) {
        $state.go('companies.list', {
          isSearch: false
        });
        NotificationFactory.success('Successfully Updated Product details...', 'Product Name : ' + res.Proname);
      }

      function errorUpdateCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to Update Product details...', res.data.message);
      }

      function successCallback(res) {
        $state.go('companies.list', {
          isSearch: false
        });
        NotificationFactory.success('Successfully Saved Product details...', 'Product Name : ' + res.Proname);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to save Product details...', res.data.message);
      }



    }

    $scope.$on('data_shared', function () {
      var proDetails = dataShare.getData();

      if (proDetails.logo)
        $scope.previewImg(proDetails.logo);
      $scope.productImg = proDetails.logo;

      $scope.operationalRegionsList = (proDetails.operationalRegions.length != 0) ? proDetails.operationalRegions : $scope.operationalRegionsList;

      vm.company = proDetails;
    });

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
