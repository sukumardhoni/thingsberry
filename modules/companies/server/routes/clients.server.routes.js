'use strict';

/**
 * Module dependencies
 */
var clients = require('../controllers/clients.server.controller');

module.exports = function (app) {
  // clients collection routes
  app.route('/api/clients') /*.all(companiesPolicy.isAllowed)*/
    .get(clients.list)
    .post(clients.create);

  /*

    app.route('/api/search/products/:ProCategory?/:ProCompany?/:ProName?/:ProRegions?/:pageId')
      .get(companies.searchedProductsList);


    app.route('/api/listOfProducts/:pageId')
      .get(companies.list);


    app.route('/api/premiumProducts')
      .get(companies.premiumProductsList);

    app.route('/api/updateRating/:companyId/:previousRatingValue/:userRating').put(companies.updateRating);
  */



  // Single company routes
  /* app.route('/api/clients/:clientsId') //.all(companiesPolicy.isAllowed)
     .get(clients.read)
     .put(clients.update)
     .delete(clients.delete);

   // Finish by binding the company middleware
   app.param('clientsId', clients.clientsByID);*/
};
