'use strict';


angular.module('companies')
  .directive('productDisplay', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
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
        console.log("---->:" + JSON.stringify(scope.user));

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
          console.log("ratevalue:" + scope.ratevalue);



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
          scope.ratevalue = false;
          console.log("showme :" + scope.showRatings);
          //  console.log("---->" + scope.ratevalue);
        }

        scope.mouseOut = function () {
            scope.showRatings = !scope.showRatings;
          }
          // scope.ratevalue = true;
          /*if (scope.ratevalue == true) {
            scope.showRatings = false;
          } else {
            scope.showRatings = false;
          }*/

        /*
                  if ($localStorage[localStorageRatingKey]) {
                    scope.ratevalue = true;
                  } else {
                    scope.ratevalue = false;

                  }*/




        scope.hoverOut = function () {

          if ($localStorage[localStorageRatingKey]) {

            scope.showRatings = !scope.showRatings;

          } else {

            scope.showRatings = true;
          }
          console.log("hoverOut ShowRatings:" + scope.showRatings);
        }


        if ($localStorage[localStorageRatingKey]) {

          scope.showRatings = false;

        } else {

          scope.showRatings = true;
        }
        console.log("showRatings :" + scope.showRatings);

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




        /* scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };
*/

        scope.hoveringOver = function (value) {
          //console.log('hoveringOver is called');
          scope.overStar = value;
          // console.log('hoveringOver is called:' + scope.overStar);
          if (scope.overStar == 1) {
            scope.productReviewLabel = 'Unusable Product';
            // console.log('hoveringOver is called:' + scope.percent);
          } else if (scope.overStar == 2) {
            scope.productReviewLabel = 'Poor Product';
          } else if (scope.overStar == 3) {
            scope.productReviewLabel = 'Ok Product';
          } else if (scope.overStar == 4) {
            scope.productReviewLabel = 'Good Product';
          } else {
            scope.productReviewLabel = 'Excellect Product';
          }
          // scope.percent = 100 * (value / scope.max);
        };

      }
    };
  });
