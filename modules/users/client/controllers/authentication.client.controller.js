'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$firebaseArray',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $firebaseArray) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }



    $scope.pwdCompare = function () {
      console.log('Credentials checking pwd ');
      if ($scope.credentials.password1 === $scope.credentials.password2) {
        //console.log('Pwd Matched');
        $scope.error = null;
        $scope.credentials.password = $scope.credentials.password1;
      } else {
        //console.log('Pwd doesnt Matched');
        $scope.error = "Password Doesn't match";
      }
    }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/jwtSignup', $scope.credentials).success(function (response) {

        if (response.type === false) {
          $scope.error = response.data;
          //$scope.isDisabled = false;
          //$scope.buttonTextSignUp = 'Sign Up';
          console.log('Error Msg : ' + JSON.stringify(response.data));

        } else {
          $scope.error = null;
          //$scope.populateUserLocally(res);
          // If successful we assign the response to the global user model
          $scope.authentication.user = response;

          // And redirect to the previous or home page
          $state.go($state.previous.state.name || 'home', $state.previous.params);
        }




      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/jwtSignin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model


        if (response.type === false) {
          $scope.error = response.data;
          //$scope.isDisabled = false;
          //$scope.buttonTextSignUp = 'Sign Up';
          console.log('Error Msg : ' + JSON.stringify(response.data));

        } else {
          $scope.error = null;
          //$scope.populateUserLocally(res);
          // If successful we assign the response to the global user model
          $scope.authentication.user = response;

          // And redirect to the previous or home page
          $state.go($state.previous.state.name || 'home', $state.previous.params);
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };



    /*$scope.signinWithFb = function () {
  console.log('Sign in vth FB is called');

  var ref = new Firebase("https://thingsberry.firebaseio.com");
  // prefer pop-ups, so we don't navigate away from the page
  ref.authWithOAuthPopup("facebook", function (error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      // the access token will allow us to make Open Graph API calls
      console.log('Successfully created facebook user in firebase');
      console.log('USer details is :' + JSON.stringify(authData));
      $scope.populateUserLocally(authData);
    }
  }, {
    remember: "sessionOnly",
    scope: "email,user_likes" // the permissions requested
  });


};

$scope.signinWithG = function () {
  console.log('Sign in vth Gmail is called');

  var ref = new Firebase("https://thingsberry.firebaseio.com");
  // prefer pop-ups, so we don't navigate away from the page
  ref.authWithOAuthPopup("google", function (error, authData) {
    if (error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        //fall-back to browser redirects, and pick up the session
        // automatically when we come back to the origin page
        ref.authWithOAuthRedirect("google", function (error) {});
      }
    } else if (authData) {

      console.log('Successfully created google user in firebase');
      console.log('USer details is :' + JSON.stringify(authData));
      $scope.populateUserLocally(authData);
      // user authenticated with Firebase
    }
  }, {
    remember: "sessionOnly",
    scope: "email"
  });


};



$scope.populateUserLocally = function (respUser) {

  var ref = new Firebase("https://thingsberry.firebaseio.com");
  var profileRef = ref.child(respUser.provider + '-users');
  var userProfile = {};
  var localUser = {};
  if (respUser.provider === 'facebook') {
    var fbPro = localUser = respUser.facebook;
    userProfile = {
      "displayName": fbPro.displayName,
      "email": fbPro.email,
      "first_name": fbPro.cachedUserProfile.first_name,
      "last_name": fbPro.cachedUserProfile.last_name,
      "gender": fbPro.cachedUserProfile.gender
    }
  } else if (respUser.provider === 'google') {
    var gPro = localUser = respUser.google;
    userProfile = {
      "displayName": gPro.displayName,
      "email": gPro.email,
      "given_name": gPro.cachedUserProfile.given_name,
      "family_name": gPro.cachedUserProfile.family_name,
      "gender": gPro.cachedUserProfile.gender
    }
  }
  console.log('Succefully local usr is created : ' + JSON.stringify(userProfile));
  profileRef.push(userProfile, function (error) {
    if (error) {
      console.log("userData could not be saved." + error);
    } else {
      console.log("userData saved successfully.");
    }
  });
  $scope.authentication.user = localUser;
  $state.go($state.previous.state.name || 'home', $state.previous.params);
};*/




  }
]);
