'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'Movies',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, Movies) {

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
        console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });
      return defObj.promise;
    };


    $scope.slides = ['http://lorempixel.com/450/300/sports/1', 'http://lorempixel.com/450/300/sports/2', 'http://lorempixel.com/450/300/sports/3', 'http://lorempixel.com/450/300/sports/4']


    /*Movies.query({
  mainType: 'movies',
  subType: 'popularValueIs'
}, function (res) {
  //console.log('REsponse of Movies.query query is 1111: ' + JSON.stringify(res));
  $scope.ytSlides = res;
});*/


  }
]);
