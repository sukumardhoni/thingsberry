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
  //  console.log('catsCheck function is called : ' + JSON.stringify(cats));
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
  console.log('### MIDHUN :' + req.company)
  var company = req.company ? req.company.toJSON() : {};

  // Add a custom field to the Company, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Company model.
  company.isCurrentUserOwner = req.user && company.user && company.user._id.toString() === req.user._id.toString()

  ? true: false;

  res.json(company);
};

/**
 * Update an company
 */
exports.update = function (req, res) {
  var company = req.company;

  console.log('Company details are : ' + JSON.stringify(req.body));
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
      console.log(company);
    }
  });
};


/**UPDATE RATINGS**/

function calculateRating(previousRatingValue, userRating, avgRatings, totalUsers) {

  if (previousRatingValue == 0) {

    var sum = (((avgRatings * totalUsers) - parseInt(previousRatingValue)) + parseInt(userRating));
    //  console.log("sum:" + sum);
    var usersCount = parseInt(totalUsers + 1);
    //  console.log("usersCount:" + usersCount);
    var avg = sum / usersCount;
    //  console.log("avg:" + avg);
    //  console.log("coming to true condition count have to increase");

  } else {

    sum = (((avgRatings * totalUsers) - parseInt(previousRatingValue)) + parseInt(userRating));
    //  console.log("sum:" + sum);
    //  console.log("total users:" + totalUsers);
    avg = sum / totalUsers;
    //  console.log("coming to false condition no count increament");
  }

  return avg;
};


exports.updateRating = function (req, res) {

  // console.log("@@@@@@@@ coming to createRating server side function");

  var previousRatingValue = req.params.previousRatingValue;
  // console.log("previousRatingValue:" + previousRatingValue);
  var userRating = req.params.userRating;
  //  console.log("userRating:" + userRating);
  var avgRatings = req.company.avgRatings;
  //  console.log("avgRatings:" + avgRatings);
  var totalUsers = req.company.totalRatingsCount;
  //  console.log("totalUsers:" + totalUsers);

  var currentRating = calculateRating(previousRatingValue, userRating, req.company.avgRatings, req.company.totalRatingsCount);

  // console.log("currentRating is :" + currentRating);
  if (previousRatingValue == 0) {

    var count = req.company.totalRatingsCount;
    count++

  } else if (userRating == 0) {

    count = req.company.totalRatingsCount;
    count--;

  } else {
    count = req.company.totalRatingsCount;
  }

  req.body.avgRatings = Math.round(currentRating);
  //  console.log("save to avgRatings:" + req.body.avgRatings);
  req.body.totalRatingsCount = count;
  //  console.log("save to totalCount:" + req.body.totalRatingsCount);

  var company = req.company;

  company = _.extend(company, req.body);

  company.save(function (err) {
    if (err) {
      console.log("@@@@ error:" + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(company);
      //    console.log("####:" + company);
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


  var ProObj = {};
  ProObj.products = [];
  ProObj.count = 0;
  console.log('req.params.pageId is : ' + req.params.pageId);

  if (req.params.pageId == 0) {

    Company.find().count({}, function (err, count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //console.log('Server side List of products : ' + JSON.stringify(companies));
        //res.json(count);
        ProObj.count = count;
        console.log('Server side List of products count : ' + JSON.stringify(count));
      }
    });
  }


  //console.log('Products count is : ' + JSON.stringify(count));

  Company.find().skip(req.params.pageId * 12).limit(12).sort('-created').exec(function (err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ProObj.products = companies;
      //console.log('Server side List of products : ' + JSON.stringify(ProObj.count));
      res.json(ProObj);
      //  console.log("@@@@:" + JSON.stringify(ProObj));
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
 * List of Premium Products
 */
exports.featuredProductsList = function (req, res) {

  Company.find({
    featuredFlag: true
  }).limit(12).exec(function (err, companies) {
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

  var ProObj = {};
  ProObj.products = [];
  ProObj.count = 0;


  var mongoQuery, queryStr = '';



  if ((req.params.ProCompany != undefined) && (req.params.ProName != undefined)) {
    queryStr = req.params.ProCompany + ' ' + req.params.ProName
  } else if ((req.params.ProCompany != undefined)) {
    queryStr = req.params.ProCompany
  } else if ((req.params.ProName != undefined)) {
    queryStr = req.params.ProName
  }

  //console.log('Request FindOBj is : ' + JSON.stringify(findObj));
  console.log('Request queryStr is : ' + JSON.stringify(queryStr));



  var operationalRegns = [];
  if (req.params.ProRegions) {
    var RegionsArray = req.params.ProRegions.split(',');
    console.log('Request Regions array is : ' + JSON.stringify(RegionsArray));
    for (var i = 0; i < RegionsArray.length; i++) {
      operationalRegns.push({
        checked: true,
        name: RegionsArray[i]
      });
    }
  }
  console.log('Request Regions array is : ' + JSON.stringify(operationalRegns));
  var proCats = [];
  if (req.params.ProCategory != 'Category') {
    var CatsArray = req.params.ProCategory.split(',');

    //  console.log('CatsArray  array is : ' + JSON.stringify(CatsArray));


    for (var i = 0; i < CatsArray.length; i++) {
      proCats.push({
        title: CatsArray[i]
      });
    }
    //  console.log('proCats  array is : ' + JSON.stringify(proCats));
  }




  if ((proCats.length != 0) && (operationalRegns.length != 0) && queryStr != '') {
    mongoQuery = {
      ProCat: {
        "$in": proCats
      },
      $text: {
        $search: queryStr
      },
      operationalRegions: {
        $all: operationalRegns
      }
    }
  } else if ((proCats.length != 0) && (operationalRegns.length != 0)) {
    mongoQuery = {
      ProCat: {
        "$in": proCats
      },
      operationalRegions: {
        $all: operationalRegns
      }
    }
  } else if ((proCats.length != 0) && queryStr != '') {
    mongoQuery = {
      ProCat: {
        "$in": proCats
      },
      $text: {
        $search: queryStr
      }
    }
  } else if ((operationalRegns.length != 0) && queryStr != '') {
    mongoQuery = {
      $text: {
        $search: queryStr
      },
      operationalRegions: {
        $all: operationalRegns
      }
    }
  } else if ((proCats.length != 0)) {
    mongoQuery = {
      ProCat: {
        "$in": proCats
      }
    }
  } else if (queryStr != '') {
    mongoQuery = {
      $text: {
        $search: queryStr
      }
    }
  } else if ((operationalRegns.length != 0)) {
    mongoQuery = {
      operationalRegions: {
        $all: operationalRegns
      }
    }
  }









  if (req.params.pageId == 0) {
    Company.find(mongoQuery).count({}, function (err, count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //console.log('Server side List of products : ' + JSON.stringify(companies));
        //res.json(count);
        ProObj.count = count;
        console.log('Server side List of products count  with str: ' + JSON.stringify(count));
      }
    });
  }

  console.log('Mongo find Query is : ' + JSON.stringify(mongoQuery));


  Company.find(mongoQuery).skip(req.params.pageId * 12).limit(12).sort('-created').exec(function (err, companies) {
    if (err) {

      console.log('Error on search result is : ' + err);

      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ProObj.products = companies;
      //console.log('Server side List of products : ' + JSON.stringify(ProObj.count));
      res.json(ProObj);
    }
  });



};



/**
 * Company middleware
 */
/*exports.companyByID = function (req, res, next, id) {

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
     console.log('@@## MIDHUN1 :'+ company);
    req.company = company;

    next();
  });
};*/
exports.companyByID = function (req, res, next, id) {

  /* if (!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(400).send({
       message: 'Company is invalid'
     });
   }*/

  Company.findOne({
    productId: id
  }).populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return next(err);
    } else if (!company) {
      return res.status(404).send({
        message: 'No company with that identifier has been found'
      });
    }
    console.log('@@## MIDHUN1 :' + company);
    req.company = company;

    next();
  });
};
