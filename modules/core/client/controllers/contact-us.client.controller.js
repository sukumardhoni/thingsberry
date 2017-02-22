'use strict';

angular.module('core').controller('ContactUsController', ['$scope', 'Authentication', 'ContactUsService', 'NotificationFactory', 'GetListedService', '$location', 'FeedbackService',
  function ($scope, Authentication, ContactUsService, NotificationFactory, GetListedService, $location, FeedbackService) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.path = $location.absUrl();
    //console.log(path);
    $scope.contactUs = function () {

      //console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));
      ContactUsService.send($scope.contact, successCallback, errorCallback);
      /*ContactUsService.send($scope.contact);*/

      function successCallback(res) {
        //console.log('Success while sending the Contactus details : ' + res);
        if (res.name === undefined) {
          NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi User');
        } else {
          NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.name);
        }
        $scope.contactUsForm.$setPristine();
        $scope.contactUsForm.$setUntouched();
        $scope.contact = {};
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }

    $scope.feedback = {};
    $scope.feed = function (num) {
      $scope.feedback.rating = num;
    };


    $scope.feedBackRatingArr = []
    for (var i = 1; i <= 10; i++) {
      $scope.feedBackRatingArr.push(i);
      if ($scope.feedBackRatingArr.length == 10) {
        $scope.feedBackRating = $scope.feedBackRatingArr;
      }
    }
    // console.log("count ; " + $scope.feedBackRating);

    $scope.feedBack = function () {
      // console.log('feedback form details on controller : ' + JSON.stringify($scope.feedback));
      if ($scope.feedback.rating) {
        FeedbackService.send($scope.feedback, successCallback, errorCallback);
      } else {
        $scope.showRatingErr = true;
      }

      function successCallback(res) {
        $scope.showRatingErr = false;
        NotificationFactory.success('Thanks for Giving Feedback');
        $scope.feedbackForm.$setPristine();
        $scope.feedbackForm.$setUntouched();
        $scope.feedback = {};
      }

      function errorCallback(res) {
        console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }


    $scope.getListedEmail = function () {
      /*if ($stateParams.isPremium == 'isPremium')
        $scope.getListed.isPremium = true;*/

      $scope.getListed.isPremium = false;
      GetListedService.send($scope.getListed, successCallback, errorCallback);

      function successCallback(res) {
        //   console.log('Success while sending the Contactus details : ' + res);
        NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.contactName);
        $scope.getListedForm.$setPristine();
        $scope.getListedForm.$setUntouched();
        $scope.getListed = '';
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }
  }
]);
