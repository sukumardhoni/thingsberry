'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Quotes = mongoose.model('Quotes');

exports.create = function (req, res) {
 // console.log(req.body);
  var quotes = new Quotes(req.body);
  // console.log(client);
  quotes.save(function (err) {
    if (err) {
      // console.log('error details on server : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(quotes);
     // console.log(quotes);
    }
  });
}

exports.list = function (req, res) {

  Quotes.find().exec(function (err, quotes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      res.json(quotes);
     // console.log(quotes);
    }
  });


}
