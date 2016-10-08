'use strict';

/**
 * Module dependencies
 */
var videos = require('../controllers/videos.server.controller');

module.exports = function (app) {
  // clients collection routes
  app.route('/api/videos') /*.all(companiesPolicy.isAllowed)*/
    .post(videos.create)
    .get(videos.list);

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
