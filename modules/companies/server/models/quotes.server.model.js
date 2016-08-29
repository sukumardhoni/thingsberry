'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var QuotesSchema = new Schema({

  personName: {
    type: String,
    default: '',
    trim: true,
    required: 'Person name cannot be blank'
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Quotes title connot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true,
    required: 'Quotes content connot be blank'
  },
  personImageUrl: {
    type: String,
    default: '',
    trim: true,
  }

});

mongoose.model('Quotes', QuotesSchema);
