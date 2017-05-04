'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Quotes = mongoose.model('Quotes'),
  MailChimpSprAgent = require('superagent'),
  Subscribes = mongoose.model('emailsubscribers');

var mailchimpInstance = 'us15',
  listUniqueId = 'bafd588e67',
  mailchimpApiKey = 'd6575fc6bcb87ab28da0c77d57adab17-us15';

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
            MailChimpSprAgent
              .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
              .set('Content-Type', 'application/json;charset=utf-8')
              .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey).toString('base64'))
              .send({
                'email_address': req.body.email,
                'status': 'subscribed'
              })
              .end(function (err, response) {
                if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                  console.log("signed up succesfully");
                  // res.send('Signed Up!');
                } else {
                  console.log("signed up in error");
                  // res.send('Sign Up Failed :(');
                }
              });
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
}


/*exports.subscribeUpdates = function (req, res) {
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
}*/
