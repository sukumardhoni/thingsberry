'use strict';

angular.module('companies').directive('tbHeaderImage', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'modules/companies/client/views/directive-partials/new-header-image.client.view.html ',
    link: function (scope, elem, attr) {
      //  console.log("coming to directive");
      scope.backImage = attr.image;
      //  console.log(scope.backImage);
      var ImageOpcty = attr.opacity;
      scope.ImgMainTtl = attr.maintitle;
      scope.ImgSubTtl = attr.subtitle;
      /*scope.state = attr.state;
      console.log(scope.state);*/
      elem.addClass('mobileImage');
      elem.css({
        background: 'url(' + scope.backImage + ')',
        /*width: '100%',*/
        height: '250px',
        opacity: ImageOpcty,
        position: 'relative',
        backgroundPosition: '0px',
        backgroundSize: 'cover',
        backgroundColor: '#929292'
      });

      if (attr.state == 'contactUs' || attr.state == 'getListed') {
        // console.log('coming from contactUs');
        scope.contactStyles = {
          top: '135px',
          left: '90px'
        }
      }
    }
  }
});
