(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyController', CompanyController);

  CompanyController.$inject = ['$scope', '$state', 'companyResolve', 'Authentication', 'NotificationFactory', '$timeout'];

  function CompanyController($scope, $state, company, Authentication, NotificationFactory, $timeout) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addCompanyDetails = addCompanyDetails;






    //vm.company.





    // Remove existing company
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.company.$remove($state.go('company.list'));
      }
    }

    // Save company
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company._id) {
        vm.company.$update(successCallback, errorCallback);
      } else {
        vm.company.$save(successCallback, errorCallback);
      }

      function successCallback(res) {

        $timeout(function () {
          $state.go('company.view', {
            companyId: res._id
          });
        }, 7000);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }



    // addCompanyDetails company
    function addCompanyDetails(isValid) {

      console.log('Add company method is called' + isValid);


      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company._id) {
        vm.company.$update(successCallback, errorCallback);
      } else {

        vm.company.ProCat = $scope.selectedCategory;
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);



        function genBusinessArray(businessArray) {
          //console.log('genBusinessArray length : ' + businessArray.length);
          //console.log('genBusinessArray length : ' + JSON.stringify(businessArray));
          var businessSecArr = [];
          for (var i = 0; i < businessArray.length; i++) {
            businessSecArr.push(businessArray[i].id)
          }
          if (businessArray.length === businessSecArr.length) {
            //console.log('returning the array generated : ' + JSON.stringify(businessSecArr));
            return businessSecArr;
          }
        }


        vm.company.logo = {
          filetype: $scope.productImg.filetype,
          base64: $scope.productImg.base64
        };


        vm.company.$save(successCallback, errorCallback);


        //console.log('Company details from the form : ' + JSON.stringify(vm.company));


      }

      function successCallback(res) {
        console.log('Company details from the server after successfully saved : ' + JSON.stringify(res));
        $state.go('companies.list');
        NotificationFactory.success('Successfully Saved Product details...', 'Product Name : ' + res.Proname);
        /*$state.go('company.view', {
          companyId: res._id
        });*/
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }


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
    }




    $scope.removebusinessSectorSelectedVal = function (indexVal) {
      $scope.businessSectorSelectedArray.splice(indexVal, 1);
      console.log('Business sector vals : ' + JSON.stringify($scope.businessSectorSelectedArray));
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
    }




    $scope.removeserviceOfferedSelectedVal = function (indexVal) {
      $scope.serviceOfferedSelectedArray.splice(indexVal, 1);
      console.log('serviceOfferedSelectedArray sector vals : ' + JSON.stringify($scope.serviceOfferedSelectedArray));
    };


    $scope.operationalRegionsList = ['Africa', 'Asia-Pacific', 'Europe', 'Latin America', 'Middle East', 'North America', 'All Regions'];

    $scope.selectionOperational = {
      ids: {}
    }


    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES'];
    $scope.SelectedCat = function (val) {
      console.log('SelectedCat cal is : ' + val);
    }



    $scope.previewImg = function (val) {
      $scope.imgUrl = 'data:' + val.filetype + ';base64,' + val.base64;
      //console.log('Base 64 img details : ' + JSON.stringify($scope.productImg));
    };



    $scope.uploadProImg = function () {
      //console.log('Base 64 img details : ' + JSON.stringify($scope.productImg));

      var ref = new Firebase("https://thingsberry.firebaseio.com/productImages");
      var proImgRef = ref.child(vm.company.Proname);

      proImgRef.set({
        filetype: $scope.productImg.filetype,
        base64: $scope.productImg.base64
      }, function (error, proImgData) {
        if (error) {
          console.log("IMage could not be saved." + error);
        } else {
          console.log("IMage saved successfully.");
        }
      });


    };


  }
})();
