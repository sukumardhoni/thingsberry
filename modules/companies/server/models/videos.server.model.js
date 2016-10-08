'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var VideoSchema = new Schema({

  title: {
    type: String,
    default: '',
    trim: true,
    required: 'video name cannot be blank'
  },
  videoId: {
    type: String,
    default: '',
    trim: true,
    required: 'VideoId cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true,
  }

});

mongoose.model('Videos', VideoSchema);
