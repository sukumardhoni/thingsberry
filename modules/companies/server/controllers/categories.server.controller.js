'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  Company = mongoose.model('Company'),
  _this = this,
  Promise = require("bluebird");;






/**
 * List of categories
 */
exports.list = function (req, res) {
  Category.find().exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      res.json(categories);
    }
  });
};


function countByTitle(categoryTitle) {
  //console.log(categoryTitle);
  /* var CountContent;
   if ((categoryTitle.indexOf('-') !== -1) || (categoryTitle.indexOf(' ') !== -1)) {

     CountContent = categoryTitle.substring((categoryTitle.indexOf('-') || categoryTitle.indexOf(' ')) + 1);
     // console.log("IF: " + CountContent);
   } else {
     CountContent = categoryTitle;
   }
   console.log("categoryTitle: " + categoryTitle);
   console.log("CountContent: " + CountContent);*/
  var regex = [];
  regex.push(categoryTitle);
  var regexArray = regex.map(x => new RegExp(x, 'i'));
  var mongoQuery = {
    ProCat: {
      $elemMatch: {
        "title": {
          $in: regexArray
        }
      }
    }
  }
  return Company.count(mongoQuery).then(function (count) {
    return {
      name: categoryTitle,
      count: count
    };
  });
}



exports.listOfCategories = function (req, res) {
  console.log('@@### calling list of categories from html');


  // console.log("#########" + JSON.stringify(results));
  Category.find().then(function (categories) {
    var categoryList = categories;
    // var resultant;
    var promises = [];
    for (var q = 0; q < categoryList.length; q++) {
      promises.push(countByTitle(categoryList[q].title));
    }
    // console.log(":: " + JSON.stringify(promises));
    Promise.all(promises).then(results => {
        // console.log(JSON.stringify(results));
        var resultant = getResultantArr(results);
        resultant.then(function (result) {
          res.json(result);
        })

      })
      // console.log("#########" + JSON.stringify(resultant));
  }).catch(function (err) {
    //if there is any error while resolving the promises, this block will be called
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
}


function getResultantArr(result) {
  // console.log("%@@@@@@@ Coming to ");
  // console.log(JSON.stringify(result));
  var reg, reg1, content;
  var catTitle, catContentCount;
  var headingArray = [];


  for (var i = 0; i < result.length; i++) {
    catTitle = result[i].name;
    if ((catTitle.indexOf('-') !== -1) || (catTitle.indexOf(' ') !== -1)) {
      var ss = catTitle.substring(0, (catTitle.indexOf('-') || catTitle.indexOf(' ')));
      reg = ss.replace(',', '');
    } else {
      reg = catTitle;
    }
    headingArray.push(reg);
  }
  // console.log("%@@@@@@@ Coming to " + JSON.stringify(headingArray));

  var rightSideCatsArray = eliminateDuplicates(headingArray);
  // console.log("%@@@@@@@ Coming to " + JSON.stringify(rightSideCatsArray));

  for (var i = 0; i < result.length; i++) {
    catTitle = result[i].name;
    catContentCount = result[i].count;
    if ((catTitle.indexOf('-') !== -1) || (catTitle.indexOf(' ') !== -1)) {
      var ss = catTitle.substring(0, (catTitle.indexOf('-') || catTitle.indexOf(' ')));
      reg1 = ss.replace(',', '');
      content = catTitle.substring((catTitle.indexOf('-') || catTitle.indexOf(' ')) + 1);
    } else {
      reg1 = catTitle;
    }
    // console.log("ContentNAme: " + content);
    // console.log("ContentNAme: " + catContentCount);
    for (var l = 0; l < rightSideCatsArray.length; l++) {
      var head = reg1.toLowerCase();
      // console.log("Lowercase: " + head);
      if (rightSideCatsArray[l].heading === head) {
        //  console.log("duplicate is there");
        if (rightSideCatsArray[l].contents.indexOf(content) === -1) {
          if (content !== undefined) {
            if (catContentCount !== 0) {
              rightSideCatsArray[l].contents.push({
                name: content,
                count: catContentCount
              });
            }
          }
        }
      }
    }

  }
  //console.log("!!!!!!FInale " + JSON.stringify(rightSideCatsArray));
  var rightSideAccrdns = getAccrdns(rightSideCatsArray);
  // console.log("After counting the heading count: " + JSON.stringify(rightSideAccrdns));
  return rightSideAccrdns.then(function (result) {
    //  console.log("total array: " + JSON.stringify(result));
    return result;
  });

}



function eliminateDuplicates(arr) {
  console.log('$$##@@ Coming to eliminate duplicates function');
  // console.log('$$##@@ Coming to eliminate duplicates function' + JSON.stringify(arr));
  var b = {};
  for (var j = 0; j < arr.length; j++) {
    b[arr[j].toUpperCase()] = arr[j].toLowerCase();
  }
  //  console.log(b);
  var c = [];

  for (var key in b) {
    c.push({
      heading: b[key],
      contents: []
    });
  }
  return c;
}

function getAccrdns(rightSideCatsArray) {
  // console.log('$$%%%  Coming to getAccrdns : ' + JSON.stringify(rightSideCatsArray));

  rightSideCatsArray.sort(function (a, b) {
    return b.contents.length - a.contents.length;
  });

  var accrdnsArray = [].concat(rightSideCatsArray);
  var accrdnsArray2 = accrdnsArray.splice(5);


  accrdnsArray.push({
    heading: "More",
    contents: []
  });

  var resultantMoreCount = getMoreCount(accrdnsArray2);
  // console.log('count: ' + JSON.stringify(midhun));

  return resultantMoreCount.then(function (count) {
    // console.log("######" + JSON.stringify(count));
    for (var n = 0; n < accrdnsArray.length; n++) {
      if (accrdnsArray[n].heading === 'More') {
        // console.log("coming to More heading");
        for (var b = 0; b < count.length; b++) {
          accrdnsArray[n].contents.push({
            name: count[b].name,
            count: count[b].count
          });
        }
      }
    }
    return accrdnsArray;
    // console.log('count: ' + JSON.stringify(accrdnsArray));
  });
  // console.log("11111111" + JSON.stringify(midhun));


  // console.log("coming to promise: " + JSON.stringify(headingcount));

  // console.log('count: ' + JSON.stringify(accrdnsArray));
  // console.log('count111: ' + JSON.stringify(accrdnsArray2));

  //return accrdnsArray;
}

function getMoreCount(accrdnsArray2) {
  var accrdnsArr3 = [];
  for (var m = 0; m < accrdnsArray2.length; m++) {
    var categoryHeading = accrdnsArray2[m].heading;
    //  console.log(categoryHeading);
    accrdnsArr3.push(countByTitle(categoryHeading));
  }

  return Promise.all(accrdnsArr3).then(headingcount => {
    // console.log('count: ' + JSON.stringify(headingcount));
    return headingcount;
  });
}
