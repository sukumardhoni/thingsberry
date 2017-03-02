'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'modules/core/client/views/home.client.view.html'
          /*templateUrl: 'modules/core/client/views/new-home.client.view.html'*/
      })
      .state('aboutus', {
        url: '/aboutus',
        templateUrl: 'modules/core/client/views/about-us.client.view.html',
        data: {
          pageTitle: 'About ThingsBerry'
        }
      })
      .state('blog', {
        url: '/blog',
        templateUrl: 'modules/core/client/views/blog.client.view.html',
        data: {
          pageTitle: 'ThingsBerry Blog'
        }
      })
      .state('contactus', {
        url: '/contactus',
        /*  templateUrl: 'modules/core/client/views/contact-us.client.view.html',*/
        templateUrl: 'modules/core/client/views/new-tb-contact-us.client.view.html',
        data: {
          pageTitle: 'Contact ThingsBerry'
        }
      })
      .state('getListed', {
        url: '/getListed/:isPremium',
        //        templateUrl: 'modules/core/client/views/getListed.client.view.html',
        templateUrl: 'modules/core/client/views/new-tb-get-listing-page.html',
        data: {
          pageTitle: 'Get Listed ThingsBerry'
        }
      })
      .state('privacy', {
        url: '/privacy',
        //        templateUrl: 'modules/core/client/views/getListed.client.view.html',
        templateUrl: 'modules/core/client/views/privacyPolicy.view.html',
        data: {
          pageTitle: 'Privacy Policy'
        }
      })
      .state('terms', {
        url: '/terms',
        //        templateUrl: 'modules/core/client/views/getListed.client.view.html',
        templateUrl: 'modules/core/client/views/termsConditions.view.html',
        data: {
          pageTitle: 'Terms & Conditions '
        }
      })
      .state('deactiveProducts', {
        url: '/deactiveProducts',
        templateUrl: 'modules/core/client/views/deactiveProducts.view.html',
        data: {
          pageTitle: 'Deactive Products'
        }
      }).state('cleanUpInactive', {
        url: '/cleanUpInactive',
        templateUrl: 'modules/core/client/views/cleanUpInactive.view.html',
        data: {
          pageTitle: 'CleanUp Inactive Products'
        }
      })
      .state('feedback', {
        url: '/feedback',
        //        templateUrl: 'modules/core/client/views/getListed.client.view.html',
        templateUrl: 'modules/core/client/views/feedback.view.html',
        data: {
          pageTitle: 'Feedback'
        }
      })
      .state('addyourcompany', {
        url: '/addyourcompany',
        templateUrl: 'modules/core/client/views/home.client.view.html'
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: 'modules/core/client/views/404.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Not-Found'
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: 'modules/core/client/views/400.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Bad-Request'
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: 'modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true,
          pageTitle: 'Forbidden'
        }
      });
  }
]);
