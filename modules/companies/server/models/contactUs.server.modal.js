'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var ContactUsSchema = new Schema({

  name: {
    type: String,
    default: '',
    trim: true,
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email connot be blank'
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  message: {
    type: String,
    default: '',
    trim: true,
    required: 'Message title connot be blank'
  }

});

mongoose.model('ContactUsDetails', ContactUsSchema);
