'use strict';

angular.module('core').directive('tbLinkButton', function ($location) {
  return {
    restrict: 'E',
    replace: true,
    template: '<button class="btn btn-primary">LINK SITE&nbsp;&nbsp;<i class="fa fa-link" aria-hidden="true" style="transform: rotate(-45deg);"></i></button>',
    link: function (scope, elem, attr) {
      console.log("coming to link button");
      var newLink = attr.prodLink;
      var newColor = attr.btnColor;
      console.log(newColor);
      elem.css({
        backgroundColor: newColor,
        borderRadius: '0px',
        borderBottomColor: 'none',
        backgroundImage: 'none',
        marginTop: '10px'

      });
      elem.bind('click', function () {
        window.location.href = newLink;
      });
    }
  }
});
