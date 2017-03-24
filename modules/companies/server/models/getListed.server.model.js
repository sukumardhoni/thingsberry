'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var GetListedSchema = new Schema({

  productName: {
    type: String,
    default: '',
    trim: true,
    required: 'Product Name connot be blank'
  },
  email: {
    type: String,
    default: '',
    trim: true,
    required: 'Email connot be blank'
  },
  contactName: {
    type: String,
    default: '',
    trim: true,
    required: 'Contact Name connot be blank'
  },
  contactPhone: {
    type: String,
    default: '',
    trim: true,
    required: 'Contact phone connot be blank'
  },
  productURL: {
    type: String,
    default: '',
    trim: true,
    required: 'Product Url connot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true,
    required: 'Description connot be blank'
  },
  message: {
    type: String,
    default: '',
    trim: true,
    required: 'Message title connot be blank'
  }

});

mongoose.model('GetListedDetails', GetListedSchema);
