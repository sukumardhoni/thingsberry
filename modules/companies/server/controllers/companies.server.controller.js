'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an company
 */
exports.create = function (req, res) {
  var company = new Company(req.body);
  company.user = req.user;

  //console.log('Rest side console details : ' + JSON.stringify(req.body.Proname));

  company.save(function (err) {
    if (err) {

      // console.log('error details on server : ' + err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * Show the current company
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var company = req.company ? req.company.toJSON() : {};

  // Add a custom field to the Company, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Company model.
  company.isCurrentUserOwner = req.user && company.user && company.user._id.toString() === req.user._id.toString() ? true : false;

  res.json(company);
};

/**
 * Update an company
 */
exports.update = function (req, res) {
  var company = req.company;

  console.log('Company details are : ' + JSON.stringify(req.body.Proname));
  company = _.extend(company, req.body);
  /*company.title = req.body.title;
  company.content = req.body.content;*/

  company.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * Delete an company
 */
exports.delete = function (req, res) {
  var company = req.company;

  company.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
    }
  });
};

/**
 * List of companies
 */
exports.list = function (req, res) {
  Company.find().sort('-created').populate('user', 'displayName').exec(function (err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      res.json(companies);
    }
  });
};

/**
 * Searched Products List
 */


exports.searchedProductsList = function (req, res) {

  console.log('searchedProductsList id cslled and details are : ' + JSON.stringify(req.params));

  var findObj = {};
  if (req.params.ProCategory && (req.params.ProCategory !== 'Category')) {

    console.log('FIndOBJ print here 1111');

    findObj = {
      ProCat: req.params.ProCategory
    };
    if (req.params.ProCompany && (req.params.ProCompany !== 'Company')) {
      console.log('FIndOBJ print here 1222');
      findObj = {
        ProCat: req.params.ProCategory,
        Comname: req.params.ProCompany
      };
      if (req.params.ProName && (req.params.ProName !== 'Product')) {
        console.log('FIndOBJ print here 1333');
        findObj = {
          ProCat: req.params.ProCategory,
          Comname: req.params.ProCompany,
          Proname: req.params.ProName
        };
      }
    } else if (req.params.ProName && (req.params.ProName !== 'Product')) {
      console.log('FIndOBJ print here 1333');
      findObj = {
        ProCat: req.params.ProCategory,
        Proname: req.params.ProName
      };
    }
  } else if (req.params.ProCompany && (req.params.ProCompany !== 'Company')) {
    console.log('FIndOBJ print here 2111');

    findObj = {
      Comname: req.params.ProCompany
    };
    if (req.params.ProName && (req.params.ProName !== 'Product')) {
      console.log('FIndOBJ print here 1333');
      findObj = {
        Comname: req.params.ProCompany,
        Proname: req.params.ProName
      };
    }
  } else if (req.params.ProName && (req.params.ProName !== 'Product')) {
    console.log('FIndOBJ print here 3111');
    findObj = {
      Proname: req.params.ProName
    };
  }



  console.log('Request FindOBj is : ' + JSON.stringify(findObj));


  Company.find(findObj).exec(function (err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      res.json(companies);
    }
  });


};



/**
 * Company middleware
 */
exports.companyByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Company is invalid'
    });
  }

  Company.findById(id).populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return next(err);
    } else if (!company) {
      return res.status(404).send({
        message: 'No company with that identifier has been found'
      });
    }
    req.company = company;
    next();
  });
};
