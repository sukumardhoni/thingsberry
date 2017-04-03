(function () {
  'use strict';

  angular
    .module('core')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', 'Authentication', '$localStorage', '$stateParams', 'SearchProducts', 'ListOfProducts', '$location', 'dataShare', '$state', 'CategoryService', 'CategoryServiceRightPanel', 'FrequentlyProducts', '$timeout'];

  function CompanyListController(CompanyService, $scope, Authentication, $localStorage, $stateParams, SearchProducts, ListOfProducts, $location, dataShare, $state, CategoryService, CategoryServiceRightPanel, FrequentlyProducts, $timeout) {
    var vm = this;
    /* var pageId = 0;*/
    var loginUser;
    $scope.path = $location.absUrl();

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

    $scope.editProductFunc = function (productDetails) {
      /*console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));*/
      dataShare.setData(productDetails, $state.current.name);
      $state.go('home.add');
    };

    // $scope.carouselBg3 = [];
    $scope.getCategoriesForSide = function () {
      //  $scope.carouselBg3.push('carousel_spinner_featured');
      CategoryServiceRightPanel.query({}, function (res) {
        $scope.accrdnsPanelArray = res;
        // $scope.carouselBg3.pop('carousel_spinner_featured');
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

    $scope.authentication = Authentication;
    //  console.log("USER : " + JSON.stringify($scope.authentication));

    $scope.userDetails = $scope.authentication.user;
    // console.log("USER(OR)ADMIN:" + JSON.stringify($scope.userDetails));
    // console.log("USER(OR)ADMIN locastorage:" + JSON.stringify($localStorage.user));
    if (($scope.userDetails != "")) {
      // console.log("coming  to iff");
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
      $scope.pageId = 0;
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
      //  console.log("state params category : " + $stateParams.catId);
      // console.log("state params companyName : " + $stateParams.companyId);
      //  console.log("state params productName : " + $stateParams.productName);
      //  console.log("state params regions : " + $stateParams.regions);
      $scope.searchOrder.List = $scope.searchOrder.Lists[1].value;

      if (($stateParams.catId != undefined) && ($stateParams.companyId == undefined) && ($stateParams.productName == undefined)) {
        //console.log("Coming to category");
        SearchProducts.query({
          ProCategory: $stateParams.catId,
          ProCompany: 'Company',
          ProName: 'Product',
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });

      } else if (($stateParams.companyId != undefined) && ($stateParams.catId == undefined) && ($stateParams.productName == undefined)) {
        // console.log("Coming to companyName");
        SearchProducts.query({
          ProCategory: 'Category',
          ProCompany: $stateParams.companyId,
          ProName: 'Product',
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      } else if (($stateParams.companyId == undefined) && ($stateParams.catId == undefined) && ($stateParams.productName != undefined)) {
        // console.log("Coming to productName");
        SearchProducts.query({
          ProCategory: 'Category',
          ProCompany: 'Company',
          ProName: $stateParams.productName,
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      } else if (($stateParams.companyId != undefined) && ($stateParams.catId != undefined) && ($stateParams.productName == undefined)) {
        //  console.log("Coming to category and company");
        SearchProducts.query({
          ProCategory: $stateParams.catId,
          ProCompany: $stateParams.companyId,
          ProName: 'Product',
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      } else if (($stateParams.companyId != undefined) && ($stateParams.catId == undefined) && ($stateParams.productName != undefined)) {
        // console.log("Coming to product name and company name");
        SearchProducts.query({
          ProCategory: 'Category',
          ProCompany: $stateParams.companyId,
          ProName: $stateParams.productName,
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      } else if (($stateParams.companyId == undefined) && ($stateParams.catId != undefined) && ($stateParams.productName != undefined)) {
        // console.log("Coming to product name and category");
        SearchProducts.query({
          ProCategory: $stateParams.catId,
          ProCompany: 'Company',
          ProName: $stateParams.productName,
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      } else if (($stateParams.companyId != undefined) && ($stateParams.catId != undefined) && ($stateParams.productName != undefined)) {
        // console.log("Coming to product name and category");
        SearchProducts.query({
          ProCategory: $stateParams.catId,
          ProCompany: $stateParams.companyId,
          ProName: $stateParams.productName,
          ProRegions: null,
          pageId: $scope.pageId,
          adminStatus: loginUser
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      } else if (($stateParams.companyId == undefined) && ($stateParams.catId == undefined) && ($stateParams.productName == undefined)) {
        // console.log("Coming to list of products");
        ListOfProducts.query({
          adminStatus: loginUser,
          pageId: $scope.pageId
        }, function (res) {
          // console.log('response is : ' + JSON.stringify(res));
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          $scope.pageId++;
        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
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

      $state.go('home.companies.category', {
        catId: catArr
      });
    };

    /* window.onbeforeunload = function (event) {
       var message = 'Sure you want to leave?';
        if (typeof event == 'undefined') {
          event = window.onclose;
        }
        if (event) {
          event.returnValue = message;
        }
       return message;
     }*/
    /*$(window).scroll(function () {
      if ($(window).scrollTop() + window.innerHeight == $(document).height()) {
        alert("bottom!");
      }
    });*/

    $scope.noMoreProductsAvailable = false;
    $scope.LoadMoreProducts = function (val) {
      // console.log('LoadMoreProducts function is called' + JSON.stringify($scope.pageId));
      // console.log('LoadMoreProducts function is called' + JSON.stringify(val));
      if (val == false) {
        if ($scope.pageId != 0) {
          // console.log('LoadMoreProducts function pageId' + JSON.stringify($scope.pageId));
          var onScroll = {};
          $scope.spinnerLoading = true;
          if (($stateParams.catId != undefined) && ($stateParams.companyId == undefined) && ($stateParams.productName == undefined)) {
            // console.log("Coming to category");
            SearchProducts.query({
              ProCategory: $stateParams.catId,
              ProCompany: 'Company',
              ProName: 'Product',
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId == undefined) && ($stateParams.companyId != undefined) && ($stateParams.productName == undefined)) {
            // console.log("Coming to category");
            SearchProducts.query({
              ProCategory: 'Category',
              ProCompany: $stateParams.companyId,
              ProName: 'Product',
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId == undefined) && ($stateParams.companyId == undefined) && ($stateParams.productName != undefined)) {
            // console.log("Coming to category");
            SearchProducts.query({
              ProCategory: 'Category',
              ProCompany: 'Company',
              ProName: $stateParams.productName,
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId != undefined) && ($stateParams.companyId != undefined) && ($stateParams.productName == undefined)) {
            // console.log("Coming to category");
            SearchProducts.query({
              ProCategory: $stateParams.catId,
              ProCompany: $stateParams.companyId,
              ProName: 'Product',
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId == undefined) && ($stateParams.companyId != undefined) && ($stateParams.productName != undefined)) {
            //  console.log("Coming to category");
            SearchProducts.query({
              ProCategory: 'Category',
              ProCompany: $stateParams.companyId,
              ProName: $stateParams.productName,
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId != undefined) && ($stateParams.companyId == undefined) && ($stateParams.productName != undefined)) {
            //  console.log("Coming to category");
            SearchProducts.query({
              ProCategory: $stateParams.catId,
              ProCompany: 'Company',
              ProName: $stateParams.productName,
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId != undefined) && ($stateParams.companyId != undefined) && ($stateParams.productName != undefined)) {
            // console.log("Coming to category");
            SearchProducts.query({
              ProCategory: $stateParams.catId,
              ProCompany: $stateParams.companyId,
              ProName: $stateParams.productName,
              pageId: $scope.pageId,
              adminStatus: loginUser
            }, function (res) {
              //vm.companys = res;
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);
            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });

          } else if (($stateParams.catId == undefined) && ($stateParams.companyId == undefined) && ($stateParams.productName == undefined)) {
            // console.log("Coming to list of products in load more");
            ListOfProducts.query({
              adminStatus: loginUser,
              pageId: $scope.pageId
            }, function (res) {
              $scope.spinnerLoading = false;
              $scope.pageId++;
              onScroll = res.products;
              if (res.products.length == 0) {
                $scope.noMoreProductsAvailable = true;
              }
              var oldProducts = vm.companys;
              vm.companys = oldProducts.concat(onScroll);

            }, function (err) {
              console.log('Failed to fetch the product details : ' + JSON.stringify(err));
            });
          }
        }
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
