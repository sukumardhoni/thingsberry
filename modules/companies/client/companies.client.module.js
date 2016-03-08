(function (app) {
  'use strict';

  app.registerModule('companies');
  app.registerModule('companies.services');
  app.registerModule('companies.routes', ['ui.router', 'companies.services']);
})(ApplicationConfiguration);
