'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Quotes = mongoose.model('Quotes'),
  Subscribes = mongoose.model('emailsubscribers');

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


exports.subscribeUpdates = function (req, res) {
  console.log(req.body);
  Subscribes.find({
    email: req.body.email
  }).exec(function (err, result) {

    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("IS THER ALREADY : " + JSON.stringify(result));
      if (result.length == 0) {
        console.log("IS not there");
        var subscribersMail = new Subscribes(req.body);
        // console.log(client);
        subscribersMail.save(function (err) {
          if (err) {
            // console.log('error details on server : ' + err);
            return res.status(400).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(subscribersMail);
            // console.log(quotes);
          }
        });
      } else {
        console.log("IS there");
        res.json(result);
      }
    }
  })


  /*  var subscribersMail = new Subscribes(req.body);
    // console.log(client);
    subscribersMail.save(function (err) {
      if (err) {
        // console.log('error details on server : ' + err);
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(subscribersMail);
        // console.log(quotes);
      }
    });*/
}
