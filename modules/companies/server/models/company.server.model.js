'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  productId: {
    type: String,
    default: '',
    trim: true
  },
  Proname: {
    type: String,
    default: '',
    trim: true,
    required: 'Product Name cannot be blank'
  },
  ProCat: [],
  Comname: {
    type: String,
    default: '',
    trim: true,
    required: 'Company Name cannot be blank'
  },
  address1: {
    type: String,
    default: '',
    trim: true
  },
  address2: {
    type: String,
    default: '',
    trim: true
  },
  address3: {
    type: String,
    default: '',
    trim: true
  },
  address4: {
    type: String,
    default: '',
    trim: true
  },
  country: {
    type: String,
    default: '',
    trim: true
  },
  zipCode: {
    type: Number,
    default: '',
    trim: true
  },
  webAddress: {
    type: String,
    default: '',
    trim: true
  },
  productImageURL: {
    type: String,
    default: '',
    trim: true
  },
  firebaseImageUrl: {
    type: String,
    default: '',
    trim: true
  },
  httpImageUrl: {
    type: String,
    default: '',
    trim: true
  },
  affliateLink: {
    type: String,
    default: '',
    trim: true
  },
  companyWebsite: {
    type: String,
    default: '',
    trim: true
  },
  email: {
    type: String,
    default: '',
    trim: true
  },
  mobileCode: {
    type: Number,
    default: '',
    trim: true
  },
  phoneNo: {
    type: Number,
    default: '',
    trim: true
  },
  logo: {
    filetype: String,
    base64: String
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  avgRatings: {
    type: Number,
    default: 0
  },
  totalRatingsCount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'active',
    trim: true
  },
  premiumFlag: {
    type: Boolean,
    default: false
  },
  featuredFlag: {
    type: Boolean,
    default: false
  },
  isComingSoon: {
    type: Boolean,
    default: false
  },
  /*productStatus: {
    type: Boolean,
    default: true
  },*/
  businessSector: [],
  serviceOffered: [],
  operationalRegions: [],
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Company', CompanySchema);
