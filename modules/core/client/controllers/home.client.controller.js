'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'PremiumProducts', '$timeout',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, PremiumProducts, $timeout) {

    var vm = this;

    // This provides Authentication context.
    $scope.authentication = Authentication;


    $scope.Advanced_Search_Fields = false;

    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES', 'ENTERTAINMENT', 'ACCESORIES',
'TOYS', 'SPORT', 'ELECTRONICS', 'OFFICE PRODUCTS', 'BABY PRODUCTS', 'MOTORS'];
    $scope.CountriesList = ['Country', 'INDIA', 'US', 'UK', 'CHINA', 'JAPAN', 'AUSTRALIA'];
    $scope.StatesList = ['State', 'ANDHRA PRADESH', 'NEW JERSY', 'LONDON', 'HONG KONG', 'SYDNEY'];
    $scope.BusinessList = ['Business', 'SMALL SCALE', 'LARGE SCALE', 'AUTOMOBILES', 'TRADING', 'MARKETING'];

    $scope.getSearchedProducts = function (details) {

      //console.log('details is : ' + JSON.stringify(details));
      if (details != undefined) {
        if (details.Category || details.Company || details.Product) {
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
          if (details.regions) {
            if (details.regions.length > 0) {
              for (var i = 0; i < details.regions.length; i++) {
                regionsArray.push(details.regions[i].name);
              }
            } else {
              regionsArray.push(details.regions.name);
            }
          }
          if ((catsArray == '') && (details.Company == undefined) && (details.Product == undefined)) {
            $state.go('companies.list', {
              isSearch: false
            });
          } else {
            $state.go('companies.list', {
              cat: (catsArray == '') ? 'Category' : catsArray,
              regions: (regionsArray == '') ? 'Regions' : regionsArray,
              com: details.Company,
              name: details.Product
            });
          }
        }
      } else {
        $state.go('companies.list', {
          isSearch: false
        });
      }
    };


    $scope.homePageProductDetails = {
      title: 'SONY',
      logoURL: '../../../../modules/core/client/img/brand/sony logo.png',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      webAddress: 'http://www.sonos.com/shop/play5'
    };

    $scope.loadCategories = function () {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      catsList.$promise.then(function (result) {
        //$scope.catsList = result;
        defObj.resolve(result);
        // console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });

      //console.log('defferes1111 obj : ' + JSON.stringify(defObj));
      return defObj.promise;
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






    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    var slides1 = $scope.slides1 = [];
    var slides2 = $scope.slides2 = [];
    var slides3 = $scope.slides3 = [];
    var currIndex = 0;
    $scope.carouselBg = [];
    $scope.getPremiumProducts = function () {
      $scope.carouselBg.push('carousel_spinner');
      PremiumProducts.query({}, function (res) {
        $scope.premiumProducts = res;

        for (var i = 0; i < ($scope.premiumProducts.length / 2); i++) {
          $scope.addSlide1($scope.premiumProducts[i]);
        }

        for (var j = ($scope.premiumProducts.length / 2); j < $scope.premiumProducts.length; j++) {
          $scope.addSlide2($scope.premiumProducts[j]);
        }

        for (var k = 0; k < $scope.premiumProducts.length; k++) {
          $scope.addSlide3($scope.premiumProducts[k]);
        }
        $timeout(function () {
          $scope.carouselBg.pop('carousel_spinner');
        }, 1000);

      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });
    };



    $scope.addSlide1 = function (details) {
      slides1.push({
        image: details.productImageURL,
        proAddress: details.webAddress,
        desc: details.description,
        web: details.companyWebsite,
        text: details.Proname,
        id: currIndex++
      });
    };

    $scope.addSlide2 = function (details) {
      slides2.push({
        image: details.productImageURL,
        proAddress: details.webAddress,
        desc: details.description,
        web: details.companyWebsite,
        text: details.Proname,
        id: currIndex++
      });
    };

    $scope.addSlide3 = function (details) {
      slides3.push({
        image: details.productImageURL,
        proAddress: details.webAddress,
        desc: details.description,
        web: details.companyWebsite,
        text: details.Proname,
        id: currIndex++
      });
    };




  }
]);
