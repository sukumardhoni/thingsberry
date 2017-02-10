'use strict';

angular.module('core').directive('tbHeaderCarousel', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      images: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-header-carousel.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to header carousel");
      console.log(scope.images);
    }
  }
}).directive('repeatCarousel', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      // wait for the last item in the ng-repeat then call init
      if (scope.$last) {
        $(element.parent()).owlCarousel({
          autoplay: true,
          autoplayTimeout: 1000,
          loop: true,
          slideSpeed: 300,
          paginationSpeed: 400,
          items: 1,
          margin: 20,

        })
      }
    }
  };
});
