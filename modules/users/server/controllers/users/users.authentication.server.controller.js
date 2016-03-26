'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  passport = require('passport'),
  jwt = require('jwt-simple'),
  User = mongoose.model('User'),
  config = require('../../../../../config/config'),
  agenda = require('../../../../../schedules/job-schedule')(config.db),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  transporter = nodemailer.createTransport(smtpTransport(config.mailer.options));

// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin',
  '/authentication/signup'
];




/* JWT Signup */

exports.jwtSignup = function (req, res, next) {
  var deviceInfo = req.headers.device;

  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      res.json({
        type: false,
        data: 'Error occured: ' + err
      });
    } else {
      if (user) {
        if (user.token === '') {
          var secret = 'www';
          var payload = {
            email: req.body.email
          };
          var token = jwt.encode(payload, secret);
          user.token = token;
          user.save(function (err) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              req.login(user, function (err) {
                if (err) {
                  console.log('Error while Login user : ' + err);
                  res.status(400).send(err);
                } else {
                  res.json({
                    type: false,
                    data: 'User already exists :' + user.email,
                    user: user
                  });
                }
              });
            }
          });
        } else {
          res.json({
            type: false,
            data: 'User already exists!',
            user: user
          });
        }
      } else {
        //delete req.body.roles;
        var userModel = new User(req.body);
        userModel.provider = req.body.provider || 'local';
        userModel.displayName = userModel.firstName + ' ' + userModel.lastName;
        userModel.username = userModel.firstName + userModel.lastName;
        var secret = 'www';
        var payload = {
          email: req.body.email
        };
        var jwtToken = jwt.encode(payload, secret);
        userModel.token = jwtToken;
        userModel.save(function (err) {
          if (err) {
            //console.log('Error while saving user 111111: ' + err.errors.email.message);
            console.log('Error while saving user 111: ' + err);
            var errData;
            if (err.code === 11000) {
              errData = 'User already exists with email : ' + userModel.email
            } else {
              //errData = err.errors.email.message;
              errData = err.errors.password.message;
            }
            /*
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });*/
            res.json({
              type: false,
              data: errData,
              user: user
            });
          } else {
            req.login(userModel, function (err) {
              if (err) {
                console.log('Error while saving user 2222222: ' + err);
                res.status(400).send(err);
              } else {
                //send a welcome mail notification using agenda
                agenda.now('New_User_Welcome', {
                  email: userModel.email,
                  displayName: userModel.displayName
                });
                //send a User_Info_To_ThingsBerry_Team mail notification using agenda
                agenda.now('User_Info_To_ThingsBerry_Team', {
                  userData: '\n Email: ' + userModel.email + '\n displayName: ' + userModel.displayName + '\n Provider :' + userModel.provider + '\n Came from :' + deviceInfo + '\n'
                });
                res.jsonp(userModel);
              }
            });
          }
        });
      }
    }
  });


};




/* JWT Signin */

exports.jwtSignin = function (req, res, next) {

  console.log('jwtSignin func. is called : ' + JSON.stringify(req.body));

  var deviceInfo = req.headers.device;
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      console.log('error :' + err);
      res.json({
        type: false,
        data: 'Error occured: ' + err
      });
    } else {
      if (user) {
        var password = req.body.password;
        // Make sure the password is correct
        user.verifyPassword(password, function (err, isMatch) {

          console.log('Password is matched or not : ' + isMatch);

          if (isMatch) {
            // Success
            var secret = 'www';
            var payload = {
              email: req.body.email
            };
            var token = jwt.encode(payload, secret);
            user.token = token;
            user.password = req.body.password;
            user.save(function (err) {
              if (err) {
                console.log('Error occured on singin function is : ' + err);
                return res.status(400).send({
                  message: errorHandler.getErrorMessage(err)
                });
              } else {

                console.log('User saved');

                req.login(user, function (err) {
                  if (err) {

                    console.log('Error while login in signin func : ' + err);

                    res.status(400).send(err);
                  } else {

                    /*//user is successfully logged in send a notification to the job to count user signins
agenda.now('User_Signedin', {
  data: user.email
});
//user is successfully logged in save action into user usage details collection
agenda.now('User_Usage_Details', {
  email: user.email,
  device: deviceInfo,
  action: 'Log In user : ' + user.displayName,
});*/
                    console.log('@@@@@@ Found user in signin  func.  @@@@@@@' + JSON.stringify(user));
                    res.jsonp(user);

                  }
                });
              }
            });
          } else {
            res.json({
              type: false,
              data: 'Incorrect password'
            });
          }
        });
      } else {
        res.json({
          type: false,
          data: 'Incorrect user/password'
        });
      }
    }
  });
};



exports.checkUserByToken = function (req, res) {
  var bearerToken;
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    if (bearer[1] === 'undefined') {
      res.sendStatus(401);
    } else {
      bearerToken = bearer[1];
      User.findOne({
        token: bearerToken
      }, function (err, user) {
        if (err) {
          res.json({
            type: false,
            data: 'Error occured: ' + err
          });
        } else if (user === null) {
          res.json({
            type: false,
            data: 'Empty User Occured '
          });
        } else {
          req.user = user;
          res.jsonp(user);
        }
      });
    }
  } else {
    res.sendStatus(401);
  }
};




exports.jwtSignout = function (req, res, next) {
  /*  req.logout();
    res.redirect('/');*/
  var bearerToken;
  var bearerHeader = req.headers.authorization;
  if (typeof bearerHeader !== 'undefined') {
    var bearer = bearerHeader.split(' ');
    if (bearer[1] === 'undefined') {
      res.sendStatus(401);
      //req.logout();
      //res.redirect('/');
      console.log('Error while sign out in rest ');
    } else {
      bearerToken = bearer[1];
      User.findOne({
        token: bearerToken
      }, function (err, user) {
        if (err) {
          res.json({
            type: false,
            data: 'Error occured: ' + err
          });
        } else if (user === null) {
          res.json({
            type: false,
            data: 'Empty User Occured '
          });
        } else {
          user.token = '';
          user.save(function (err) {
            if (err) {
              //console.log('Error occured on singout function is : ' + err);
              res.status(400).send(err);
            } else {
              req.logout();
              res.status(200).send({
                type: true,
                data: 'User is susccessfully logged out'
              });
            }
          });
        }
      });
    }
  } else {
    //res.sendStatus(401);
    req.logout();
    res.redirect('/');
  }
};


/**
 * Signup
 */
exports.signup = function (req, res) {
  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  // Init user and add missing fields
  var user = new User(req.body);
  user.provider = 'local';
  user.displayName = user.firstName + ' ' + user.lastName;

  // Then save the user
  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      res.status(400).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;

      req.login(user, function (err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(user);
        }
      });
    }
  })(req, res, next);
};


/*exports.signupFirebase = function (req, res, next) {

  var ref = new Firebase("https://thingsberry.firebaseio.com");

  ref.createUser({
    email: req.body.email,
    password: req.body.password
  }, function (error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      console.log("Successfully created user account with uid:", userData.uid);
      console.log("Successfully created user account details : " + JSON.stringify(userData));
      res.json(userData);
    }
  });


};


exports.signinFirebase = function (req, res, next) {
  var ref = new Firebase("https://thingsberry.firebaseio.com");
  ref.authWithPassword({
    email: req.body.email,
    password: req.body.password
  }, function (error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    } else {
      console.log("Authenticated successfully with payload:", authData);
      console.log("Authenticated Successfully  user account details : " + JSON.stringify(authData));
      res.json(authData);
    }
  });

};*/

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    // Set redirection path on session.
    // Do not redirect to a signin or signup page
    if (noReturnUrls.indexOf(req.query.redirect_to) === -1) {
      req.session.redirect_to = req.query.redirect_to;
    }
    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {
    // Pop redirect URL from session
    var sessionRedirectURL = req.session.redirect_to;
    delete req.session.redirect_to;

    passport.authenticate(strategy, function (err, user, redirectURL) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(redirectURL || sessionRedirectURL || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  if (!req.user) {
    // Define a search query fields
    var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    User.findOne(searchQuery, function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            user = new User({
              firstName: providerUserProfile.firstName,
              lastName: providerUserProfile.lastName,
              username: availableUsername,
              displayName: providerUserProfile.displayName,
              email: providerUserProfile.email,
              profileImageURL: providerUserProfile.profileImageURL,
              provider: providerUserProfile.provider,
              providerData: providerUserProfile.providerData
            });

            // And save the user
            user.save(function (err) {
              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
    if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
      // Add the provider data to the additional provider data field
      if (!user.additionalProvidersData) {
        user.additionalProvidersData = {};
      }

      user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

      // Then tell mongoose that we've updated the additionalProvidersData field
      user.markModified('additionalProvidersData');

      // And save the user
      user.save(function (err) {
        return done(err, user, '/settings/accounts');
      });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  // Delete the additional provider
  if (user.additionalProvidersData[provider]) {
    delete user.additionalProvidersData[provider];

    // Then tell mongoose that we've updated the additionalProvidersData field
    user.markModified('additionalProvidersData');
  }

  user.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    }
  });
};
