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




  CompanyController.$inject = ['$scope', '$state', 'companyResolve', 'Authentication', 'NotificationFactory', '$timeout', 'dataShare', 'CompanyServiceUpdate', '$uibModal', '$log'];

  function CompanyController($scope, $state, company, Authentication, NotificationFactory, $timeout, dataShare, CompanyServiceUpdate, $uibModal, $log) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    //vm.save = save;
    vm.addCompanyDetails = addCompanyDetails;

    $scope.addBtnText = 'SUBMIT';

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
            $state.go('companies.list');
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

      $scope.addBtnText = 'Submiting...';

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company._id) {
        //console.log('Update product is called : ' + JSON.stringify(vm.company.Proname));
        //console.log('Update product is called : ' + JSON.stringify(vm.company._id));
        //vm.company.$update(successUpdateCallback, errorUpdateCallback);
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);



        vm.company.logo = {
          filetype: $scope.productImg.filetype,
          base64: $scope.productImg.base64
        };

        CompanyServiceUpdate.UpdateProduct.update({
          companyId: vm.company._id
        }, vm.company, successUpdateCallback, errorUpdateCallback);



      } else {

        // vm.company.ProCat = $scope.selectedCategory;
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);



        vm.company.logo = {
          filetype: $scope.productImg.filetype,
          base64: $scope.productImg.base64
        };

        //console.log('Created product is called : ' + JSON.stringify(vm.company.ProCat));
        vm.company.$save(successCallback, errorCallback);


      }

      function successUpdateCallback(res) {
        $state.go('companies.list');
        NotificationFactory.success('Successfully Updated Product details...', 'Product Name : ' + res.Proname);
      }

      function errorUpdateCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to Update Product details...', res.data.message);
      }

      function successCallback(res) {
        $state.go('companies.list');
        NotificationFactory.success('Successfully Saved Product details...', 'Product Name : ' + res.Proname);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to save Product details...', res.data.message);
      }



    }

    $scope.$on('data_shared', function () {
      var proDetails = dataShare.getData();
      $scope.previewImg(proDetails.logo);
      $scope.productImg = proDetails.logo;
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


    $scope.operationalRegionsList = ['Africa', 'Asia-Pacific', 'Europe', 'Latin America', 'Middle East', 'North America', 'All Regions'];

    $scope.selectionOperational = {
      ids: {}
    };


    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES'];
    $scope.SelectedCat = function (val) {
      //console.log('SelectedCat cal is : ' + val);
    };



    $scope.previewImg = function (val) {
      $scope.imgUrl = 'data:' + val.filetype + ';base64,' + val.base64;
      //console.log('Base 64 img details filetype is : ' + val.filetype);
    };



  }
})();
