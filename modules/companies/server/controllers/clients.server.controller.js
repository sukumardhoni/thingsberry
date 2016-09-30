'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Clients = mongoose.model('Clients');

exports.create = function (req, res) {
  /* console.log(req.body);*/
  var client = new Clients(req.body);
  // console.log(client);
  client.save(function (err) {
    if (err) {
      // console.log('error details on server : ' + err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(client);
     // console.log(client);
    }
  });
}

exports.list = function (req, res) {

  Clients.find().exec(function (err, clients) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      //console.log('Server side List of products : ' + JSON.stringify(companies));
      res.json(clients);
     // console.log(clients);
    }
  });


}
