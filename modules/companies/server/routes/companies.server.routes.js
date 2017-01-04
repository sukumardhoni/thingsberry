'use strict';

/**
 * Module dependencies
 */
var companiesPolicy = require('../policies/companies.server.policy'),
  companies = require('../controllers/companies.server.controller'),
  config = require('../../../../config/config'),
  cache = require('express-redis-cache')({
    client: require('redis').createClient(config.redis.uri)
  });

module.exports = function (app) {
  // Companies collection routes
  app.route('/api/companies') /*.all(companiesPolicy.isAllowed)*/
    .get(companies.list)
    .post(companies.create);


  app.route('/api/search/products/:ProCategory?/:ProCompany?/:ProName?/:ProRegions?/:pageId/:adminStatus')
    .get(cache.route({
      expire: 10
    }), companies.searchedProductsList);

  app.route('/api/companies/getProducts')
    .get(companies.getAllPrdcts);

  app.route('/api/companies/frequentProducts')
    .get(companies.frequentProducts);

  app.route('/api/listOfProducts/:adminStatus/:pageId')
    .get(cache.route(), companies.list);

  app.route('/GetErrorImages')
    .get(companies.getErrImgPrdcts);

  app.route('/stats')
    .get(companies.productsStatus);

  app.route('/isAlive').get(companies.live);

  app.route('/api/premiumProducts')
    .get(cache.route(), companies.premiumProductsList);

  app.route('/api/featuredProducts')
    .get(cache.route(), companies.featuredProductsList);

  app.route('/api/updateRating/:companyId/:previousRatingValue/:userRating').put(companies.updateRating);

  app.route('/api/deactivateProduct/:companyId/:deactive').put(companies.deactivateProduct);

  /* app.route('/api/companies/:productId')
    .get(companies.read)
      .put(companies.update)
      .delete(companies.delete);
     app.param('productId', companies.productByID);*/

  // Single company routes
  app.route('/api/companies/:companyId') /*.all(companiesPolicy.isAllowed)*/
    .get(companies.read)
    .put(companies.update)
    .delete(companies.delete);

  // Finish by binding the company middleware
  app.param('companyId', companies.companyByID);
};
