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
      res.json(categories);
    }
  });
};


function countByTitle(categoryTitle) {
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

/*function countByTitle1(categoryTitle) {
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
    console.log("HEADING COUNT: " + count);
    return count;

  });
}*/

/*function getHeadingsCout(resultant) {
  // console.log("$$$$$$$$$" + JSON.stringify(resultant));
  for (var k = 0; k < resultant.length; k++) {
    var d = countByTitle1(resultant[k].heading);
    resultant[k].count=d;
    // console.log("$$$$$$$$" + JSON.stringify(d));
  }
  Promise.all(resultant).then(resultssss => {
    console.log("$$$$$$$$$" + JSON.stringify(resultssss));
  });

}*/


exports.listOfCategories = function (req, res) {
  console.log('@@### calling list of categories from html');
  Category.find().then(function (categories) {
    var categoryList = categories;
    var promises = [];
    for (var q = 0; q < categoryList.length; q++) {
      promises.push(countByTitle(categoryList[q].title));
    }
    Promise.all(promises).then(results => {
      var resultant = getResultantArr(results);

      resultant.then(function (result) {
        // var finalResult = getHeadingsCout(result);
        res.json(result);
      })

    })
  }).catch(function (err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
}


function getResultantArr(result) {
  var reg, reg1, content;
  var catTitle, catTitle1, catContentCount;
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

  var rightSideCatsArray = eliminateDuplicates(headingArray);



  for (var j = 0; j < result.length; j++) {
    catTitle1 = result[j].name;
    catContentCount = result[j].count;

    content = undefined;

    if ((catTitle1.indexOf('-') !== -1) || (catTitle1.indexOf(' ') !== -1)) {
      var sss = catTitle1.substring(0, (catTitle1.indexOf('-') || catTitle1.indexOf(' ')));
      reg1 = sss.replace(',', '');
      reg1 = reg1.toLowerCase();
      content = catTitle1.substring((catTitle1.indexOf('-') || catTitle1.indexOf(' ')) + 1);
    } else {
      reg1 = catTitle1;
      reg1 = reg1.toLowerCase();
    }

    for (var l = 0; l < rightSideCatsArray.length; l++) {
      if (content !== undefined) {
        if (catContentCount !== 0) {
          if (rightSideCatsArray[l].heading === reg1) {
            rightSideCatsArray[l].contents.push({
              name: content,
              count: catContentCount
            });
          }
        }
      }
    }

  }

  var rightSideAccrdns = getAccrdns(rightSideCatsArray);
  return rightSideAccrdns.then(function (result) {
    var contentresult = contentMoreFunc(result);
    return contentresult;
  });

}

function eliminateDuplicates(arr) {
  var b = {};
  for (var j = 0; j < arr.length; j++) {
    b[arr[j].toUpperCase()] = arr[j].toLowerCase();
  }

  var c = [];
  for (var key in b) {
    c.push({
      heading: b[key],
      contents: [],
      count: 0
    });
  }

  return c;
}


function contentMoreFunc(contentMore) {
  var contentMoreArray2, contentCount;

  for (var t = 0; t < contentMore.length; t++) {
    contentMore[t].contents.sort(function (a, b) {
      return parseFloat(b.count) - parseFloat(a.count);
    });

    contentMore[t].contents = [].concat(contentMore[t].contents);
    contentMoreArray2 = contentMore[t].contents.splice(3);
    contentMore[t].contents.push({
      name: "More",
      contents: [],
      count: 0
    });
    for (var v = 0; v < contentMore[t].contents.length; v++) {
      if (contentMore[t].contents[v].name === 'More') {
        for (var u = 0; u < contentMoreArray2.length; u++) {
          contentMore[t].contents[v].contents.push({
            name: contentMoreArray2[u].name
          })
        }
        contentCount = contentMore[t].contents[v].contents.length;
        contentMore[t].contents[v].count = contentCount;
      }


    }
  }
  return contentMore;
}



function getAccrdns(rightSideCatsArray) {
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

  return resultantMoreCount.then(function (count) {
    for (var n = 0; n < accrdnsArray.length; n++) {
      if (accrdnsArray[n].heading === 'More') {
        for (var b = 0; b < count.length; b++) {
          if (count[b].count !== 0) {
            accrdnsArray[n].contents.push({
              name: count[b].name,
              count: count[b].count
            });
          }
        }
      }
    }
    return accrdnsArray;
  });
}


function getMoreCount(accrdnsArray2) {
  var accrdnsArr3 = [];
  for (var m = 0; m < accrdnsArray2.length; m++) {
    var categoryHeading = accrdnsArray2[m].heading;
    accrdnsArr3.push(countByTitle(categoryHeading));
  }
  return Promise.all(accrdnsArr3).then(headingcount => {
    return headingcount;
  });
}
