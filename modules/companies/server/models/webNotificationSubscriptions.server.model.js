'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Category Schema
 */
var NotificationSubscriptions = new Schema({
  endpoint: {
    type: String,
    default: '',
    trim: true,
    required: 'catId cannot be blank'
  },
  keys: {
    p256dh: {
      type: String,
      default: '',
      trim: true
    },
    auth: {
      type: String,
      default: '',
      trim: true
    }
  }
});

mongoose.model('NotificationSubscriptions', NotificationSubscriptions);
