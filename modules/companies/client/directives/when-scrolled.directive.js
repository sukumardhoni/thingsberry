angular.module('core').directive('whenScrolled', function (dataShare, $state, $localStorage, ratingService, NotificationFactory, Authentication, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {


    restrict: 'A',
    link: function (scope, elem, attrs) {
      console.log("coming to scroll directive");
      // we get a list of elements of size 1 and need the first element
      raw = elem[0];

      // we load more elements when scrolled past a limit
      elem.bind("scroll", function () {
        console.log("coming to scroll directive scroll");
        if (raw.scrollTop + raw.offsetHeight + 5 >= raw.scrollHeight) {
          //scope.loading = true;

          // we can give any function which loads more elements into the list
          scope.$apply(attrs.whenScrolled);
        }
      });
    }
  }
});
