'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Category = mongoose.model('Category'),
  config = require('../../../../config/config'),
  agenda = require('../../../../schedules/job-schedule')(config.db),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _this = this;

/**
 * Create an company
 */
exports.create = function (req, res) {
  var company = new Company(req.body);
  company.user = req.user;
  var ProCatsArray = req.body.ProCat;
  _this.catsCheck(ProCatsArray);

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

exports.catsCheck = function (cats) {
  var ProCatsArray = cats;
  console.log('catsCheck function is called : ' + JSON.stringify(cats));
  Category.distinct("title").exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('list of cats exists : ' + JSON.stringify(categories));
      for (var i = 0; i < ProCatsArray.length; i++) {
        if (!('_id' in ProCatsArray[i])) {
          if (categories.toString().toLowerCase().indexOf(ProCatsArray[i].title.toLowerCase()) == -1) {
            var cat = new Category(ProCatsArray[i]);
            cat.save(function (err) {
              if (err) {
                console.log('Error while saving the cats');
              } else {
                console.log('Suucessfully saved the cats');
              }
            })
          }
        }
      }
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
  var ProCatsArray = req.body.ProCat;
  _this.catsCheck(ProCatsArray);

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
  Company.find().skip(req.params.pageId * 10).limit(10).exec(function (err, companies) {
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
 * List of Premium Products
 */
exports.premiumProductsList = function (req, res) {

  Company.find({
    premiumFlag: true
  }).limit(10).exec(function (err, companies) {
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

  var replacedCats, queryStr;
  if (req.params.ProCategory) {
    replacedCats = req.params.ProCategory.replace(/\,/g, " ");
  }


  if ((req.params.ProCategory == undefined) && (req.params.ProCompany == undefined) && (req.params.ProName == undefined)) {
    queryStr = '';
  } else {
    queryStr = replacedCats + ' ' + req.params.ProCompany + ' ' + req.params.ProName
  }

  //console.log('Request FindOBj is : ' + JSON.stringify(findObj));
  //console.log('Request FindOBj is : ' + JSON.stringify(queryStr));



  Company.find({
    $text: {
      $search: queryStr
    }
  }).skip(req.params.pageId * 10).limit(10).exec(function (err, companies) {
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
