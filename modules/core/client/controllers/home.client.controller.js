'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'PremiumProducts', '$timeout', 'ourClients', 'featuredProducts', 'quotes', 'videos', '$sce',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, PremiumProducts, $timeout, ourClients, featuredProducts, quotes, videos, $sce) {

    var vm = this;


    $scope.spinnerLoading = true;

    $scope.myInterval = 0;

    $scope.noWrapSlides = false;
    $scope.active = 0;

    // $scope.headersearch=false;


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



    $scope.Advanced_Search_Fields = false;

    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES', 'ENTERTAINMENT', 'ACCESORIES',
'TOYS', 'SPORT', 'ELECTRONICS', 'OFFICE PRODUCTS', 'BABY PRODUCTS', 'MOTORS'];
    $scope.CountriesList = ['Country', 'INDIA', 'US', 'UK', 'CHINA', 'JAPAN', 'AUSTRALIA'];
    $scope.StatesList = ['State', 'ANDHRA PRADESH', 'NEW JERSY', 'LONDON', 'HONG KONG', 'SYDNEY'];
    $scope.BusinessList = ['Business', 'SMALL SCALE', 'LARGE SCALE', 'AUTOMOBILES', 'TRADING', 'MARKETING'];

    $scope.getSearchedProducts = function (details) {



      /*      console.log("entering into getsearchproducts :" + details);

            console.log('details outputBrowsers is : ' + JSON.stringify(details.outputBrowsers));
            console.log('details is : ' + JSON.stringify(details));
            details.regions = $scope.outputBrowsers;*/
      //  console.log('details is : ' + JSON.stringify(details));
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

          if ((catsArray == '') && (regionsArray == '') && (details.Company == undefined) && (details.Product == undefined)) {
            $state.go('companies.list.products', {
              isSearch: false
            });
          } else {
            $state.go('companies.list.products', {
              cat: (catsArray == '') ? 'Category' : catsArray,
              com: (details.Company == undefined) ? 'Company' : details.Company,
              name: (details.Product == undefined) ? 'Product' : details.Product,
              regions: (regionsArray == '') ? '' : regionsArray,
              isSearch: true
            });
          }
        }
      } else {
        $state.go('companies.list.products', {
          isSearch: false
        });
      }
    };


    /*$scope.homePageProductDetails = {
      title: 'SONY',
      logoURL: '../../../../modules/core/client/img/brand/sony logo.png',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      webAddress: 'http://www.sonos.com/shop/play5'
    };*/

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


    /* $scope.myInterval = 5000;
     var slides = $scope.slides = [];
     $scope.addSlide = function() {
       console.log('in the home controller');
       var newWidth = 600 + slides.length + 1;
       slides.push({
         image: 'http://placekitten.com/' + newWidth + '/300',
         text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
           ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
       });
     };
     for (var i=0; i<4; i++) {
       $scope.addSlide();
     };*/


    $scope.tbClients = function () {
      ourClients.query({}, function (res) {
          // console.log(res);
          $scope.clients = res;
        },
        function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
    };

    $scope.tbVideos = function () {
      $scope.carouselBg2.push('carousel_spinner_featured');
      videos.query({}, function (res) {
          $scope.videos = res;
          $timeout(function () {
            $scope.carouselBg2.pop('carousel_spinner_featured');
          }, 1000);
        },
        function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
    };


    $scope.featuredProducts = function () {
      // $scope.date = new Date();
      $scope.carouselBg1.push('carousel_spinner_featured');

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
        $timeout(function () {
          $scope.carouselBg1.pop('carousel_spinner_featured');
        }, 1000);


      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });

    };

    $scope.tbQuotes = function () {

      quotes.query({}, function (res) {
        // console.log(res);
        $scope.quotes = res;
        //  console.log('the length:' + JSON.stringify($scope.quotes));
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });

    }






    /*    $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides1 = $scope.slides1 = [];*/
    /*var slidesarray =$scope.slidesarray = [['slide1','slide2'],['slide3','slide4'],['slide5','slide6'],['slide7','slide8'],['slide9','slide10']];*/

    /*    var sample = $scope.sample = [];
        var slides3 = $scope.slides3 = [];
        var currIndex = 0;
        $scope.carouselBg = [];*/



    //    $scope.myInterval = 5000;
    //    $scope.noWrapSlides = false;
    //    $scope.active = 0;


    var slides1 = $scope.slides1 = [];
    var slides2 = $scope.slides2 = [];
    var slides3 = $scope.slides3 = [];
    var slides4 = $scope.slides4 = [];
    var currIndex = 0;
    $scope.carouselBg = [];
    $scope.carouselBg1 = [];
    $scope.carouselBg2 = [];


    $scope.premiumProducts = function () {
      // $scope.spinnerLoading = true;
      $scope.carouselBg.push('carousel_spinner');
      PremiumProducts.query({}, function (res) {

        $scope.premiumProducts = res;

        for (var i = 0; i < ($scope.premiumProducts.length); i++) {
          $scope.addSlide1($scope.premiumProducts[i]);
        }
        $scope.premiumPrdcts = $scope.listToMatrix($scope.slides1, 1);
        // console.log($scope.premiumPrdcts);
        $timeout(function () {
          $scope.carouselBg.pop('carousel_spinner');
        }, 1000);
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });
    };





    //
    //    $scope.getPremiumProducts = function () {
    //      $scope.carouselBg.push('carousel_spinner');
    //      PremiumProducts.query({}, function (res) {
    //        $scope.premiumProducts = res;
    //
    //        //console.log('the length:'+JSON.stringify($scope.premiumProducts));
    //        for (var i = 0; i < ($scope.premiumProducts.length); i++) {
    //          $scope.addSlide1($scope.premiumProducts[i]);
    //        }
    //
    //        $scope.sample = $scope.listToMatrix($scope.slides1, 2);
    //        // console.log('the resultant matrix'+JSON.stringify($scope.sample));
    //
    //        for (var k = 0; k < $scope.premiumProducts.length; k++) {
    //          $scope.addSlide3($scope.premiumProducts[k]);
    //        }
    //        $timeout(function () {
    //          $scope.carouselBg.pop('carousel_spinner');
    //        }, 1000);
    //
    //      }, function (err) {
    //        console.log('Failed to fetch the product details : ' + err);
    //      });
    //    };


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
    }


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
