"use strict"
var Agenda = require("agenda"),
  emailJob = require('./jobs/email-job.js');

module.exports = function (agendaDb) {
  var agenda = new Agenda({
    db: {
      address: agendaDb.uri,
      collection: 'agendajobs'
    }
  }, function (err) {
    if (err) {
      console.log(err);
      throw err;
    }
    agenda.emit('ready');

  });
  agenda.on('ready', function () {
    emailJob.sendNewUserWelcomeEmail(agenda);
    emailJob.sendRecoveryLinkEmail(agenda);
    emailJob.sendPasswordChangedEmail(agenda);
    emailJob.sendUserInfoToThingsBerryTeam(agenda);
    emailJob.sendUserContactUSInfoToThingsBerryTeam(agenda);
    emailJob.sendUserGetListedInfoToThingsBerryAdmin(agenda);
    emailJob.sendDeactivate_ProductsAdmin(agenda);
    emailJob.sendProductsStatsAdmin(agenda);
    agenda.start();
  });

  return agenda;
};
