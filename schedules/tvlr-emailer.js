"use strict";

var _ = require('lodash'),
  config = require('../config/config'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  EmailTemplate = require('email-templates').EmailTemplate,
  transporter = nodemailer.createTransport(smtpTransport(config.mailer.options));

exports.sendMail = function (mailData) {
  console.log('An email is being generated for mailData:' + JSON.stringify(mailData));

  var emailTemplate = new EmailTemplate(mailData.templateName);

  var mailOptions = {
    from: config.mailer.from, //'Tveeler Support <support@tveeler.com>', // sender address
    secureConnection: false,
    to: mailData.to, // list of receivers
    subject: mailData.subject // Subject line
  };
  emailTemplate.render({
      displayName: mailData.displayName,
      email: mailData.to,
      userData: mailData.userData,
      contactedDetails: mailData.contactedDetails,
      getListedDetails: mailData.getListedDetails,
      FeedbackDetails: mailData.FeedbackDetails,
      ErrorImagesProducts: mailData.ErrorImagesProducts,
      ErrorImagesProductsLength: mailData.ErrorImagesProductsLength,
      ErrorImagesRunTime: mailData.ErrorImagesRunTime,
      updateBoolVal: mailData.updateBoolVal,
      fromToStatus: mailData.fromToStatus,
      stats: mailData.stats,
      oldProductDeatils: mailData.oldProductDeatils,
      AddedNewProductDetails: mailData.AddedNewProductDetails,
      DeletedProductDetails: mailData.DeletedProductDetails,
      newProductDeatils: mailData.newProductDeatils,
      userDetailsObj: mailData.userDetailsObj,
      DuplicateProducts: mailData.DuplicateProducts,
      duplicateProdRunDate: mailData.duplicateProdRunDate,
      httpImageProdRunDate: mailData.httpImageProdRunDate,
      HttpImageProducts: mailData.HttpImageProducts,
      presentYear: mailData.presentYear,
      resetUrl: mailData.url,
      appEnv: config.app.title
    },
    function (err, results) {
      if (err) {
        console.log('Failure to send recovery email, err is: ' + err);
      } else {
        mailOptions.html = results.html;
      }
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('error in sending mail: ' + error);
        } else {
          console.log('Message sent: ' + info.response);
        }

      });
    });
}
