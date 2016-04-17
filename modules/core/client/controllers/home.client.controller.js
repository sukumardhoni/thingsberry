'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state',
  function ($scope, Authentication, SearchProducts, $state) {

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
      //console.log('getSearchedProducts form details are : ' + JSON.stringify(details));
      if (!details.Company)
        details.Company = 'Company';
      else if (!details.Product)
        details.Product = 'Product';

      $state.go('companies.list', {
        cat: details.Category,
        com: details.Company,
        name: details.Product
      });
    };


    $scope.homePageProductDetails = {
      title: 'SONY',
      logoURL: '../../../../modules/core/client/img/brand/sony logo.png',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      webAddress: 'http://www.sonos.com/shop/play5'

    };

  }
]);
