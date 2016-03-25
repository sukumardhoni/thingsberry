"use strict"
var _ = require('lodash'),
  config = require('../../config/config'),
  tvlr_emailer = require('../../schedules/tvlr-emailer.js');

exports.sendNewUserWelcomeEmail = function (agenda) {
  agenda.define('New_User_Welcome', function (job, done) {
    var mailData = {};
    mailData.templateName = 'emailtemplates/welcome-email';
    mailData.to = job.attrs.data.email;
    mailData.subject = 'Welcome to ThingsBerry';
    mailData.displayName = job.attrs.data.displayName;
    mailData.appEnv = config.app.title;
    tvlr_emailer.sendMail(mailData);
    done();
  })
}

exports.sendUserInfoToThingsBerryTeam = function (agenda) {
  agenda.define('User_Info_To_ThingsBerry_Team', function (job, done) {
    //console.log('###user User_Info_To_ThingsBerry_Team to the app, email: ' + JSON.stringify(job.attrs.data.userData));
    var mailData = {};
    mailData.templateName = 'emailtemplates/email-to-thingsberry';
    mailData.to = 'support@thingsberry.com';
    mailData.subject = 'New User To ThingsBerry';
    mailData.userData = job.attrs.data.userData;
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
    mailData.subject = 'ThingsBerry Password Reset';
    mailData.displayName = job.attrs.data.displayName;
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
    mailData.subject = 'ThingsBerry Password Successfully Changed';
    mailData.displayName = job.attrs.data.displayName;
    mailData.appEnv = config.app.title;
    tvlr_emailer.sendMail(mailData);
    done();
  })
}
