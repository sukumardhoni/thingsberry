'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/toastr/toastr.min.css',
        'public/assets/css/isteven-multi-select.css',
        'public/lib/ng-tags-input/ng-tags-input.min.css',
        'public/lib/owl.carousel/dist/assets/owl.carousel.min.css',
        'public/lib/owl.carousel/dist/assets/owl.theme.default.min.css',
        'public/lib/angular-material/angular-material.css'


      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/ngstorage/ngStorage.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/angular-filter/dist/angular-filter.min.js',
        'public/lib/angular-base64-upload/dist/angular-base64-upload.min.js',
        'public/assets/js/freelancer.js',
        'public/assets/js/isteven-multi-select.js',
        'public/lib/toastr/toastr.js',
        'public/lib/ng-tags-input/ng-tags-input.min.js',
        'public/lib/hello/dist/hello.all.js',
        'public/lib/owl.carousel/dist/owl.carousel.min.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-socialshare/dist/angular-socialshare.min.js',
        'public/lib/angular-update-meta/dist/update-meta.min.js',
        'https://www.youtube.com/iframe_api',
        'public/lib/angular-youtube-mb/dist/angular-youtube-embed.min.js',
        'public/lib/firebase/firebase.js',
        'public/lib/angularfire/dist/angularfire.js'

      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
