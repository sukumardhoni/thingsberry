'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var DeactivePrdcts = new Schema({

  name: {
    type: String,
    default: '',
    trim: true,
  },
  prdctId: {
    type: String,
    default: '',
    trim: true,
  },
  imageUrl: {
    type: String,
    default: '',
    trim: true,
  }

});

mongoose.model('DeactivePrdcts', DeactivePrdcts);
