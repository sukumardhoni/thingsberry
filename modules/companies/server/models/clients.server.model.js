'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var ClientSchema = new Schema({

  clientName: {
    type: String,
    default: '',
    trim: true,
    required: 'Client name cannot be blank'
  },
  clientUrl: {
    type: String,
    default: '',
    trim: true,
    required: 'Client url connot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true,
  }

});

mongoose.model('Clients', ClientSchema);
