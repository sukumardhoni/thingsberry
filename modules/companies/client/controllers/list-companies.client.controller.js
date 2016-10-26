(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', 'Authentication', '$localStorage', '$stateParams', 'SearchProducts', 'ListOfProducts', '$location', 'dataShare', '$state', 'CategoryService', 'CategoryServiceRightPanel', 'FrequentlyProducts'];

  function CompanyListController(CompanyService, $scope, Authentication, $localStorage, $stateParams, SearchProducts, ListOfProducts, $location, dataShare, $state, CategoryService, CategoryServiceRightPanel, FrequentlyProducts) {
    var vm = this;
    var pageId = 0;
    $scope.path = $location.absUrl();

    $scope.editProductFunc = function (productDetails) {
      /*console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));*/
      // console.log('Edit Product details on Direc. : ');
      //  console.log($state.current.name);
      dataShare.setData(productDetails, $state.current.name);
      $state.go('companies.add');
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
      // console.log('getFrequentlyProducts function');
      FrequentlyProducts.query({}, function (res) {
        // console.log('response from server side');
        // console.log('response from server side:' + JSON.stringify(res));
        $scope.frequentProducts = res;
      }, function (err) {
        console.log('error while getting the list from server side');
      })
    }


    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    /*CompanyService.query(function (res) {
  //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
  vm.companys = res;
});*/
    // article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString() ? true : false;

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
          // console.log('response is : ' + JSON.stringify(res));
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


    $scope.getCategoryProduct = function (Catproducts) {
      $state.go('companies.list', {
        cat: Catproducts,
        com: 'Company',
        name: 'Product',
        regions: '',
        isSearch: true
      });
      // console.log('in controller with getCategoryProduct ');

      /* {
               cat: (catsArray == '') ? 'Category' : catsArray,
               com: (details.Company == undefined) ? 'Company' : details.Company,
               name: (details.Product == undefined) ? 'Product' : details.Product,
               regions: (regionsArray == '') ? '' : regionsArray,
               isSearch: true
             }*/
      /*    GetCatProducts.query({
            getCatProducts: Catproducts
          }, function (res) {
            console.log("succesfully geting product");
            console.log(JSON.stringify(res));
            $scope.catSearchPrdcts = true;
            vm.companys = res.products;
          }, function (err) {
            console.log("error while getting product");
          })*/
    }




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
