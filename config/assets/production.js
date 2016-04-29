'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/lib/font-awesome/css/font-awesome.min.css',
        'public/lib/toastr/toastr.min.css',
        'public/lib/ng-tags-input/ng-tags-input.min.css'
      ],
      js: [
        'public/lib/jquery/dist/jquery.min.js',
        //'public/lib/bootstrap/dist/js/bootstrap.min.js',
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/ngstorage/ngStorage.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-file-upload/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
        'public/lib/lodash/dist/lodash.min.js',
        'public/lib/angular-filter/dist/angular-filter.min.js',
        'public/lib/angular-base64-upload/dist/angular-base64-upload.min.js',
        'public/assets/js/freelancer.js',
        'public/lib/toastr/toastr.js',
        'public/lib/ng-tags-input/ng-tags-input.min.js'
        //'public/lib/angular-utils-ui-breadcrumbs/uiBreadcrumbs.js'
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
