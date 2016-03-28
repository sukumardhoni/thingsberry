'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  nodemailer = require('nodemailer'),
  config = require('../../../../../config/config'),
  agenda = require('../../../../../schedules/job-schedule')(config.db),
  async = require('async'),
  jwt = require('jwt-simple'),
  crypto = require('crypto'),
  smtpTransport = nodemailer.createTransport(config.mailer.options);


/**
 * jwtForgot for reset password (forgot POST)
 */


exports.jwtForgot = function (req, res, next) {

  var token = '';
  if (req.body.email) {
    User.findOne({
      email: req.body.email
    }, '-salt -password', function (err, user) {
      if (!user) {
        return res.status(400).send({
          message: 'No account with that email has been found'
        });
      } else if (user.provider !== 'local') {
        return res.status(400).send({
          message: 'It seems like you connected using your ' + user.provider + ' account'
        });
      } else {
        crypto.randomBytes(20, function (err, buffer) {
          token = buffer.toString('hex');
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
          user.save(function (err) {
            if (!err) {
              console.log('New passwor reset method is called by using agenda');
              agenda.now('Recovery_Link_Email', {
                email: user.email,
                displayName: user.displayName,
                url: 'http://' + req.headers.host + '/api/auth/reset/' + token
              });
              res.send({
                message: 'An email has been sent to ' + user.email + ' with further instructions.'
              });
            } else {
              console.log('#### errror while reseting password, err is:' + err);
              res.send({
                message: 'There is some issue while reseting your password please try after sometime.'
              });
            }
          });
        });
      }
    });
  } else {
    return res.status(400).send({
      message: 'Email field must not be blank'
    });
  }

};



/**
 * Jwt Change Password Method
 */

exports.jwtChangePassword = function (req, res) {
  // Init Variables
  var passwordDetails = req.body;

  console.log('Change Password method is called : ' + JSON.stringify(passwordDetails));

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          user.verifyPassword(passwordDetails.currentPassword, function (err, isMatch) {
            if (isMatch) {
              console.log('Current Password is match : ' + passwordDetails.currentPassword);
              if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                user.password = passwordDetails.newPassword;
                var secret = 'www';
                var payload = {
                  email: user.email
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
                        res.status(400).send(err);
                      } else {
                        res.send({
                          message: 'Password changed successfully'
                        });
                      }
                    });
                  }
                });
              } else {
                res.status(400).send({
                  message: 'Passwords do not match'
                });
              }
            } else {
              res.status(400).send({
                message: 'Current password is incorrect'
              });
            }
          });
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};








/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
  async.waterfall([
    // Generate random token
    function (done) {
      crypto.randomBytes(20, function (err, buffer) {
        var token = buffer.toString('hex');
        done(err, token);
      });
    },
    // Lookup user by username
    function (token, done) {
      if (req.body.username) {
        User.findOne({
          username: req.body.username.toLowerCase()
        }, '-salt -password', function (err, user) {
          if (!user) {
            return res.status(400).send({
              message: 'No account with that username has been found'
            });
          } else if (user.provider !== 'local') {
            return res.status(400).send({
              message: 'It seems like you signed up using your ' + user.provider + ' account'
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            user.save(function (err) {
              done(err, token, user);
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Username field must not be blank'
        });
      }
    },
    function (token, user, done) {

      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      res.render(path.resolve('modules/users/server/templates/reset-password-email'), {
        name: user.displayName,
        appName: config.app.title,
        url: httpTransport + req.headers.host + '/api/auth/reset/' + token
      }, function (err, emailHTML) {
        done(err, emailHTML, user);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, user, done) {
      var mailOptions = {
        to: user.email,
        from: config.mailer.from,
        subject: 'Password Reset',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email'
          });
        }

        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res) {
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!user) {
      return res.redirect('/password/reset/invalid');
    }
    res.redirect('/password/reset/' + req.params.token);
  });
};

/**
 * Reset password POST from email token
 */
exports.reset = function (req, res, next) {

  // Init Variables
  var passwordDetails = req.body;
  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }, function (err, user) {
    if (!err && user) {
      if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
        user.password = passwordDetails.newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        var secret = 'www';
        var payload = {
          email: user.email
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
                res.status(400).send(err);
              } else {
                res.json(user);
                //done(err, user);
                agenda.now('Password_Changed_Email', {
                  email: user.email,
                  displayName: user.displayName
                });
              }
            });
          }
        });
      } else {
        return res.status(400).send({
          message: 'Passwords do not match'
        });
      }
    } else {
      return res.status(400).send({
        message: 'Password reset token is invalid or has expired.'
      });
    }
  });

};

/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {
  // Init Variables
  var passwordDetails = req.body;
  var message = null;

  if (req.user) {
    if (passwordDetails.newPassword) {
      User.findById(req.user.id, function (err, user) {
        if (!err && user) {
          if (user.authenticate(passwordDetails.currentPassword)) {
            if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
              user.password = passwordDetails.newPassword;

              user.save(function (err) {
                if (err) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  req.login(user, function (err) {
                    if (err) {
                      res.status(400).send(err);
                    } else {
                      res.send({
                        message: 'Password changed successfully'
                      });
                    }
                  });
                }
              });
            } else {
              res.status(400).send({
                message: 'Passwords do not match'
              });
            }
          } else {
            res.status(400).send({
              message: 'Current password is incorrect'
            });
          }
        } else {
          res.status(400).send({
            message: 'User is not found'
          });
        }
      });
    } else {
      res.status(400).send({
        message: 'Please provide a new password'
      });
    }
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};
