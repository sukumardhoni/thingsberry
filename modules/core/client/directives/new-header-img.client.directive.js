/*'use strict';

angular.module('core').directive('tbHeaderImage', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'modules/companies/client/views/directive-partials/new-header-image.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to directive");
      scope.backImage = attr.image;
      console.log(scope.backImage);
      var ImageOpcty = attr.opacity;
      scope.ImgMainTtl = attr.maintitle;
      scope.ImgSubTtl = attr.subtitle;
      elem.css({
        background: 'url(' + scope.backImage + ')',
        width: '100%',
        height: '250px',
        opacity: ImageOpcty,
        position: 'relative',
        backgroundPosition: '0px',
        backgroundSize: 'cover'
      });
    }
  }
});*/
