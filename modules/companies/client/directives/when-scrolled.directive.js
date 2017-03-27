angular.module('core').directive('whenScrolled', function ($document, $state) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var doc = angular.element($document)[0].body;
      $document.bind("scroll", function () {
        if ($state.current.name != 'home') {
          // console.log('in scroll');
          //  console.log("scrollTop + offsetHeight:" + (doc.scrollTop + doc.offsetHeight));
          // console.log("scrollHeight: " + doc.scrollHeight);
          //console.log("spinner: " + attrs.whenScrolled);
          if (doc.scrollTop + doc.offsetHeight == doc.scrollHeight) {
            // if (attrs.whenScrolled == 'LoadMoreProducts()') {
            scope.$apply(attrs.whenScrolled);
            // }
            //run the event that was passed through
            // scope.$apply(attrs.whenScrolled);
          }
        }
      });
    }
  };
});
