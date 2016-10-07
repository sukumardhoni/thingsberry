(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', 'Authentication', '$localStorage', '$stateParams', 'SearchProducts', 'ListOfProducts', '$location', 'dataShare', '$state'];

  function CompanyListController(CompanyService, $scope, Authentication, $localStorage, $stateParams, SearchProducts, ListOfProducts, $location, dataShare, $state) {
    var vm = this;
    var pageId = 0;
    $scope.path = $location.absUrl();

    $scope.editProductFunc = function (productDetails) {
      /*console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));*/
      console.log('Edit Product details on Direc. : ');
      console.log($state.current.name);
      dataShare.setData(productDetails, $state.current.name);
      $state.go('companies.add');
    }

    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    /*CompanyService.query(function (res) {
  //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
  vm.companys = res;
});*/
    // article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString() ? true : false;

    /* if($localStorage.user.roles.indexOf('admin')!==-1){
       console.log("admin is there");
     }else{
       console.log("admin not there");
     }*/
    $scope.userDetails = $localStorage.user;
    // console.log("USER :"+ JSON.stringify(Authentication));
    // console.log("USER :"+ JSON.stringify($localStorage.user));
    $scope.getSearchedProductsList = function () {


      //  console.log("Entering into getsearchproductslists");

      // var pageId = 0;

      if ($stateParams.cat == 'Home') {
        //console.log('HOME')
        $scope.productsDisplayText = 'Home Products'
      } else if ($stateParams.cat == 'Automobile') {
        //console.log('AUTOMOBILE')
        $scope.productsDisplayText = 'Automobile Products'
      } else if ($stateParams.cat == 'Healthcare') {
        //console.log('HEALTH')
        $scope.productsDisplayText = 'Health Care Products'
      } else if ($stateParams.cat == 'Utilities') {
        //console.log('UTILITIES')
        $scope.productsDisplayText = 'Utilities Products'
      } else if ($stateParams.cat && $stateParams.isSearch) {
        //console.log('$stateParams.cat && $stateParams.isSearch')
        $scope.productsDisplayText = 'Search Results';
      } else {
        //console.log('ELSE')
        $scope.productsDisplayText = 'All Products';
      }
      $scope.totalItems = $scope.getSearchedProductsList.length;
      $scope.currentPage = 1;
      $scope.itemsPerPage = 12;
      $scope.maxSize = 2;

      $scope.gridView = true;
      $scope.grdView = function () {
        $scope.gridView = true;
        //  console.log("coming to div1 funct");
      }

      $scope.listView = function () {
        $scope.gridView = false;
      }
      $scope.date = new Date();

      //console.log('$stateParams.isSearch is : ' + $stateParams.isSearch);

      $scope.spinnerLoading = true;
      $scope.searchOrder = {};
      $scope.searchOrder.Lists = [
        /*{
          'name': 'Sort by',
          'value': ''
        },*/
        {
          'name': 'Sort by Ratings',
          'value': 'created'
        },
        {
          'name': 'Sort by Newest',
          'value': '-created'
        }
  ];
      $scope.searchOrder.List = $scope.searchOrder.Lists[1].value;

      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          pageId: pageId
        }, function (res) {
          //console.log('response is : ' + JSON.stringify(res));
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;

          pageId++;

        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {

        $scope.CatName = $stateParams.cat;

        //console.log('$stateParams.cat is :' + $stateParams.cat);
        //console.log('$stateParams.cat is :' + $stateParams.cat.length);

        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          ProRegions: $stateParams.regions,
          pageId: pageId
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      }
    };



    $scope.LoadMoreProducts = function () {
      //console.log('LoadMoreProducts function is called');
      var onScroll = {};
      $scope.spinnerLoading = true;
      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          pageId: pageId
        }, function (res) {
          //vm.companys = res;
          $scope.spinnerLoading = false;
          pageId++;
          onScroll = res.products;
          if (res.length == 0) {
            $scope.noMoreProductsAvailable = true;
          }
          var oldProducts = vm.companys;
          vm.companys = oldProducts.concat(onScroll);

        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {
        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          pageId: pageId
        }, function (res) {
          //vm.companys = res;
          $scope.spinnerLoading = false;
          pageId++;
          onScroll = res.products;
          if (res.length == 0) {
            $scope.noMoreProductsAvailable = true;
          }
          var oldProducts = vm.companys;
          vm.companys = oldProducts.concat(onScroll);
        }, function (err) {
          console.log('Failed to fetch the product details : ' + JSON.stringify(err));
        });
      }


    };



  }
})();
