'use strict';

angular.module('core').directive('tbHeaderCarouselOptions', function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      images: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-carosel-options.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to carousel options ");
      console.log(" carousel Options images" + scope.images);
      var options = attr.options;
      console.log(options);
      if (options.indexOf("z") !== -1) {
        scope.showMeZ = true;
      }
      if (options.indexOf("f") !== -1) {
        scope.showMeF = true;
      }
      if (options.indexOf("s") !== -1) {
        scope.showMeS = true;
      }

    }
  }
}).directive('fullScreen', function () {
  return {
    restrict: 'E',
    replace: true,
    template: ' <span><span class="glyphicon glyphicon-fullscreen"></span>&nbsp;VIEW FULL SCREEN</span>',
    link: function (scope, elem, attr) {
      console.log("coming to view full screen directive");

    }
  }
}).directive('share', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<span><i class="fa fa-share-alt" aria-hidden="true"></i>&nbsp;SHARE</span>',
    link: function (scope, elem, attr) {
      console.log("coming to Share directive");
    }
  }
});
