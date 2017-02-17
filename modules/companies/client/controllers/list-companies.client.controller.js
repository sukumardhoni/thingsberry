(function () {
  'use strict';

  angular
    .module('core')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', 'Authentication', '$localStorage', '$stateParams', 'SearchProducts', 'ListOfProducts', '$location', 'dataShare', '$state', 'CategoryService', 'CategoryServiceRightPanel', 'FrequentlyProducts', '$timeout'];

  function CompanyListController(CompanyService, $scope, Authentication, $localStorage, $stateParams, SearchProducts, ListOfProducts, $location, dataShare, $state, CategoryService, CategoryServiceRightPanel, FrequentlyProducts, $timeout) {
    var vm = this;
    var pageId = 0;
    var loginUser;
    $scope.path = $location.absUrl();

    $scope.editProductFunc = function (productDetails) {
      /*console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));*/
      dataShare.setData(productDetails, $state.current.name);
      $state.go('home.companies.add');
    }

    $scope.carouselBg3 = [];
    $scope.getCategoriesForSide = function () {
      $scope.carouselBg3.push('carousel_spinner_featured');
      CategoryServiceRightPanel.query({}, function (res) {
        $scope.accrdnsPanelArray = res;
        $scope.carouselBg3.pop('carousel_spinner_featured');
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

    $scope.userDetails = $localStorage.user;
    // console.log("USER(OR)ADMIN:" + JSON.stringify($scope.userDetails));
    if ($scope.userDetails !== undefined) {

      if ($scope.userDetails.roles.indexOf('admin') == 1) {
        loginUser = 'admin';
      } else {
        loginUser = 'user';
      }
    } else {
      loginUser = 'user';
    }
    // console.log("USER(OR)ADMIN:" + JSON.stringify(loginUser));
    // console.log("USER :"+ JSON.stringify($localStorage.user));
    $scope.getSearchedProductsList = function () {

      $scope.gridView = true;
      $scope.grdView = function () {
        $scope.gridView = true;
        //  console.log("coming to div1 funct");
      }

      $scope.listView = function () {
          $scope.gridView = false;
        }
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
          adminStatus: loginUser,
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
          pageId: pageId,
          adminStatus: loginUser
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


    $scope.getCategoryProduct = function (Catproducts, CatHeading, catContentsMoreNames) {
      var catArr = [];

      if (Catproducts == 'More') {
        for (var i = 0; i < catContentsMoreNames.length; i++) {
          if (CatHeading == 'More') {
            var full = catContentsMoreNames[i].name;
          } else {
            full = CatHeading + '-' + catContentsMoreNames[i].name;
          }
          catArr.push(full);
        }
      } else if (CatHeading == 'More') {
        catArr.push(Catproducts);
      } else {
        var fullCategory = CatHeading + '-' + Catproducts;
        catArr.push(fullCategory);
      }


      if (Catproducts) {
        $scope.listActive1 = CatHeading;
        $scope.listActive = Catproducts;
      }

      $state.go('home.companies.list.products', {
        cat: catArr,
        com: 'Company',
        name: 'Product',
        regions: '',
        isSearch: true
      });
    };

    $scope.LoadMoreProducts = function () {
      // console.log('LoadMoreProducts function is called');
      var onScroll = {};
      $scope.spinnerLoading = true;
      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          adminStatus: loginUser,
          pageId: pageId
        }, function (res) {
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
      } else {
        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          pageId: pageId,
          adminStatus: loginUser
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

    /*   $scope.scrollPos = {}; // scroll position of each view

       $(window).on('scroll', function () {
         if ($scope.okSaveScroll) { // false between $routeChangeStart and $routeChangeSuccess
           $scope.scrollPos[$location.path()] = $(window).scrollTop();
           //console.log($scope.scrollPos);
         }
       });

       $scope.scrollClear = function (path) {
         $scope.scrollPos[path] = 0;
       }

       $scope.$on('$routeChangeStart', function () {
         $scope.okSaveScroll = false;
       });

       $scope.$on('$routeChangeSuccess', function () {
         $timeout(function () { // wait for DOM, then restore scroll position
           $(window).scrollTop($scope.scrollPos[$location.path()] ? $scope.scrollPos[$location.path()] : 0);
           $scope.okSaveScroll = true;
         }, 0);
       });*/

  }
})();
