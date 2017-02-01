"use strict"
var _ = require('lodash'),
  config = require('../../config/config'),
  tvlr_emailer = require('../../schedules/tvlr-emailer.js');


var testingEnv;
if (process.env.tb_mail_env == undefined) {
  testingEnv = '';
} else {
  testingEnv = process.env.tb_mail_env;
  // console.log("EMAIL : " + JSON.stringify(testingEnv));
}

exports.sendNewUserWelcomeEmail = function (agenda) {
  agenda.define('New_User_Welcome', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/welcome-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = testingEnv + 'Welcome to ThingsBerry';
    mailData.displayName = job.attrs.data.displayName;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendUserInfoToThingsBerryTeam = function (agenda) {
  agenda.define('User_Info_To_ThingsBerry_Team', function (job, done) {
    // console.log('###user User_Info_To_ThingsBerry_Team to the app, email: ' + JSON.stringify(job.attrs.data.userData));
    var mailData = {};
    mailData.templateName = 'emailtemplates/new-user-email-to-thingsberry';
    //mailData.to = 'support@thingsberry.com';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = testingEnv + 'New User To ThingsBerry';
    mailData.userData = job.attrs.data.userData;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    //console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendUserContactUSInfoToThingsBerryTeam = function (agenda) {
  agenda.define('User_ContactUS_Info_To_ThingsBerry_Team', function (job, done) {
    //  console.log('###user User_Info_To_ThingsBerry_Team to the app, email: ' + JSON.stringify(job.attrs.data.ContactedDetails));
    var mailData = {};
    mailData.templateName = 'emailtemplates/contact-us-email-to-thingsberry';
    mailData.to = 'midhunsai@globaltechminds.com';
    mailData.subject = testingEnv + 'ContactUs Info To ThingsBerry';
    mailData.contactedDetails = job.attrs.data.ContactedDetails;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}


exports.sendDuplicateProductsDetails = function (agenda) {
  agenda.define('Duplicate_Products', function (job, done) {
    /*console.log('@@@@@@@@ TO ADMIN Updated Product Details: ' + JSON.stringify(
      process.env.tb_mail_env));*/
    var mailData = {};
    mailData.templateName = 'emailtemplates/Duplicate_Products_Details_to_admin';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = testingEnv + 'Duplicate Products Report' + '( ' + job.attrs.data.DuplicateProducts.length + ' )';
    mailData.DuplicateProducts = job.attrs.data.DuplicateProducts;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.duplicateProdRunDate = job.attrs.data.duplicateProdRunDate;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendAddedNewProductDetails = function (agenda) {
  agenda.define('Added_New_Product_Details', function (job, done) {
    /*console.log('@@@@@@@@ TO ADMIN Updated Product Details: ' + JSON.stringify(
      process.env.tb_mail_env));*/
    var mailData = {};
    mailData.templateName = 'emailtemplates/Added_New_Product_Details_to_admin';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = testingEnv + 'Added New Product Details';
    mailData.AddedNewProductDetails = job.attrs.data.AddedNewProductDetails;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendDeletedProductDetails = function (agenda) {
  agenda.define('Deleted_Product_Details', function (job, done) {
    /*console.log('@@@@@@@@ TO ADMIN Updated Product Details: ' + JSON.stringify(
      process.env.tb_mail_env));*/
    var mailData = {};
    mailData.templateName = 'emailtemplates/Deleted_Product_Details_to_admin';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = testingEnv + 'Deleted Product Details';
    mailData.DeletedProductDetails = job.attrs.data.DeletedProductDetails;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}


exports.sendUpdatedProductDetails = function (agenda) {
  agenda.define('Updated_Product_Details', function (job, done) {
    /*console.log('@@@@@@@@ TO ADMIN Updated Product Details: ' + JSON.stringify(
      process.env.tb_mail_env));*/
    var mailData = {};
    mailData.templateName = 'emailtemplates/Updated_Product_Details_to_admin';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = testingEnv + 'Updated Product Details';
    mailData.oldProductDeatils = job.attrs.data.oldProductDeatils;
    mailData.newProductDeatils = job.attrs.data.newProductDeatils;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendProductsStatsAdmin = function (agenda) {
  agenda.define('Products_Stats', function (job, done) {
    // console.log('@@@@@@@@ TO ADMIN Deactivate_Products, email: ' + JSON.stringify(job.attrs.data.ErrorImagesProductsLength));
    var mailData = {};
    mailData.templateName = 'emailtemplates/Products_Stats_mail_to_admin';
    mailData.to = 'stats@thingsberry.com';
    mailData.subject = testingEnv + 'Products Stats';
    mailData.stats = job.attrs.data.stats;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendDeactivate_ProductsAdmin = function (agenda) {
  agenda.define('Deactivate_Products', function (job, done) {
    // console.log('@@@@@@@@ TO ADMIN Deactivate_Products, email: ' + JSON.stringify(job.attrs.data.ErrorImagesProductsLength));

    var mailData = {};
    mailData.templateName = 'emailtemplates/deactive_products_mail_to_admin';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = testingEnv + 'Deactivated Products';
    mailData.ErrorImagesProducts = job.attrs.data.ErrorImagesProducts;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.ErrorImagesRunTime = job.attrs.data.ErrorImagesRunTime;
    mailData.ErrorImagesProductsLength = job.attrs.data.ErrorImagesProductsLength;
    mailData.appEnv = config.app.title;
    // console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}


exports.sendUserGetListedInfoToThingsBerryAdmin = function (agenda) {
  agenda.define('User_GetListed_Info_To_ThingsBerry_Admin', function (job, done) {
    // console.log('###user User_Info_To_ThingsBerry_Team to the app, email: ' + JSON.stringify(job.attrs.data.GetListedDetails));
    var mailData = {};
    mailData.templateName = 'emailtemplates/get-listed-email-to-thingsberry';
    mailData.to = 'midhunsai@globaltechminds.com';
    mailData.subject = testingEnv + 'Get Listed Product Info To ThingsBerry';
    mailData.getListedDetails = job.attrs.data.GetListedDetails;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    //console.log('Before sending to reciemail User_Info_To_ThingsBerry_Team mailData: ' + JSON.stringify(mailData));
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendRecoveryLinkEmail = function (agenda) {
  agenda.define('Recovery_Link_Email', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/recovery-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = testingEnv + 'ThingsBerry Password Reset';
    mailData.displayName = job.attrs.data.displayName;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.url = job.attrs.data.url;
    mailData.appEnv = config.app.title;
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendPasswordChangedEmail = function (agenda) {
  agenda.define('Password_Changed_Email', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/password-changed-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = testingEnv + 'ThingsBerry Password Successfully Changed';
    mailData.displayName = job.attrs.data.displayName;
    mailData.presentYear = job.attrs.data.presentYear;
    mailData.appEnv = config.app.title;
    tvlr_emailer.sendMail(mailData);
    done();
  })
}
