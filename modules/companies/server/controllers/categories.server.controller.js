'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category');





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




function eliminateDuplicates(arr) {
  // console.log('$$##@@ Coming to eliminate duplicates function');
  var b = {};
  for (var j = 0; j < arr.length; j++) {
    b[arr[j].toUpperCase()] = arr[j].toLowerCase();
  }
  var c = [];

  for (var key in b) {
    c.push({
      heading: b[key],
      contents: []
    });
  }
  return c;
}





exports.listOfCategories = function (req, res) {
  console.log('@@### calling list of categories from html');
  Category.find().exec(function (err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      //console.log('Server side List of products : ' + JSON.stringify(categories));


      var categoryList = categories;
      var reg, reg1, content;
      var catTitle;
      var headingArray = [];

      for (var i = 0; i < categoryList.length; i++) {
        catTitle = categoryList[i].title;
        if ((catTitle.indexOf('-') !== -1) || (catTitle.indexOf(' ') !== -1)) {
          var ss = catTitle.substring(0, (catTitle.indexOf('-') || catTitle.indexOf(' ')));
          reg = ss.replace(',', '');
          //content = catTitle.substring((catTitle.indexOf('-') || catTitle.indexOf(' ')) + 1);
        } else {
          reg = catTitle;
        }
        // console.log('##$## In for loop after if condition: ' + reg);
        headingArray.push(reg);

      }

      var rightSideCatsArray = eliminateDuplicates(headingArray);
      // console.log(JSON.stringify(rightSideCatsArray.length));

      for (var i = 0; i < categoryList.length; i++) {
        catTitle = categoryList[i].title;
        if ((catTitle.indexOf('-') !== -1) || (catTitle.indexOf(' ') !== -1)) {
          var ss = catTitle.substring(0, (catTitle.indexOf('-') || catTitle.indexOf(' ')));
          reg1 = ss.replace(',', '');
          content = catTitle.substring((catTitle.indexOf('-') || catTitle.indexOf(' ')) + 1);

        } else {
          reg1 = catTitle;
        }
        for (var l = 0; l < rightSideCatsArray.length; l++) {
          var head = reg1.toLowerCase();
          //  console.log("Lowercase: " + head);
          if (rightSideCatsArray[l].heading === head) {
            //    console.log("duplicate is there");
            if (rightSideCatsArray[l].contents.indexOf(content) === -1) {
              if (content !== undefined) {
                rightSideCatsArray[l].contents.push(content);
              }
            }
          }
        }
      }

      // console.log('@@###: ' + JSON.stringify(rightSideCatsArray.length));
      var rightSideAccrdns = getAccrdns(rightSideCatsArray);
      // console.log(JSON.stringify(rightSideAccrdns.length));
      res.json(rightSideAccrdns);
      //  console.log(JSON.stringify(rightSideAccrdns));
    }
  });

};


function getAccrdns(rightSideCatsArray) {
  // console.log('$$%%% count: ' + JSON.stringify(rightSideCatsArray.length));

  rightSideCatsArray.sort(function (a, b) {
    return b.contents.length - a.contents.length;
  });

  var accrdnsArray = [].concat(rightSideCatsArray);
  var accrdnsArray2 = accrdnsArray.splice(5);
  // var accrdnsArray3 = [];
  accrdnsArray.push({
    heading: "Others",
    contents: []
  });
  for (var m = 0; m < accrdnsArray2.length; m++) {
    var categoryTitle = accrdnsArray2[m].heading;
    // var categoryHeading = accrdnsArray2[m].contents;
    // console.log("concat:" + categoryTitle + "-" + categoryHeading);
    // var fullCatTitle = (categoryTitle + ' ' + categoryHeading);

    for (var n = 0; n < accrdnsArray.length; n++) {
      if (accrdnsArray[n].heading === 'Others') {
        accrdnsArray[n].contents.push(categoryTitle)
      }
    }
  }
  // console.log('count: ' + JSON.stringify(accrdnsArray.length));
  //  console.log('count111: ' + JSON.stringify(accrdnsArray2.length));
  // console.log('count111: ' + JSON.stringify(accrdnsArray3.length));

  return accrdnsArray;
}
