'use strict';

angular.module('core').directive('tbHeaderImage', function () {
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
      var feedbackImgPos;
      if (attr.state == 'feedback') {
        feedbackImgPos = '0 -117px';
      } else {
        feedbackImgPos = '0px';
      }

      elem.addClass('mobileImage');
      elem.css({
        background: 'url(' + scope.backImage + ')',
        /*width: '100%',*/
        height: '250px',
        opacity: ImageOpcty,
        position: 'relative',
        backgroundPosition: feedbackImgPos,
        backgroundSize: 'cover',
        backgroundColor: '#929292'
      });

      // background-position-y: -117px;



      if (attr.state == 'contactUs' || attr.state == 'getListed' || attr.state == 'feedback') {
        // console.log('coming from contactUs');
        scope.contactStyles = {
          top: '135px',
          left: '30px'
        }
      }
    }
  }
});
