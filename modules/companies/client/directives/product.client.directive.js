'use strict';


angular.module('companies')
  .directive('productDisplay', function (dataShare, $window, $state, $localStorage, ratingService, NotificationFactory) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/product-display.client.view.html',
      link: function (scope, elem, attrs) {
        scope.user = $localStorage.user;


        scope.isReadonly1 = false;

        scope.rating = function (rate) {

          scope.ratevalue = rate;
          //console.log("@@@@" + JSON.stringify(scope.details));
          //console.log('rateValue:' + scope.ratevalue);

          if (scope.details._id) {

            ratingService.update({
              companyId: scope.details._id,
              userRating: scope.ratevalue
            }, scope.details, successCallback, errorCallback);

          }

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


        scope.details.rateValue = scope.ratevalue;
        scope.rate1 = scope.details.rateValue;
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

        };
      }
    };
  });
