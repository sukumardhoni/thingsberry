'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var emailsubscribers = new Schema({

  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email cannot be blank'
  }

});

mongoose.model('emailsubscribers', emailsubscribers);
