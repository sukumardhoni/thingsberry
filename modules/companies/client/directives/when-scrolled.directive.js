angular.module('core').directive('whenScrolled', function ($document) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var doc = angular.element($document)[0].body;
      $document.bind("scroll", function () {
        if (doc.scrollTop + doc.offsetHeight >= doc.scrollHeight) {
          //run the event that was passed through
          scope.$apply(attrs.whenScrolled);
        }
      });
    }
  };
});
