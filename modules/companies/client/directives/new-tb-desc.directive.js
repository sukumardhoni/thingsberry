'use strict';

angular.module('companies').directive('tbFullDesc', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      text: '='
    },
    template: '<div ><h4>Description</h4><p>{{text}}</p></div>',
    link: function (scope, elem, attr) {
      elem.css({
        border: '.5px solid lightgray',
        boxShadow: ' 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        margin: '10px',
        padding: '20px'

      });
    }
  }
});
