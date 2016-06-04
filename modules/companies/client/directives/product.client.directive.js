'use strict';


angular.module('companies')
  .directive('productDisplay', function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/product-display.client.view.html',
      link: function (scope, elem, attrs) {

        var previousRatingValue;
        var localStorageRatingKey;

        scope.user = $localStorage.user;

        var productname = scope.details.Proname;
        var productNameLowerCase = productname.replace(/[^a-zA-Z]/g, "").toLowerCase();


        if (scope.user == undefined) {

          localStorageRatingKey = "guest" + productNameLowerCase;
          //console.log("userId:" + localStorageRatingKey);

        } else {

          localStorageRatingKey = scope.user._id + productNameLowerCase;
          // console.log("userId:" + localStorageRatingKey);

        }

        scope.rating = function (rate) {


          scope.ratevalue = rate;


          if ($localStorage[localStorageRatingKey] == undefined) {

            previousRatingValue = 0;
            $localStorage[localStorageRatingKey] = scope.ratevalue;

          } else {

            previousRatingValue = $localStorage[localStorageRatingKey];
            $localStorage[localStorageRatingKey] = scope.ratevalue;

          }


          ratingService.update({
            companyId: scope.details._id,
            userRating: scope.ratevalue,
            previousRatingValue: previousRatingValue
          }, scope.details, successCallback, errorCallback);


          function successCallback(res) {
            // console.log("coming from callback");
            scope.rate = res.avgRatings;
            scope.reviewsCount = res.totalRatingsCount;
          }


          function errorCallback(res) {
            //  console.log("coming from callback");
            NotificationFactory.error('Failed to update the product rating...', res.data.message);
          }

        };




        scope.showMe = function () {

          scope.showRatings = !scope.showRatings;

        }

        scope.hoverOut = function () {

          if ($localStorage[localStorageRatingKey]) {

            scope.showRatings = !scope.showRatings;

          } else {

            scope.showRatings = true;
          }
        }


        if ($localStorage[localStorageRatingKey]) {

          scope.showRatings = false;

        } else {

          scope.showRatings = true;
        }

        scope.rate1 = $localStorage[localStorageRatingKey];
        scope.isReadonly1 = false;
        scope.rate = scope.details.avgRatings;
        scope.reviewsCount = scope.details.totalRatingsCount;

        scope.max = 5;
        scope.isReadonly = true;


        scope.proImgUrl = function () {
          if (scope.details.productImageURL)
            return scope.details.productImageURL
          else
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
        };

        scope.changeLimit = function (pro) {
          if (scope.limit == pro.description.length)
            scope.limit = 100;
          else
            scope.limit = pro.description.length;
        }


        scope.editProduct = function (Pro) {
          //console.log('Edit Product details on Direc. : ' + JSON.stringify(Pro));
          dataShare.setData(Pro);
          $state.go('companies.add');
        };




        scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };


        scope.hoveringOver = function (value) {
          //console.log('hoveringOver is called');
          scope.overStar = value;
          scope.percent = 100 * (value / scope.max);
        };

      }
    };
  });
