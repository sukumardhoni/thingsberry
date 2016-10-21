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
      _this.deleteExpressRedis();
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
  //  console.log('### MIDHUN :' + req.company)
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
exports.deleteExpressRedis = function () {
  console.log("@@@#####%%: CALLED DELETE EXPRESSREDIS");
  var cli = require('redis').createClient(config.redis.uri);

  cli.keys('*', function (err, keys) {
    if (err) return console.log(err);

    cli.flushall();
    console.log("$$###FLUSH:" + cli.flushall());
    /*
        for (var i = 0, len = keys.length; i < len; i++) {
          // console.log(keys[i]);
          if (keys[i].indexOf('listProducts') !== -1) {
            // console.log("$$##@@ IS THERE");
            cli.del("erc:listProducts", function (err, result) {
              if (err) return console.log(err);
              // console.log("@@@ DELTETE:" + result);
            })
          }

          if (keys[i].indexOf('featuredProducts') !== -1) {
            //  console.log("$$##@@ IS THERE");
            cli.del("erc:featuredProducts", function (err, result) {
              if (err) return console.log(err);
              // console.log("@@@ DELTETE:" + result);
            })
          }

        }*/
  });
};
exports.deactivateProduct = function (req, res) {
  console.log("@@## ENTERIN TO DEACTIVATE PRODUCT");
  console.log(JSON.stringify(req.params));
  console.log("$$$ REQ.COMPANY DEACTIVE:" + JSON.stringify(req.company.status));
  req.body.status = req.params.deactive;
  console.log("$$$ REQ.BODY DEACTIVE:" + JSON.stringify(req.body.ProCat));
  var company = req.company;

  company = _.extend(company, req.body);

  company.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      _this.deleteExpressRedis();
      res.json(company);
      console.log(company);
    }
  });

};

exports.update = function (req, res) {

  var company = req.company;

  // console.log('Company details are : ' + JSON.stringify(req.body));
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
      _this.deleteExpressRedis();
      res.json(company);
      // console.log(company);
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
  console.log("@@####CALED DELTE SERVER CNTRLER");
  var company = req.company;

  company.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      _this.deleteExpressRedis();
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

    Company.find({
      "status": "active"
    }).count({}, function (err, count) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        //console.log('Server side List of products : ' + JSON.stringify(companies));
        //res.json(count);
        ProObj.count = count;
        // console.log('Server side List of products count : ' + JSON.stringify(count));
      }
    });
  }


  // console.log('Products count is : ' + JSON.stringify(count));

  Company.find({
    "status": "active"
  }).skip(req.params.pageId * 12).limit(12).sort('-created').exec(function (err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      ProObj.products = companies;
      console.log('Server side List of products : ' + JSON.stringify(ProObj.count));
      res.json(ProObj);
      // console.log("@@@@:" + JSON.stringify(ProObj));
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



  if ((req.params.ProCompany != 'Company') && (req.params.ProName != 'Product')) {
    queryStr = req.params.ProCompany + ' ' + req.params.ProName
  } else if ((req.params.ProCompany != 'Company')) {
    queryStr = req.params.ProCompany
  } else if ((req.params.ProName != 'Product')) {
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
  var sampleArray = [];

  // var proCatsForSingleSearch = [];
  //var eg1 = JSON.stringify(proCatsForSingleSearch);
  //var eg2 = eg1.replace(/"/g, "/");
  // var proCatsForSingleSearch1 = proCatsForSingleSearch[0].replace("\"/g", "");
  //  console.log('proCats  array is OUT : ' + JSON.stringify(eg2));
  if (req.params.ProCategory != 'Category') {
    var CatsArray = req.params.ProCategory.split(',');

    console.log('@@@@CatsArray  array is : ' + JSON.stringify(CatsArray));
    /*var eg1 = JSON.stringify(CatsArray);
    var eg2 = eg1.replace(/"/g, "/");
    console.log(eg2);*/
    // var CATS = '/' + CatsArray.join('/,/') + '/';

    for (var i = 0; i < CatsArray.length; i++) {
      sampleArray.push(CatsArray[i]);
    }



    for (var i = 0; i < CatsArray.length; i++) {
      // CatsArray[i] = CatsArray[i].replace(/"/g, "/");

      // var cats = '/' + CatsArray[i] + '/';
      // console.log("HSIS:" + cats.replace(/"/g, ""));
      // var cats1 = cats.replace(/(^"|"$)/g, '');
      // proCatsForSingleSearch.push(CatsArray[i]);

      // console.log("$%%$$:" + JSON.stringify(cats));

      proCats.push({
        title: CatsArray[i]
      });
    }
    console.log('proCats  array is : ' + JSON.stringify(sampleArray));

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
    var regexArray1 = sampleArray.map(x => new RegExp(x));
    console.log("RESULTANT111:" + regexArray1);
    if (req.params.ProCategory && req.params.ProCompany !== 'Company' && req.params.ProName !== 'Product') {
      var productName = req.params.ProName;
      var productCompany = req.params.ProCompany;
      var productCmpnyRegex = new RegExp(productCompany, 'i');
      console.log('@@Product Company: ' + productCmpnyRegex);
      mongoQuery = {
        $text: {
          $search: productName
        },
        "ProCat": {
          $elemMatch: {
            "title": {
              $in: regexArray1
            }
          }
        },
        "Comname": {
          $regex: productCmpnyRegex
        }
      }
    } else {
      // console.log('else satisfied');
      mongoQuery = {
        $text: {
          $search: queryStr
        },
        "ProCat": {
          $elemMatch: {
            "title": {
              $in: regexArray1
            }
          }
        }
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
    var regexArray = sampleArray.map(x => new RegExp(x));
    console.log("RESULTANT:" + regexArray);
    mongoQuery = {
      ProCat: {
        $elemMatch: {
          "title": {
            $in: regexArray
          }
        }
      }
    }
  } else if (queryStr != '') {
    /*if (req.params.ProCompany != '') {
      console.log("only ProCompany");
      var companyName = new RegExp(req.params.ProCompany, 'i');
      mongoQuery = {
        "Comname": {
          $regex: companyName
        }
      }

    } else if (req.params.ProName != '') {
      console.log("only ProName");
      var productName = new RegExp(req.params.ProName, 'i');
      mongoQuery = {
        "Proname": {
          $regex: productName
        }
      }
    } else if (req.params.ProCompany && req.params.ProName) {
      console.log("both proName and company name");
    } else {
      console.log("all products");
      mongoQuery = {
        $text: {
          $search: queryStr
        }
      }
    }*/
    if (req.params.ProCompany !== 'Company' && req.params.ProName !== 'Product') {
      console.log("both proName and company name");
      var p1 = req.params.ProName;
      var proName = new RegExp(p1, 'i');
      console.log(" proName :" + proName);
      var p2 = req.params.ProCompany;
      var proComp = new RegExp(p2, 'i');
      console.log("company name:" + proComp);
      mongoQuery = {
        "Comname": {
          $regex: proComp
        },
        "Proname": {
          $regex: proName
        }
      }
    } else if (req.params.ProName !== 'Product') {
      console.log("only pro name");
      var pName = new RegExp(req.params.ProName, 'i');
      mongoQuery = {
        "Proname": {
          $regex: pName
        }
      }
    } else if (req.params.ProCompany !== 'Company') {
      console.log('only company name');
      var cName = new RegExp(req.params.ProCompany, 'i');
      mongoQuery = {
        "Proname": {
          $regex: cName
        }
      }
    } else {
      console.log("all products");
      mongoQuery = {
        $text: {
          $search: queryStr
        }
      }
    }


  } else if ((operationalRegns.length != 0)) {
    mongoQuery = {
      operationalRegions: {
        $all: operationalRegns
      }
    }
  }

  /*{$text:{$search:queryStr}},{ProCat:{$elemMatch:{"title":{$in:regexArray1}}}}*/
  /*{$text:{$search:"philips"},"ProCat":{$elemMatch:{"title":{$in:[/Home/]}}}}*/

  /*{$text:{$search:"beautiful"},"ProCat":{$elemMatch:{"title":{$in:[/Home/]}}},"Comname":{$regex:/philips/i}}*/



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
    // console.log('@@## MIDHUN1 :' + company);
    req.company = company;

    next();
  });
};
