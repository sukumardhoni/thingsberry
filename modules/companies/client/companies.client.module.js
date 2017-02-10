(function (app) {
  'use strict';

  app.registerModule('core');
  app.registerModule('core.services');
  app.registerModule('core.routes', ['ui.router', 'core.services']);
})(ApplicationConfiguration);
