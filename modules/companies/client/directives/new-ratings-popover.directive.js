'use strict';

angular.module('companies').directive('tbRatingsContainer', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      products: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-ratins-popover.display.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {
      //  console.log("coming to ratings container");
      //  console.log("before if cond:" + attr.state);
      if (attr.state == 'featurePrdct') {
        // console.log("before if cond:" + attr.state);
        scope.ratingStyle = {
          top: '-72px',
          right: '-15px',

        }
      }
      if (attr.state == 'productGridView') {
        // console.log("before if cond:" + attr.state);
        scope.ratingStyle = {
          bottom: '32px',
          right: '0px'

        }
      }

      if (attr.state == 'productListView' || attr.state == 'singlePrdct') {
        //  console.log("before if cond:" + attr.state);
        scope.ratingStyle = {
          top: '0px',
          right: '-15px',
        }
      }
      if (attr.state == 'singlePrdct') {
        //  console.log("before if cond:" + attr.state);
        scope.ratingStyle = {
          top: '79px',
          right: '1px',
        }
      }


      var previousRatingValue;
      var localStorageRatingKey;

      scope.user = $localStorage.user;
      /* console.log("---->:" + JSON.stringify(scope.user));*/

      // console.log(scope.products);

      var productname = scope.products.Proname;
      /* console.log(productname);*/
      var productNameLowerCase = productname.replace(/[^a-zA-Z]/g, "").toLowerCase();
      // console.log(productNameLowerCase);
      if (scope.user == undefined) {
        localStorageRatingKey = "guest" + productNameLowerCase;
        //  console.log("userId:" + localStorageRatingKey);
      } else {
        localStorageRatingKey = scope.user._id + productNameLowerCase;
        // console.log("userId:" + localStorageRatingKey);
      }

      scope.rating = function (rate) {


        scope.ratevalue = rate;
        //  console.log("ratevalue:" + scope.ratevalue);



        if ($localStorage[localStorageRatingKey] == undefined) {

          previousRatingValue = 0;
          $localStorage[localStorageRatingKey] = scope.ratevalue;

        } else {

          previousRatingValue = $localStorage[localStorageRatingKey];
          $localStorage[localStorageRatingKey] = scope.ratevalue;

        }
        //  console.log(previousRatingValue);
        //   console.log($localStorage[localStorageRatingKey]);

        ratingService.update({
          companyId: scope.products.productId,
          userRating: scope.ratevalue,
          previousRatingValue: previousRatingValue
        }, scope.products, successCallback, errorCallback);


        function successCallback(res) {
          //  console.log("coming from callback");
          scope.rate = res.avgRatings;
          scope.reviewsCount = res.totalRatingsCount;
          //   console.log(scope.rate);
          //   console.log(scope.reviewsCount);
        }


        function errorCallback(res) {
          //   console.log("coming from callback");
          NotificationFactory.error('Failed to update the product rating...', res.data.message);
        }

      };


      scope.rate1 = $localStorage[localStorageRatingKey];
      scope.isReadonly1 = false;
      scope.rate = scope.products.avgRatings;
      scope.reviewsCount = scope.products.totalRatingsCount;

      scope.max = 5;
      scope.isReadonly = true;

      /*scope.rate = 4;
           scope.isReadonly = true;*/
      scope.hoveringOver = function (value) {
        scope.overStar = value;
        scope.percent = 100 * (value / scope.max);
      };


    }
  }
});
