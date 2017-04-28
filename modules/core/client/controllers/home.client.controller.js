'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'PremiumProducts', '$timeout', 'ourClients', 'featuredProducts', 'quotes', 'videos', '$sce', 'getDeactiveProducts', 'CleanUpInactiveService', 'ListOfProducts', 'NotificationFactory','ComingSoonProducts',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, PremiumProducts, $timeout, ourClients, featuredProducts, quotes, videos, $sce, getDeactiveProducts, CleanUpInactiveService, ListOfProducts, NotificationFactory,ComingSoonProducts) {

    var vm = this;


    $scope.spinnerLoading = true;

    $scope.myInterval = 0;

    $scope.noWrapSlides = false;
    $scope.active = 0;

    // $scope.headersearch=false;
    /* if ($state.current.name == "home") {
       $("html, body").animate({
         scrollTop: 0
       }, 200);
     }*/

    // This provides Authentication context.
    $scope.authentication = Authentication;
    //  console.log($scope.authentication);
    $scope.$on('youtube.player.playing', function ($event, player) {
      // console.log("@@@ payer playing called");
      $scope.disableControlls = true;
    });
    $scope.$on('youtube.player.paused', function ($event, player) {
      // console.log("@@@ payer playing called");
      $scope.disableControlls = false;
    });

    /*  var scrollContent = function () {
        // Your favorite scroll method here
        $('html, body').animate({
          scrollTop: -10000
        }, 100);
      }*/


    $scope.Advanced_Search_Fields = false;

    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES', 'ENTERTAINMENT', 'ACCESORIES',
'TOYS', 'SPORT', 'ELECTRONICS', 'OFFICE PRODUCTS', 'BABY PRODUCTS', 'MOTORS'];
    $scope.CountriesList = ['Country', 'INDIA', 'US', 'UK', 'CHINA', 'JAPAN', 'AUSTRALIA'];
    $scope.StatesList = ['State', 'ANDHRA PRADESH', 'NEW JERSY', 'LONDON', 'HONG KONG', 'SYDNEY'];
    $scope.BusinessList = ['Business', 'SMALL SCALE', 'LARGE SCALE', 'AUTOMOBILES', 'TRADING', 'MARKETING'];

    $scope.getSearchedProducts = function (details) {

      if (details != undefined) {
        if (details.Category || details.Company || details.Product || details.outputBrowsers) {
          var catsArray = [];
          var regionsArray = [];
          if (details.Category) {
            if (details.Category.length > 0) {
              for (var i = 0; i < details.Category.length; i++) {
                catsArray.push(details.Category[i].title);
              }
            } else {
              catsArray.push(details.Category.title);
            }
          }
          if (details.outputBrowsers) {
            //console.log('details.outputBrowsers is : ' + JSON.stringify(details.outputBrowsers));

            if (details.outputBrowsers.length > 0) {
              for (var i = 0; i < details.outputBrowsers.length; i++) {
                regionsArray.push(details.outputBrowsers[i].name);
              }
            } else {
              regionsArray.push(details.outputBrowsers.name);
            }
          }
          // console.log("catsArray : " + JSON.stringify(catsArray));
          // console.log("company : " + JSON.stringify(details.Company));
          //  console.log("Product : " + JSON.stringify(details.Product));
          if ((catsArray == '') && (regionsArray == '') && (details.Company == undefined) && (details.Product == undefined)) {
            $state.go('home.companies.products');
          } else if ((catsArray != undefined) && (regionsArray == '') && ((details.Company == undefined) || (details.Company == '')) && ((details.Product == undefined) || (details.Product == ''))) {
            //  console.log("only category");
            $state.go('home.companies.category', {
              catId: catsArray
            });
          } else if ((catsArray == '') && (regionsArray == '') && ((details.Company != undefined) || (details.Company != '')) && ((details.Product == undefined) || (details.Product == ''))) {
            // console.log("only companyName");
            $state.go('home.companies.companyName', {
              companyId: details.Company
            });
          } else if ((catsArray == '') && (regionsArray == '') && ((details.Company == undefined) || (details.Company == '')) && ((details.Product != undefined) || (details.Product != ''))) {
            // console.log("only productName");
            $state.go('home.companies.productName', {
              productName: details.Product
            });
          } else if ((catsArray != undefined) && (regionsArray == '') && ((details.Company != undefined) || (details.Company != '')) && ((details.Product == undefined) || (details.Product == ''))) {
            // console.log("only categoryAndCompany");
            $state.go('home.companies.categoryAndCompany', {
              catId: catsArray,
              companyId: details.Company
            });
          } else if ((catsArray == '') && (regionsArray == '') && ((details.Company != undefined) || (details.Company != '')) && ((details.Product != undefined) || (details.Product != ''))) {
            //  console.log("only companyAndproduct");
            $state.go('home.companies.companyAndproduct', {
              companyId: details.Company,
              productName: details.Product
            });
          } else if ((catsArray != undefined) && (regionsArray == '') && ((details.Company == undefined) || (details.Company == '')) && ((details.Product != undefined) || (details.Product != ''))) {
            //  console.log("only categoryAndproduct");
            $state.go('home.companies.categoryAndproduct', {
              catId: catsArray,
              productName: details.Product
            });
          } else if ((catsArray != undefined) && (regionsArray == '') && ((details.Company != undefined) || (details.Company != '')) && ((details.Product != undefined) || (details.Product != ''))) {
            // console.log("only categoryAndCompanyAndProduct");
            $state.go('home.companies.categoryAndCompanyAndProduct', {
              catId: catsArray,
              companyId: details.Company,
              productName: details.Product
            });
          }
        }
      } else {
        $state.go('home.companies.products');
      }
    };


    $scope.loadCategories = function ($query) {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      // console.log(JSON.stringify(catsList));
      return catsList.$promise.then(function (result) {
        //$scope.catsList = result;
        defObj.resolve(result);
        return result.filter(function (catList) {
          return catList.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
        // console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });
      //console.log('defferes1111 obj : ' + JSON.stringify(defObj));
      return defObj.promise;
    };

    $scope.loadSearchCategories = function ($query) {
      // console.log($query);
      var catsList = ['Home', 'Healthcare', 'Wearable', 'Sports', 'Fitness', 'Accessories', 'Electronics'];

      return catsList.filter(function (list) {
        return list.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });

    };


    $scope.loadRegions = function () {

      var regions = [{
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
    }
  ];

      var deferred = $q.defer();
      deferred.resolve(regions);
      return deferred.promise;

    };



   $scope.tbClients = function () {
      $scope.clients = [{
          "description": "",
          "clientUrl": "https://www.fitbit.com",
          "clientName": "FITBIT"
      },
        {
          "description": "",
          "clientUrl": "http://www2.meethue.com/en-in/productdetail/philips-hue-bridge",
          "clientName": "PHILIPS"
        },
        {
          "description": "",
          "clientUrl": "http://www.wink.com/",
          "clientName": "WINK"
        },
        {
          "description": "",
          "clientUrl": "http://www.withings.com/uk/en/products/withings-go",
          "clientName": "WITHINGS"
        },
        {
          "description": "",
          "clientUrl": "http://www.belkin.com",
          "clientName": "BELKIN"
        },
        {
          "description": "",
          "clientUrl": "http://www.chamberlain.com/",
          "clientName": "CHAMBERLAIN"
        }];

      /*  ourClients.query({}, function (res) {
            // console.log(res);
            $scope.clients = res;
          },
          function (err) {
            console.log('Failed to fetch the product details : ' + err);
          });*/
    };

    $scope.tbVideos = function () {
      //$scope.showSpinner = true;
      $scope.videos = [
        {
          "description": "",
          "videoId": "qqjTu3UKe64",
          "title": "Simple smart home upgrades"
      },
        {
          "description": "",
          "videoId": "Zm0HTAwSSi0",
          "title": "3 Smart Personal Health Care Management Devices | Gadgets | New | Technology"
        },
        {
          "description": "",
          "videoId": "N5pzEgFAadU",
          "title": "The Next-gen Home Automation"
        }
      ];

      /*  videos.query({}, function (res) {
            $scope.videos = res;
            $scope.showSpinner = false;
          },
          function (err) {
            console.log('Failed to fetch the product details : ' + err);
          });*/
    };


    $scope.featuredProducts = function () {
      // $scope.date = new Date();
      /*$scope.carouselBg1.push('carousel_spinner_featured');*/

      featuredProducts.query({}, function (res) {
        // console.log(res);
        $scope.featuredProducts = res;
        // console.log('the length:' + JSON.stringify($scope.featuredProducts.length));
        for (var i = 0; i < ($scope.featuredProducts.length); i++) {
          $scope.addSlide2($scope.featuredProducts[i]);
        }
        $scope.sample = $scope.listToMatrix($scope.slides2, 3);
        // console.log('the resultant matrix' + JSON.stringify($scope.sample));

        for (var j = 0; j < ($scope.featuredProducts.length); j++) {
          $scope.addSlide3($scope.featuredProducts[j]);
        }
        $scope.sampleInSm = $scope.listToMatrix($scope.slides3, 2);
        // console.log('the resultant matrix' + JSON.stringify($scope.sampleInSm));

        for (var k = 0; k < $scope.featuredProducts.length; k++) {
          $scope.addSlide4($scope.featuredProducts[k]);
        }
        $scope.sampleInXs = $scope.listToMatrix($scope.slides4, 1);
        // console.log('the resultant matrix' + JSON.stringify($scope.sampleInXs));
        /*  $timeout(function () {
            $scope.carouselBg1.pop('carousel_spinner_featured');
          }, 1000);*/


      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });

    };

     $scope.comingSoonPrdcts=function(){
      ComingSoonProducts.query({}, function (res) {
            $scope.comingSoonProductsRes = res;
        // console.log('the length:' + JSON.stringify($scope.featuredProducts.length));
        for (var l = 0; l < ($scope.comingSoonProductsRes.length); l++) {
          $scope.comingSoonProdsAddSlide2($scope.comingSoonProductsRes[l]);
        }
        $scope.comingSoonPrdctsInMd = $scope.listToMatrix($scope.cmngSoonSlide2, 3);
        // console.log('the resultant matrix' + JSON.stringify($scope.sample));

        for (var m = 0; m < ($scope.comingSoonProductsRes.length); m++) {
          $scope.comingSoonProdsAddSlide3($scope.comingSoonProductsRes[m]);
        }
        $scope.comingSoonPrdctsInSM = $scope.listToMatrix($scope.cmngSoonSlide3, 2);
         // console.log('the resultant matrix' + JSON.stringify($scope.sampleInSm));

        for (var n = 0; n < $scope.comingSoonProductsRes.length; n++) {
          $scope.comingSoonProdsAddSlide4($scope.comingSoonProductsRes[n]);
        }
        $scope.comingSoonPrdctsInXs = $scope.listToMatrix($scope.cmngSoonSlide4, 1);
        // console.log('the resultant matrix' + JSON.stringify($scope.sampleInXs));
        /*  $timeout(function () {
            $scope.carouselBg1.pop('carousel_spinner_featured');
          }, 1000);*/
      })
    }

    $scope.tbQuotes = function () {
      quotes.query({}, function (res) {
        // console.log(res);
        $scope.quotes = res;
        //  console.log('the length:' + JSON.stringify($scope.quotes));
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });

    }

    var slides1 = $scope.slides1 = [];
    var slides2 = $scope.slides2 = [];
    var slides3 = $scope.slides3 = [];
    var slides4 = $scope.slides4 = [];
     var cmngSoonSlide2 = $scope.cmngSoonSlide2 = [];
    var cmngSoonSlide3 = $scope.cmngSoonSlide3 = [];
    var cmngSoonSlide4 = $scope.cmngSoonSlide4 = [];
    var currIndex = 0;
    $scope.carouselBg = [];
    $scope.carouselBg1 = [];
    $scope.carouselBg2 = [];


    $scope.premiumProducts = function () {
      $scope.spinnerShow = true;
      /* $scope.carouselBg.push('carousel_spinner');*/
      PremiumProducts.query({}, function (res) {
        $scope.premiumProducts = res;
        for (var i = 0; i < ($scope.premiumProducts.length); i++) {
          $scope.addSlide1($scope.premiumProducts[i]);
        }
        $scope.premiumPrdcts = $scope.listToMatrix($scope.slides1, 1);
        $scope.spinnerShow = false;
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });
    };


    $scope.listToMatrix = function (list, elementsPerSubArray) {
      //console.log('calling to listtomatrix function');
      var matrix = [],
        i, k;
      for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
          k++;
          matrix[k] = [];
        }
        matrix[k].push(list[i]);
      }
      return matrix;
      //console.log('the resultant matrix:'+matrix);
    }

    $scope.addSlide1 = function (details) {
      slides1.push(details);
    };

    $scope.addSlide2 = function (details) {
      slides2.push(details);
    };

    $scope.addSlide3 = function (details) {
      slides3.push(details);
    };
    $scope.addSlide4 = function (details) {
      slides4.push(details);
    };
    $scope.comingSoonProdsAddSlide2 = function (details) {
      cmngSoonSlide2.push(details);
    };

    $scope.comingSoonProdsAddSlide3 = function (details) {
      cmngSoonSlide3.push(details);
    };

    $scope.comingSoonProdsAddSlide4 = function (details) {
      cmngSoonSlide4.push(details);
    };




    $scope.modernBrowsers = [{
        name: "Africa"
    }, {
        name: "Asia-Pacific"
    }, {
        name: "Europe"
    }, {
        name: "Latin America"
    }, {
        name: "Middle East"
    }, {
        name: "North America"
    }, {
        name: "All Regions"
    }
  ];



    $scope.fOpen = function () {
      //console.log('On-open');
    }

    $scope.fClose = function () {
      //console.log('On-close');
    }

    $scope.fClick = function (data) {
      console.log('On-item-click');
      //console.log('On-item-click - data:');
      //console.log(data);
    }

    $scope.fSelectAll = function () {
      //console.log('On-select-all');
    }

    $scope.fSelectNone = function () {
      //console.log('On-select-none');
    }

    $scope.fReset = function () {
      //console.log('On-reset');
    }

    $scope.fClear = function () {
      //console.log('On-clear');
    }

    $scope.fSearchChange = function (data) {
      console.log('On-search-change');
      console.log('On-search-change - keyword: ' + data.keyword);
      //console.log('On-search-change - result: ');
      //console.log(data.result);
    };


    $scope.getAllDeactivePrdcts = function () {
      getDeactiveProducts.query({}, function (res) {
        // console.log("ALL DEACTIEV PRDCTS : " + JSON.stringify(res));
        $scope.deactiveProducts = res;
      }, function (err) {
        console.log("ALL DEACTIEV PRDCTS ERR : " + JSON.stringify(err));
      })
    };


    /*  $scope.getAllProductsCount = function () {

        ListOfProducts.query({
          adminStatus: 'admin',
          pageId: 0
        }, function (res) {
          // console.log('response is : ' + JSON.stringify(res));
          // vm.companys = res.products;
          $scope.AllProductsCount = res.count;
        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      };*/

    //  console.log("Out side Cleanup  :" + JSON.stringify($scope.cleanUp));
    /*$scope.deactivateErrorImageProds = function () {
      console.log("inside side Cleanup  :" + JSON.stringify($scope.forDeactivateprods));
      CleanUpInactiveService.query({
        startFrom: $scope.forDeactivateprods.startFrom,
        endTo: $scope.forDeactivateprods.endTo,
        updateBool: true
      }, function (res) {
        console.log('successfully fetch the details :' + JSON.stringify(res));
      }, function (err) {
        console.log('Failed to fetch the details :' + JSON.stringify(err));
      });
    }*/

    var skipPageId = 0;
    $scope.errorProdArr = [];
    $scope.cleanUpInactive = function () {
      $scope.showSpinner = true;
      // skipPageId++;
      CleanUpInactiveService.query({
        skipPageId: skipPageId
      }, function (res) {
        $scope.showSpinner = false;
        if (res.fullySearched == false) {
          res.skipPageId = skipPageId;
          skipPageId++;
          $scope.resultantObj = res;
          if (res.to > $scope.AllProductsCount) {
            var endCount = res.to - 50;
            var resultCount = $scope.AllProductsCount - endCount;
            $scope.resultantObj.to = endCount + resultCount;
          }
          $scope.errorProdArr.push(res);
        } else {
          $scope.completeSearched = true;
        }


        // console.log('successfully fetch the details :' + JSON.stringify(res));
      }, function (err) {
        console.log('Failed to fetch the details :' + JSON.stringify(err));
      })
    };

    $scope.deactivateErrorImageProds = function (clickedSkipPageId, indexNum) {
      CleanUpInactiveService.query({
        skipPageId: clickedSkipPageId.skipPageId,
        updateBool: true
      }, function (res) {
        if (indexNum == clickedSkipPageId.skipPageId) {
          $scope.deativatedText = indexNum;
        }
        NotificationFactory.success('Founded ' + res.count + ' error image products are deactivated ');
        // $scope.errorProdArr.splice(_.indexOf($scope.errorProdArr, _.findWhere($scope.errorProdArr, clickedSkipPageId)), 1);
      })
    };


    /* $scope.cleanUpInactive = function () {
       console.log("Cleanup form details :" + JSON.stringify($scope.cleanUp));
       $scope.forDeactivateprods = {
         startFrom: $scope.cleanUp.startFrom,
         endTo: $scope.cleanUp.endTo
       };
       $scope.showSpinner = true;
       CleanUpInactiveService.query({
         startFrom: $scope.cleanUp.startFrom,
         endTo: $scope.cleanUp.endTo
       }, function (res) {
         console.log('successfully fetch the details :' + JSON.stringify(res));
         var afterSearchStartNum = 0;

         $scope.productsLength = {
           count: res.length,
           startNum: $scope.cleanUp.startFrom,
           endNum: $scope.cleanUp.endTo
         };
         $scope.showSpinner = false;
         afterSearchStartNum = parseInt($scope.cleanUp.endTo) + 1;
         console.log("### : " + afterSearchStartNum);
         $scope.cleanUp = {
           startFrom: afterSearchStartNum,
           endTo: ''
         };

       }, function (err) {
         console.log('Failed to fetch the details :' + JSON.stringify(err));
       })

     };*/


        }]);
angular.module('core').directive('myYoutube', function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },

    /*template: '<div class="videoBox embed-responsive" ><iframe style="overflow:hidden;height:100%;width:100%" controls="0" src="{{url}}" frameborder="0" allowfullscreen webkitallowfullscreen mozallowfullscreen ng-click="pauseOrPlay()"></iframe></div>',*/
    template: '<youtube-video class="videoBox embed-responsive" video-url="url"></youtube-video>',
    link: function (scope, element) {
      scope.$watch('code', function (newVal) {
        console.log("Called");
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal + "?rel=0&iv_load_policy=3&amp;controls=1&amp;showinfo=0");
        }
      });
    }
  };
});
