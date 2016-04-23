'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'PremiumProducts',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, PremiumProducts) {

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
      if (details.Category || details.Company || details.Product) {
        var catsArray = [];
        if (details.Category) {
          if (details.Category.length > 0) {
            for (var i = 0; i < details.Category.length; i++) {
              catsArray.push(details.Category[i].title);
            }
          } else {
            catsArray.push(details.Category.title);
          }
        }
        if ((catsArray == '') && (details.Company == undefined) && (details.Product == undefined)) {
          $state.go('companies.list', {
            isSearch: false
          });
        } else {
          $state.go('companies.list', {
            cat: (catsArray == '') ? 'Category' : catsArray,
            com: details.Company,
            name: details.Product
          });
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
        //console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });
      return defObj.promise;
    };








    PremiumProducts.query({}, function (res) {
      $scope.premiumProducts = res;
    }, function (err) {
      console.log('Failed to fetch the product details : ' + err);
    });







    /*Carousel Functionality*/


    (function () {
      // setup your carousels as you normally would using JS
      // or via data attributes according to the documentation
      // http://getbootstrap.com/javascript/#carousel
      $('#carouselivo').carousel({
        interval: 5000
      });

    }());

    (function () {
      $('.carousel-showmanymoveone .item').each(function () {
        var itemToClone = $(this);
        for (var i = 1; i < 4; i++) {
          itemToClone = itemToClone.next();
          // wrap around if at end of item collection
          if (!itemToClone.length) {
            itemToClone = $(this).siblings(':first');
          }
          // grab item, clone, add marker class, add to collection
          itemToClone.children(':first-child').clone()
            .addClass("cloneditem-" + (i))
            .appendTo($(this));
        }
      });
    }());
  }
]);
