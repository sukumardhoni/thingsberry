'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  DeactivePrdcts = mongoose.model('DeactivePrdcts'),
  Category = mongoose.model('Category'),
  config = require('../../../../config/config'),
  agenda = require('../../../../schedules/job-schedule')(config.db),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _this = this,
  https = require('https'),
  fs = require('fs'),
  url = require('url'),
  hh = require('http-https'),
  Promise = require("bluebird"),
  moment = require('moment'),
  momentTimezone = require('moment-timezone');
require('pkginfo')(module, 'name', 'description', 'version');



/**
 * Company Live status
 */

exports.live = function (req, res) {
  res.json(_.extend({
    'message': 'api is alive !'
  }, module.exports));
};

/**
 * Company Products status
 */

exports.productsStatus = function (req, res) {
  var productsStats = {};
  Company.find({
    "status": "active"
  }).count().then(function (result) {
    console.log("$$$ COUNT : " + JSON.stringify(result));
    productsStats.Active_Products = result;
    Company.find({
      "status": "deactive"
    }).count().then(function (resultant) {
      console.log("$$$ INACTIVE COUNT : " + JSON.stringify(resultant));
      productsStats.Inactive_Products = resultant;

      Company.find().count().then(function (totalRes) {
        productsStats.Total_Products = totalRes;

        Company.find({
          affliateLink: {
            $exists: true
          }
        }).count().then(function (affliateResult) {
          console.log("$$$ Affliate Link COUNT : " + JSON.stringify(affliateResult));
          productsStats.Affliate_Products_count = affliateResult;


          exports.name = require('../../../../package.json').name;
          exports.description = require('../../../../package.json').description;
          exports.version = require('../../../../package.json').version;

          res.json(_.extend({
            'name': exports.name,
            'description': exports.description,
            'version': exports.version,
            'Total_Products_Count': productsStats.Total_Products,
            'Active_Products_Count': productsStats.Active_Products,
            'Inactive_Products_Count': productsStats.Inactive_Products,
            'Affliate_Link_Products_count': productsStats.Affliate_Products_count
          }));

          var stats = {
            'name': exports.name,
            'description': exports.description,
            'version': exports.version,
            'Total_Products_Count': productsStats.Total_Products,
            'Active_Products_Count': productsStats.Active_Products,
            'Inactive_Products_Count': productsStats.Inactive_Products,
            'Affliate_Products_count': productsStats.Affliate_Products_count
          };

          /*   var presentDate = moment().format('MMMM Do YYYY, h:mm:ss a');*/
          var presentYear = momentTimezone().tz("America/New_York").format('YYYY');
          agenda.now('Products_Stats', {
            presentYear: presentYear,
            stats: stats
          });
          console.log("### : " + JSON.stringify(stats));
        })

      });


    });
  });

};

/**
 * Create an company
 */
exports.create = function (req, res) {
  // console.log("BEFOR : " + JSON.stringify(req.body));

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
      getMsgForAddedProduct(company);
    }
  });
};

function getMsgForAddedProduct(product) {
  console.log("NEW ADDED PRODUCT : " + JSON.stringify(product));
  var AddedNewProductDetails = {
    productId: product._id,
    operationalRegions: product.operationalRegions,
    premiumFlag: product.premiumFlag,
    featuredFlag: product.featuredFlag,
    description: product.description,
    phoneNo: product.phoneNo,
    mobileCode: product.mobileCode,
    email: product.email,
    companyWebsite: product.companyWebsite,
    productImageURL: product.productImageURL,
    webAddress: product.webAddress,
    zipCode: product.zipCode,
    country: product.country,
    address1: product.address1,
    address2: product.address2,
    address3: product.address3,
    address4: product.address4,
    Comname: product.Comname,
    ProCat: product.ProCat,
    Proname: product.Proname,
    status: product.status,
    affliateLink: product.affliateLink
  }
  console.log("NEW ADDED PRODUCT OBJ : " + JSON.stringify(AddedNewProductDetails));

  var presentYear2 = momentTimezone().tz("America/New_York").format('YYYY');
  agenda.now('Added_New_Product_Details', {
    presentYear: presentYear2,
    AddedNewProductDetails: AddedNewProductDetails
  });
}


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
  });
};

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



/*
exports.exmpleRedis = function () {
  console.log("@@@#####%%: COMING TO EXPRESSREDIS FUNC ");
  var clie = require('redis').createClient(config.redis.uri);

  clie.set("productName", "http://MOBILE-MOTO.jpg");
  clie.keys("*", function (err, keys) {

    keys.forEach(function (key, pos) {
      // console.log("REDIS $$$$ : " + key);
      if (key.indexOf('erc:/api/') !== -1) {
        console.log("REDIS $$$$ : " + key);
        clie.del(key, function (err, result) {
          if (err) return console.log(err);
          console.log("@@@ DELTETE:" + result);
        })
      }

    });
  });
  clie.keys("*", function (err, keys) {
    keys.forEach(function (key, pos) {
      console.log("REDIS @@@@ : " + key);
    });
  });
};
*/



function getMsgForUpdateProducts(oldProduct, newProduct) {

  console.log('Company details are11@@ : ' + JSON.stringify(oldProduct));
  console.log('Company details are@@ : ' + JSON.stringify(newProduct));

  var oldPrdctDetails = {
    productId: oldProduct._id,
    operationalRegions: oldProduct.operationalRegions,
    premiumFlag: oldProduct.premiumFlag,
    featuredFlag: oldProduct.featuredFlag,
    description: oldProduct.description,
    phoneNo: oldProduct.phoneNo,
    mobileCode: oldProduct.mobileCode,
    email: oldProduct.email,
    companyWebsite: oldProduct.companyWebsite,
    productImageURL: oldProduct.productImageURL,
    webAddress: oldProduct.webAddress,
    zipCode: oldProduct.zipCode,
    country: oldProduct.country,
    address1: oldProduct.address1,
    address2: oldProduct.address2,
    address3: oldProduct.address3,
    address4: oldProduct.address4,
    Comname: oldProduct.Comname,
    ProCat: oldProduct.ProCat,
    Proname: oldProduct.Proname,
    status: oldProduct.status,
    affliateLink: oldProduct.affliateLink
  }

  var newPrdctDetails = {
    productId: newProduct._id,
    operationalRegions: newProduct.operationalRegions,
    premiumFlag: newProduct.premiumFlag,
    featuredFlag: newProduct.featuredFlag,
    description: newProduct.description,
    phoneNo: newProduct.phoneNo,
    mobileCode: newProduct.mobileCode,
    email: newProduct.email,
    companyWebsite: newProduct.companyWebsite,
    productImageURL: newProduct.productImageURL,
    webAddress: newProduct.webAddress,
    zipCode: newProduct.zipCode,
    country: newProduct.country,
    address1: newProduct.address1,
    address2: newProduct.address2,
    address3: newProduct.address3,
    address4: newProduct.address4,
    Comname: newProduct.Comname,
    ProCat: newProduct.ProCat,
    Proname: newProduct.Proname,
    status: newProduct.status,
    affliateLink: newProduct.affliateLink
  }
  console.log('Company  : ' + JSON.stringify(oldPrdctDetails));

  var presentYear1 = momentTimezone().tz("America/New_York").format('YYYY');
  agenda.now('Updated_Product_Details', {
    presentYear: presentYear1,
    oldProductDeatils: oldPrdctDetails,
    newProductDeatils: newPrdctDetails
  });




}

exports.update = function (req, res) {

  var company = req.company;
  var oldProductDetials = JSON.parse(JSON.stringify(req.company));
  // console.log('Company details are11@@ : ' + JSON.stringify(oldProductDetials));
  // console.log('Company details are AFTER : ' + JSON.stringify(req.body.status));
  company = _.extend(company, req.body);
  var ProCatsArray = req.body.ProCat;
  _this.catsCheck(ProCatsArray);

  company.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log('Company details are@@ : ' + JSON.stringify(oldProductDetials.status));
      // console.log('Company details are : ' + JSON.stringify(req.body.status));
      _this.deleteExpressRedis();
      res.json(company);
      getMsgForUpdateProducts(oldProductDetials, company);
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
      console.log("@@####CALED DELTE SERVER CNTRLER" + JSON.stringify(company));
      getMsgForDeleteProduct(company);
    }
  });
};

function getMsgForDeleteProduct(product) {
  console.log("DeletedProductDetails : " + JSON.stringify(product));
  var DeletedProductDetails = {
    productId: product._id,
    operationalRegions: product.operationalRegions,
    premiumFlag: product.premiumFlag,
    featuredFlag: product.featuredFlag,
    description: product.description,
    phoneNo: product.phoneNo,
    mobileCode: product.mobileCode,
    email: product.email,
    companyWebsite: product.companyWebsite,
    productImageURL: product.productImageURL,
    webAddress: product.webAddress,
    zipCode: product.zipCode,
    country: product.country,
    address1: product.address1,
    address2: product.address2,
    address3: product.address3,
    address4: product.address4,
    Comname: product.Comname,
    ProCat: product.ProCat,
    Proname: product.Proname,
    status: product.status,
    affliateLink: product.affliateLink
  }
  console.log("NEW DELETED PRODUCT OBJ : " + JSON.stringify(DeletedProductDetails));

  var presentYear = momentTimezone().tz("America/New_York").format('YYYY');
  agenda.now('Deleted_Product_Details', {
    presentYear: presentYear,
    DeletedProductDetails: DeletedProductDetails
  });
}


/**
 * List of companies
 */
exports.list = function (req, res) {

  var ProObj = {};
  ProObj.products = [];
  ProObj.count = 0;
  //  console.log('req.params.pageId is : ' + req.params.pageId);
  if (req.params.adminStatus !== 'admin') {

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
  } else {
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
          // console.log('Server side List of products count : ' + JSON.stringify(count));
        }
      });
    }


    // console.log('Products count is : ' + JSON.stringify(count));

    Company.find().skip(req.params.pageId * 12).limit(12).sort('-created').exec(function (err, companies) {
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

  }
};

/**
 * List of Premium Products
 */
exports.premiumProductsList = function (req, res) {

  Company.find({
    "status": "active",
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


/*exports.getAllPrdcts = function (req, res) {


  hh.get('http://topsolute.com/wp-content/uploads/2016/03/Skybellhd-homemb.png', function (res) {
    console.log("ERROR OF ANOTHER PRDCTS : " + JSON.stringify(res.statusCode));
  });

};*/

exports.getAllRoutes = function (req, res) {
  var routes = {
    isAlive: '/isAlive',
    stats: '/stats',
    findDuplicates: '/findDuplicateProducts',
    cleanUpInactive: '/cleanUpInactive',
  };

  res.json(_.extend({
    'message': 'api is alive !',
    'name': exports.name,
    'description': exports.description,
    'version': exports.version,
    'routes': routes
  }));
};


exports.getDuplicateProducts = function (req, res) {
  Company.aggregate([
    {
      $group: {
        _id: {
          Proname: "$Proname"
        },
        uniqueIds: {
          $addToSet: "$_id"
        },
        Desc: {
          $addToSet: "$description"
        },
        count: {
          $sum: 1
        }
      }
    },
    {
      $match: {
        count: {
          $gte: 2
        }
      }
    },
    {
      $sort: {
        count: -1
      }
    }
]).exec(function (err, dupProds) {
    if (err) {
      console.log("ERROR IN DUPLICATE PROD FUNCTION : " + JSON.stringify(err));
    } else {
      // console.log("ALL DUPLICATE PRDCTS : " + JSON.stringify(dupProds));
      var prodArray = [];
      var uniqueIdCount = 0;
      for (var i = 0; i < dupProds.length; i++) {
        console.log("PROD DETAILS FOR : ");
        Company.find({
          "Proname": dupProds[i]._id.Proname
        }).then(function (prodDetails) {
          uniqueIdCount = uniqueIdCount + 1;
          // console.log("PROD DETAILS : " + JSON.stringify(prodDetails));
          // console.log("PROD DETAILS COUNT : " + JSON.stringify(uniqueIdCount));
          for (var k = 0; k < prodDetails.length; k++) {
            var dupProdData = {
              prodId: prodDetails[k]._id,
              prodName: prodDetails[k].Proname,
              prodDesc: prodDetails[k].description,
              productId: prodDetails[k].productId
            }
            prodArray.push(dupProdData);
          }
          if (dupProds.length == uniqueIdCount) {
            console.log("TOTAL DETAILS : " + JSON.stringify(prodArray));
            res.json(_.extend({
              'message': 'Duplicate Products',
              'Total Duplicate_Products_Count': prodArray.length,
              'Duplicate_Products': prodArray
            }));
            var presentDate = momentTimezone().tz("America/New_York").format('MMMM Do YYYY, h:mm:ss a');
            var presentYear = momentTimezone().tz("America/New_York").format('YYYY');
            agenda.now('Duplicate_Products', {
              duplicateProdRunDate: presentDate,
              presentYear: presentYear,
              DuplicateProducts: prodArray
            });
          }
        })
      }
    }
  })
};


exports.getDeactiveProducts = function (req, res) {
  Company.find({
    "status": "deactive"
  }).then(function (Dproducts) {
    // console.log("ALL DEACTIVE PRDCTS : " + JSON.stringify(Dproducts.length));
    res.json(Dproducts);
  });
};


function getErrImages(prodObj) {

  return new Promise((resolve, reject) => {

    hh.get(prodObj.productImageURL, function (res) {
        // allPCount = allPCount + 1;
        if (res.statusCode) {
          resolve({
            type: 'success',
            resStatus: res.statusCode,
            name: prodObj.Proname,
            imgUrl: prodObj.productImageURL,
            id: prodObj._id
          })
        }
      })
      .on('error', function (e) {
        resolve({
          type: 'error',
          resStatus: 'none',
          name: prodObj.Proname,
          imgUrl: prodObj.productImageURL,
          id: prodObj._id
        })
      });
  })
};



exports.getErrImgPrdcts = function (req, res) {
  console.log("##### IN HTTP");

  Company.find({
    "status": 'active'
  }).then(function (companies) {
    var errImgPrdctCount = 0;
    var errPrdctsArr = [];
    var totalPrdctsCount = 0;
    var withoutBase64 = 0;
    var withBase64;
    var ifCount = 0;
    var elseCount = 0;
    for (var j = 0; j < companies.length; j++) {
      totalPrdctsCount = totalPrdctsCount + 1;
      if (companies[j].productImageURL.indexOf('base64') == -1) {
        withoutBase64 = withoutBase64 + 1;
        withBase64 = totalPrdctsCount - parseInt(withoutBase64);
        var calback = getErrImages(companies[j]);
        calback.then(function (ress) {
          errImgPrdctCount = errImgPrdctCount + 1;
          console.log('totalPrdctsCount :   ' + totalPrdctsCount);
          console.log('errImgPrdctCount :   ' + errImgPrdctCount);
          console.log('withBase64 :   ' + withBase64);
          console.log('withoutBase64 :   ' + withoutBase64);
          console.log('ressssssssss :   ' + JSON.stringify(ress));
          var resultantObj;
          if (ress.type === 'success') {
            ifCount = ifCount + 1;
            if ((/^[4][0-9]/g.test(ress.resStatus)) || (/^[5][0-9]/g.test(ress.resStatus)) || (ress.resStatus == 302) || (ress.resStatus == 301) || (ress.resStatus == 307) || (ress.resStatus == 308)) {
              // statusCount = statusCount + 1;
              resultantObj = {
                proID: ress.id,
                proName: ress.name,
                imageUrl: ress.imgUrl
              }
              errPrdctsArr.push(resultantObj);
            }
          } else {
            elseCount = elseCount + 1;
            resultantObj = {
              proID: ress.id,
              proName: ress.name,
              imageUrl: ress.imgUrl
            }
            errPrdctsArr.push(resultantObj);
          }
          console.log('ifCount :   ' + ifCount);
          console.log('elseCount :   ' + elseCount);
          var totalErrPrdctsCount = (ifCount + parseInt(elseCount)) + withBase64;
          console.log('totalErrPrdctsCount :   ' + totalErrPrdctsCount);

          if ((totalErrPrdctsCount === companies.length)) {
            console.log('All error products from server is : ' + errPrdctsArr.length);
            var forRedisDelete = 0;
            for (var m = 0; m < errPrdctsArr.length; m++) {
              // console.log("PRODUCT : " + JSON.stringify(errPrdctsArr[m]));
              Company.update({
                "_id": errPrdctsArr[m].proID
              }, {
                $set: {
                  "status": "deactive"
                }
              }).then(function (res) {
                forRedisDelete = forRedisDelete + 1;
                if (forRedisDelete == errPrdctsArr.length) {
                  _this.deleteExpressRedis();
                }
              })
            }

            var presentDate = momentTimezone().tz("America/New_York").format('MMMM Do YYYY, h:mm:ss a');
            var presentYear = momentTimezone().tz("America/New_York").format('YYYY');
            agenda.now('Deactivate_Products', {
              ErrorImagesRunTime: presentDate,
              presentYear: presentYear,
              ErrorImagesProductsLength: errPrdctsArr.length,
              ErrorImagesProducts: errPrdctsArr
            });

            res.json(_.extend({
              'message': 'Inactive Products',
              'Total Inactive_Products': errPrdctsArr.length,
              'Inactive-Products': errPrdctsArr
            }));
            // res.jsonp(errPrdctsArr);
          }
        })
      }
    }

  }).catch(function (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });


};



/**
 * List of Frequently Products
 */
exports.frequentProducts = function (req, res) {
  /*  _this.imgDeactiveFunc();*/
  Company.find({
    "status": 'active'
  }).sort({
    "totalRatingsCount": -1
  }).limit(3).exec(function (err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // console.log('Server side List of products : ' + JSON.stringify(companies));

      res.json(companies);
    }
  });
};


/**
 * List of Featured Products
 */
exports.featuredProductsList = function (req, res) {

  Company.find({
    status: "active",
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

  if (req.params.ProCategory != 'Category') {

    var CatsArray = req.params.ProCategory.split(',');

    console.log('@@@@CatsArray  array is : ' + JSON.stringify(CatsArray));


    for (var i = 0; i < CatsArray.length; i++) {
      sampleArray.push(CatsArray[i]);
    }

    for (var i = 0; i < CatsArray.length; i++) {

      proCats.push({
        title: CatsArray[i]
      });
    }
    console.log('proCats  array is : ' + JSON.stringify(sampleArray));

  }

  if (req.params.adminStatus == 'admin') {

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
      // console.log("RESULTANT111:" + regexArray1);
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
      var regexArray = sampleArray.map(x => new RegExp(x, 'i'));
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

      if (req.params.ProCompany !== 'Company' && req.params.ProName !== 'Product') {
        console.log("both proName and company name");
        var p1 = req.params.ProName;
        var proName = new RegExp(p1, 'i');
        //  console.log(" proName :" + proName);
        var p2 = req.params.ProCompany;
        var proComp = new RegExp(p2, 'i');
        //  console.log("company name:" + proComp);
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
          "Comname": {
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

  } else {
    if ((proCats.length != 0) && (operationalRegns.length != 0) && queryStr != '') {
      mongoQuery = {
        status: 'active',
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
        status: 'active',
        ProCat: {
          "$in": proCats
        },
        operationalRegions: {
          $all: operationalRegns
        }
      }
    } else if ((proCats.length != 0) && queryStr != '') {
      var regexArray1 = sampleArray.map(x => new RegExp(x));
      // console.log("RESULTANT111:" + regexArray1);
      if (req.params.ProCategory && req.params.ProCompany !== 'Company' && req.params.ProName !== 'Product') {
        var productName = req.params.ProName;
        var productCompany = req.params.ProCompany;
        var productCmpnyRegex = new RegExp(productCompany, 'i');
        console.log('@@Product Company: ' + productCmpnyRegex);
        mongoQuery = {
          status: 'active',
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
          status: 'active',
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
        status: 'active',
        $text: {
          $search: queryStr
        },
        operationalRegions: {
          $all: operationalRegns
        }
      }
    } else if ((proCats.length != 0)) {
      var regexArray = sampleArray.map(x => new RegExp(x, 'i'));
      console.log("RESULTANT:" + regexArray);
      mongoQuery = {
        status: 'active',
        ProCat: {
          $elemMatch: {
            "title": {
              $in: regexArray
            }
          }
        }
      }
    } else if (queryStr != '') {

      if (req.params.ProCompany !== 'Company' && req.params.ProName !== 'Product') {
        console.log("both proName and company name");
        var p1 = req.params.ProName;
        var proName = new RegExp(p1, 'i');
        //  console.log(" proName :" + proName);
        var p2 = req.params.ProCompany;
        var proComp = new RegExp(p2, 'i');
        //  console.log("company name:" + proComp);
        mongoQuery = {
          status: 'active',
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
          status: 'active',
          "Proname": {
            $regex: pName
          }
        }
      } else if (req.params.ProCompany !== 'Company') {
        console.log('only company name');
        var cName = new RegExp(req.params.ProCompany, 'i');
        mongoQuery = {
          status: 'active',
          "Comname": {
            $regex: cName
          }
        }
      } else {
        console.log("all products");
        mongoQuery = {
          status: 'active',
          $text: {
            $search: queryStr
          }
        }
      }


    } else if ((operationalRegns.length != 0)) {

      mongoQuery = {
        status: 'active',
        operationalRegions: {
          $all: operationalRegns
        }
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
