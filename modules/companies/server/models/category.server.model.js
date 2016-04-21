'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CategorySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Category Title cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: ''
  }
});

mongoose.model('Category', CategorySchema);
