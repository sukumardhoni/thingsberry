'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Videos = mongoose.model('Videos');

exports.create = function (req, res) {
  console.log(req.body);
  var videos = new Videos(req.body);
  console.log(videos);
  videos.save(function (err) {
    if (err) {
      // console.log('error details on server : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(videos);
      // console.log(client);
    }
  });
}

exports.list = function (req, res) {

  Videos.find().exec(function (err, videos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      res.json(videos);
      // console.log(clients);
    }
  });


}
