'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$localStorage', 'NotificationFactory', 'SignUpCondition', 'Users',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $localStorage, NotificationFactory, SignUpCondition, Users) {
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
    };

    $scope.signup = function (isValid) {
      //console.log('In the controller function from signup page');
      $scope.buttonTextSignUp = 'Signing Up...';


      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/jwtSignup', $scope.credentials).success(function (response) {
        //console.log('proving the route to go to server side routes');
        if (response.type === false) {
          $scope.error = response.data;
          //$scope.isDisabled = false;
          $scope.buttonTextSignUp = 'Sign Up';
          console.log('Error Msg : ' + JSON.stringify(response.data));

        } else {
          $scope.error = null;
          //$scope.populateUserLocally(res);
          // If successful we assign the response to the global user model
          $scope.populateUserLocally(response);
          console.log('Msg : ' + JSON.stringify(response));
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
          // console.log('Error Msg : ' + JSON.stringify(response.data));

        } else {
          $scope.error = null;
          //$scope.populateUserLocally(res);
          // If successful we assign the response to the global user model
          $scope.populateUserLocally(response);
          //console.log('#####->user login detailsss : ' + JSON.stringify(response));
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };



    $scope.populateUserLocally = function (respUser) {

      //console.log('After successfully created or login user details : ' + JSON.stringify(respUser));

      $scope.authentication.user = respUser;
      $localStorage.user = respUser;
      $localStorage.token = respUser.token;
      NotificationFactory.success('Hi ' + respUser.displayName, 'Authentication Success !');
      /* console.log('states:'+ $state.previous.state.name);
       console.log('states++++:'+ JSON.stringify($state.previous.params));*/
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    };



    hello.init({
      google: '1011487504050-sjufok8ijqcho7h19uke77et14bmu87n.apps.googleusercontent.com',
      facebook: '239001833102223'
    }, {
      scope: 'email',
      redirect_uri: '/'
    });

    $scope.fbAuthLogIn = function () {
      //console.log('in the fbAuthlogin');
      hello('facebook').login().then(function (fbRes) {
        //console.log('user response is:'+JSON.stringify(fbRes));
        $http({
            method: "GET",
            url: 'https://graph.facebook.com/me?fields=email,first_name,gender,id,last_name&access_token=' + fbRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile Details is : ' + JSON.stringify(data));
            $scope.fUser = {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              provider: 'fb'
            };
            // console.log('$scope fuser details :'+JSON.stringify($scope.fUser));
            Users.Signup.create($scope.fUser).$promise.then(function (res) {
              // console.log('##users.signup.create response :'+JSON.stringify(res));
              if (res.type === false) {
              //  console.log('@@ res.type is :'+res.type);
                $scope.errMsg = res.data;
              //  console.log('@@ res.data is :'+res.data);
                $scope.populateUserLocally(res.user);
              //  console.log('@@ res.user is :'+JSON.stringify(res.user));
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              //  console.log('@@ response in fb')
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      }, function (e) {
        console.log('Signin error: ' + e.error.message);
      })
    };




    $scope.googleAuthLogIn = function () {
      //console.log('in the googleAuthLogIn');
      hello('google').login().then(function (gRes) {
        //console.log('google user response' + JSON.stringify(gRes));
        $http({
            method: "GET",
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + gRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile is : ' + JSON.stringify(data));
            $scope.gUser = {
              firstName: data.given_name,
              lastName: data.family_name,
              email: data.email,
              provider: 'gmail'
            };
            Users.Signup.create($scope.gUser).$promise.then(function (res) {
              if (res.type === false) {
                 console.log('@@ res.type is :'+res.type);
                $scope.errMsg = res.data;
                console.log('@@ res.data is :'+res.data);
                $scope.populateUserLocally(res.user);
                console.log('@@ res.user is :'+JSON.stringify(res.user));
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      }, function (e) {
        console.log('Signin error: ' + e.error.message);
      })
    };






    /*  // OAuth provider request
    $scope.callOauthProvider = function (url) {
      console.log('client side url'+url);
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
        console.log('client side url'+JSON.stringify($state.previous.href));
        console.log('######client side url'+url);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };*/
  }
]);
