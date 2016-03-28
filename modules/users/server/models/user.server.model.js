'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  bcrypt = require('bcrypt-nodejs'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, {
    require_tld: false
  }));
};



/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function (password) {
  return (this.provider !== 'local' || (password && password.length > 4));
};


/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Please fill a valid email address']
  },
  username: {
    type: String,
    unique: 'Username already exists',
    required: 'Please fill in a username',
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: '',
    validate: [validateLocalStrategyPassword, 'Password should be aleast 5 characters long']
  },
  salt: {
    type: String
  },
  profileImageURL: {
    type: String,
    default: 'modules/users/client/img/profile/default.png'
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: 'Please provide at least one role'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  token: {
    type: String
  }
});


// Execute before each user.save() call
UserSchema.pre('save', function (callback) {
  var user = this;


  console.log('User details on Save model : ' + JSON.stringify(user));
  console.log('User Password changed or Not  : ' + user.isModified('password'));


  bcrypt.compare(user.password, this.password, function (err, isMatch) {
    if (err) {
      bcrypt.genSalt(5, function (err, salt) {
        if (err) return callback(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
          if (err) return callback(err);
          user.password = hash;
          callback();
        });
      });
    } else return callback();
  })




  // Break out if the password hasn't changed
  /*if (!user.isModified('password')) return callback();
// Password changed so we need to hash it
bcrypt.genSalt(5, function (err, salt) {
  if (err) return callback(err);
  bcrypt.hash(user.password, salt, null, function (err, hash) {
    if (err) return callback(err);
    user.password = hash;
    callback();
  });
});*/
});


UserSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  //return this.password === this.hashPassword(password);

  this.verifyPassword(password, function (err, isMatch) {
    var result = isMatch;
    console.log('Authentication in user model is :' + result);
    return isMatch;
  })


};


/**
 * Find possible not used username
 */

UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;

  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

mongoose.model('User', UserSchema);
