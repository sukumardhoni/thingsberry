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
  Promise = require("bluebird");






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


exports.listOfCategories = function (req, res) {
  //console.log('@@### calling list of categories from html');
  Category.find().then(function (categories) {
    var categoryList = categories;
    var promises = [];
    for (var q = 0; q < categoryList.length; q++) {
      promises.push(countByTitle(categoryList[q].title));
    }
    Promise.all(promises).then(results => {

      var resultant = getResultantArr(results);

      resultant.then(function (result) {
        for (var a = 0; a < result.length; a++) {
          var headingCounts = moreContentsTotalCount(result[a].contents);
          // console.log("!!!!! : " + headingCounts);
          result[a].count = headingCounts;
        }
       // console.log("!!!!! : " + JSON.stringify(result));
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

  /* for (var x = 0; x < rightSideCatsArray.length; x++) {
    // console.log("&&&&& : " + JSON.stringify(rightSideCatsArray[x].heading));
     moreContentsTotalCount(rightSideCatsArray[x].contents);
   }*/

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

function sampleHeadingCount(sampleArr) {
  var regexArr = sampleArr.map(x => new RegExp(x, 'i'));
  // console.log("!!!!!!: " + JSON.stringify(regexArr));
  var mongoQuery = {
    ProCat: {
      $elemMatch: {
        "title": {
          $in: regexArr
        }
      }
    }
  }
  return Company.count(mongoQuery).then(function (count) {
   // console.log("@@@@@: " + JSON.stringify(count));
    return count
  });
}



/*function moredbCount(contentMoreArray2, ArrHeading) {
  // console.log("######: " + JSON.stringify(ArrHeading));
  // console.log("!!!!!!!!!: " + JSON.stringify(contentMoreArray2));
  var sampleArr = [];
  for (var a = 0; a < contentMoreArray2.length; a++) {
    if (ArrHeading !== 'More') {
      var fullHeading = ArrHeading + '-' + contentMoreArray2[a].name;
    } else {
      fullHeading = contentMoreArray2[a].name;
    }
    sampleArr.push(fullHeading);
  }
  var sampleCount = sampleHeadingCount(sampleArr);
  return sampleCount.then(function (resultantCount) {
    return resultantCount;
  });
}*/




function contentMoreFunc(contentMore) {
  var contentMoreArray3, contentCount, contentMoreContents;
  // moredbCount(contentMore);

  for (var t = 0; t < contentMore.length; t++) {
    contentMore[t].contents.sort(function (a, b) {
      return parseFloat(b.count) - parseFloat(a.count);
    });
    var ArrHeading1 = contentMore[t].heading;
    contentMore[t].contents = [].concat(contentMore[t].contents);
    contentMoreArray3 = contentMore[t].contents.splice(3);
    contentMore[t].contents.push({
      name: "More",
      contents: [],
      count: 0
    });

    /*   var totalCount = moredbCount(contentMoreArray2, ArrHeading);

       totalCount.then(function (resultantTotalCount) {
         console.log("@@@@@: " + JSON.stringify(resultantTotalCount))
         return resultantTotalCount;
       });*/


    for (var v = 0; v < contentMore[t].contents.length; v++) {
      if (contentMore[t].contents[v].name === 'More') {
        for (var u = 0; u < contentMoreArray3.length; u++) {
          contentMore[t].contents[v].contents.push({
            name: contentMoreArray3[u].name
          })
        }
        // contentMore[t].contents[v].count = totalCount;
      }
    }

  }

  return contentMore;
}

function moreContentsTotalCount(contentMoreArray2) {
  // console.log("!!!!! : " + JSON.stringify(contentMoreArray2));
  var moreContentCounts = 0;
  for (var l = 0; l < contentMoreArray2.length; l++) {
    moreContentCounts = moreContentCounts + contentMoreArray2[l].count;
  }
  // console.log("!!!!! : " + moreContentCounts);
  return moreContentCounts;
}


function getAccrdns(rightSideCatsArray) {
  rightSideCatsArray.sort(function (a, b) {
    return b.contents.length - a.contents.length;
  });
  var accrdnsArray = [].concat(rightSideCatsArray);
  var accrdnsArray2 = accrdnsArray.splice(5);

  accrdnsArray.push({
    heading: "More",
    contents: [],
    count: 0
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
      // var headingCount = moreContentsTotalCount(accrdnsArray[n].contents)
      // accrdnsArray[n].count = headingCount;
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
