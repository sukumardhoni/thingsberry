'use strict';

angular.module('companies').directive('fileOnChange', function ($state, Authentication) {
  console.log("COMING TO FILEON CHANGE DIRECTIVE");
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      console.log("COMING TO FILEON CHANGE DIRECTIVE LINK FUNC");
      var onChangeFunc = scope.$eval(attrs.fileOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});
