'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'thingsberry.com';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', 'ui.bootstrap', 'ui.utils', 'angularFileUpload', 'ngStorage', 'angularjs-dropdown-multiselect', 'angular.filter', 'naif.base64', 'ngTagsInput', 'isteven-multi-select', 'ngMaterial', '720kb.socialshare','updateMeta'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(["$rootScope", "$state", "Authentication", function ($rootScope, $state, Authentication) {

  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (toState.data && toState.data.roles && toState.data.roles.length > 0) {
      var allowed = false;
      toState.data.roles.forEach(function (role) {
        if ((role === 'guest') || (Authentication.user && Authentication.user.roles !== undefined && Authentication.user.roles.indexOf(role) !== -1)) {
          allowed = true;
          return true;
        }
      });

      if (!allowed) {
        event.preventDefault();
        if (Authentication.user !== undefined && typeof Authentication.user === 'object') {
          $state.go('forbidden');
        } else {
          $state.go('authentication.signin').then(function () {
            storePreviousState(toState, toParams);
          });
        }
      }
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
}]);

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

(function (app) {
  'use strict';

  app.registerModule('articles');
  app.registerModule('articles.services');
  app.registerModule('articles.routes', ['ui.router', 'articles.services']);
})(ApplicationConfiguration);

(function (app) {
  'use strict';

  app.registerModule('companies');
  app.registerModule('companies.services');
  app.registerModule('companies.routes', ['ui.router', 'companies.services']);
})(ApplicationConfiguration);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');
ApplicationConfiguration.registerModule('core.admin', ['core']);
ApplicationConfiguration.registerModule('core.admin.routes', ['ui.router']);

'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('users', ['core']);
ApplicationConfiguration.registerModule('users.admin', ['core.admin']);
ApplicationConfiguration.registerModule('users.admin.routes', ['core.admin.routes']);

(function () {
  'use strict';

  angular
    .module('articles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Articles',
      state: 'articles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'List Articles',
      state: 'articles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'articles', {
      title: 'Create Article',
      state: 'articles.create',
      roles: ['user']
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('articles.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('articles', {
        abstract: true,
        url: '/articles',
        template: '<ui-view/>'
      })
      .state('articles.list', {
        url: '',
        templateUrl: 'modules/articles/client/views/list-articles.client.view.html',
        controller: 'ArticlesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Articles List'
        }
      })
      .state('articles.create', {
        url: '/create',
        templateUrl: 'modules/articles/client/views/form-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: newArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Articles Create'
        }
      })
      .state('articles.edit', {
        url: '/:articleId/edit',
        templateUrl: 'modules/articles/client/views/form-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Article {{ articleResolve.title }}'
        }
      })
      .state('articles.view', {
        url: '/:articleId',
        templateUrl: 'modules/articles/client/views/view-article.client.view.html',
        controller: 'ArticlesController',
        controllerAs: 'vm',
        resolve: {
          articleResolve: getArticle
        },
        data:{
          pageTitle: 'Article {{ articleResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'ArticlesService'];

  function getArticle($stateParams, ArticlesService) {
    return ArticlesService.get({
      articleId: $stateParams.articleId
    }).$promise;
  }

  newArticle.$inject = ['ArticlesService'];

  function newArticle(ArticlesService) {
    return new ArticlesService();
  }
})();

(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesController', ArticlesController);

  ArticlesController.$inject = ['$scope', '$state', 'articleResolve', 'Authentication'];

  function ArticlesController($scope, $state, article, Authentication) {
    var vm = this;

    vm.article = article;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Article
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.article.$remove($state.go('articles.list'));
      }
    }

    // Save Article
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.article._id) {
        vm.article.$update(successCallback, errorCallback);
      } else {
        vm.article.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('articles.view', {
          articleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();

(function () {
  'use strict';

  angular
    .module('articles')
    .controller('ArticlesListController', ArticlesListController);

  ArticlesListController.$inject = ['ArticlesService'];

  function ArticlesListController(ArticlesService) {
    var vm = this;

    vm.articles = ArticlesService.query();
  }
})();

(function () {
  'use strict';

  angular
    .module('articles.services')
    .factory('ArticlesService', ArticlesService);

  ArticlesService.$inject = ['$resource'];

  function ArticlesService($resource) {
    return $resource('api/articles/:articleId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();

(function () {
  'use strict';

  angular
    .module('companies.routes')
    .config(routeConfig)
    .run(["$state", "$rootScope", function ($state, $rootScope) {
      $rootScope.$state = $state;
    }]);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('companies', {
        abstract: true,
        url: '/products',
        template: '<ui-view/>',
        data: {
          breadcrumbProxy: 'companies.list'
        }
      })
      .state('companies.list', {
        url: '/list/:cat?/:com?/:name?/:regions?/:isSearch',
        //       templateUrl: 'modules/companies/client/views/list-companies.client.view.html',
        templateUrl: 'modules/companies/client/views/new-list-companies.client.view.html',
        controller: 'CompanyListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Products List',
          displayName: 'Searched Products'
        }
      })
      .state('companies.create', {
        url: '/create',
        templateUrl: 'modules/companies/client/views/form-company.client.view.html',
        controller: 'CompanyController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: newCompany
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Create Product'
        }
      })
      .state('companies.add', {
        url: '/your_product/:companyId',
        templateUrl: 'modules/companies/client/views/add-company.client.view.html',
        /*   templateUrl:'modules/companies/client/views/new-tb-add-company.client.view.html',*/
        controller: 'CompanyController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: newCompany
        },
        data: {
          //roles: ['user', 'admin'],
          pageTitle: 'Add Product'
        }
      })


    .state('companies.view', {
      url: '/:companyId',
      /* url: '/:productId',*/
      /*templateUrl: 'modules/companies/client/views/view-company.client.view.html',*/
      /*templateUrl: 'modules/companies/client/views/new-single-product.client.view.html',*/
      templateUrl: 'modules/companies/client/views/new-tb-single-product.client.view.html',
      controller: 'CompanyController',
      controllerAs: 'vm',
      resolve: {
        companyResolve: getCompany
      },
      data: {
        pageTitle: 'Company {{ companyResolve.Proname }}'
      }
    });
  }

  getCompany.$inject = ['$stateParams', 'CompanyService'];

  function getCompany($stateParams, CompanyService) {
    return CompanyService.get({
      companyId: $stateParams.companyId
    }).$promise;
  }
  /*   .state('companies.view', {
        url: '/:companyId',
        templateUrl: 'modules/company/client/views/view-company.client.view.html',
        controller: 'CompanyController',
        controllerAs: 'vm',
        resolve: {
          companyResolve: getCompany
        },
        data: {
          pageTitle: 'Company {{ companyResolve.Proname }}'
        }
      });
  }

  getCompany.$inject = ['$stateParams', 'CompanyService'];

  function getCompany($stateParams, CompanyService) {
    return CompanyService.get({
      companyId: $stateParams.companyId
    }).$promise;
  }*/

  newCompany.$inject = ['CompanyService'];

  function newCompany(CompanyService) {
    return new CompanyService();
  }
})();

(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyController', CompanyController)


  /*.controller('LoginSignUpModalCtrl', function ($scope, $uibModalInstance) {
    $scope.LogIn = function () {
      $scope.LogInSignUpCondition = true;
      $uibModalInstance.close($scope.LogInSignUpCondition);
    };
    $scope.SignUp = function () {
      $scope.LogInSignUpCondition = false;
      $uibModalInstance.close($scope.LogInSignUpCondition);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  })*/


  .controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', 'productFromModal', function ($scope, $uibModalInstance, productFromModal) {
    $scope.product = productFromModal;
    $scope.ok = function (product) {
      $uibModalInstance.close(product);
    };
    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);




  CompanyController.$inject = ['$scope', '$state', 'companyResolve', 'Authentication', '$localStorage', 'ratingService', 'NotificationFactory', '$timeout', 'dataShare', 'CompanyServiceUpdate', '$uibModal', '$log', '$q', 'CategoryService', '$location', '$stateParams'];

  function CompanyController($scope, $state, company, Authentication, $localStorage, ratingService, NotificationFactory, $timeout, dataShare, CompanyServiceUpdate, $uibModal, $log, $q, CategoryService, $location, $stateParams) {
    var vm = this;

    vm.company = company;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    //vm.remove = remove;
    //vm.save = save;
    vm.addCompanyDetails = addCompanyDetails;
    $scope.path = $location.absUrl();

    $scope.addBtnText = 'SUBMIT';
    // console.log("USER :" + JSON.stringify($localStorage.user));
    // console.log(vm.company);
    /*$scope.user = $localStorage.user;*/
    if ($localStorage.user) {
      if ($localStorage.user.roles.indexOf('admin') !== -1) {
        // console.log("coming to true");
        $scope.editIcon = true;
      } else {
        // console.log("coming to true");
        $scope.editIcon = false;
      }
    }
    /* $scope.editProductFunc = function (productDetails) {
       // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));

       dataShare.setData(productDetails);
       $state.go('companies.add');
     }*/

    /*   $scope.userValidation = function () {
         if (vm.authentication.user) {} else {
           var modalInstance = $uibModal.open({
             templateUrl: 'modules/companies/client/views/modals/userNotLoggedIn-modal.html',
             backdrop: "static",
             $scope: $scope,
             controller: 'LoginSignUpModalCtrl'
           });
           modalInstance.result.then(function (LogInSignUpCondition) {
             console.log('$scope.LogInSignUpCondition value : ' + LogInSignUpCondition);
             if (LogInSignUpCondition) $state.go('authentication.signin');
             else $state.go('authentication.signup');
           }, function () {});
         }
       }*/

    // console.log("product id there:" + $stateParams.companyId);


    if ($stateParams.companyId) {
      //  console.log("coming to correct list");
      //  console.log("coming to correct list@@@@:" + $stateParams.companyId);
      $scope.productIdIs = $stateParams.companyId;
      //  console.log("coming to correct list@@@@:" + $scope.productIdIs);
      CompanyServiceUpdate.getProduct.query({
        companyId: $scope.productIdIs
      }, vm.company, successgetProductCallback, errorgetProductCallback);

      function successgetProductCallback(res) {
        vm.company = res;
        // console.log("succes callback from get productdetails:" + JSON.stringify(res));
      }

      function errorgetProductCallback(res) {
        vm.error = res.data.message;
        console.log("error callback from get productdetails");
        NotificationFactory.error('Failed to get Product details...', res.data.message);
      }

    }

    /* $scope.loadCategories = function ($query) {
         var catsList = CategoryService.query(),
           defObj = $q.defer();
         return catsList.$promise.then(function (result) {
           defObj.resolve(result);
           return result.filter(function (catList) {
             return catList.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
           });
         });
         return defObj.promise;

       };*/


    $scope.dynamicPopover = {
      templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
    };


    $scope.loadCategories = function ($query) {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      return catsList.$promise.then(function (result) {
        defObj.resolve(result);
        return result.filter(function (catList) {
          return catList.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
      });
      return defObj.promise;
    };

    /*    $scope.BackgroundImage = "https://www.sleekcover.com/covers/citizen-watch-facebook-cover.jpg";
        $scope.headerImgMainTitle = "Withings Activite Activity tracker";
        $scope.headerImgSubTitle = "ID 123456";
        $scope.prodImages = ['https://www.sleekcover.com/covers/independent-girl-facebook-cover.jpg', 'http://d2rfsfyh2505gh.cloudfront.net/wp-content/uploads/2015/07/Prabhas.jpg', 'http://www.latesthdwallpapers.in/photos/Allu-Arjun-facebook-best-hd-photos-free-for-mobile.jpg'];
        $scope.sampleDesc = "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing anyone,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.Only then, with the reader’s attention hooked,  ";*/

    $scope.date = new Date();
    //$scope.sName = "$state.current.name==='companies.view'"
    // console.log("sName:" + $state.current.name);



    $scope.changeLimit = function (pro) {
      if ($scope.limit == pro.description.length)
        $scope.limit = 100;
      else
        $scope.limit = pro.description.length;
    };

    /*$scope.dynamicPopover = {
      templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
    };*/
    /*$scope.hoveringOver = function (value) {
      //  console.log('hoveringOver is called');
      $scope.overStar = value;
      $scope.percent = 100 * (value / $scope.max);
    };*/


    $scope.removeProduct = function () {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
        controller: 'ModalInstanceCtrl',
        backdrop: 'static',
        resolve: {
          productFromModal: function () {
            return vm.company;
          }
        }
      });

      modalInstance.result.then(function (product) {
        if (product) {
          //console.log('remove func. on if condition : ');
          CompanyServiceUpdate.DeleteProduct.remove({
            companyId: product.productId
          }, function (res) {
            //console.log('Res details on remove success cb : ' + JSON.stringify(res));
            $state.go('companies.list', {
              isSearch: false
            });
            NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
          }, function (err) {
            //console.log('Err details on remove Error cb : ' + JSON.stringify(err));
            NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
          })
        } else {
          //console.log('remove func. on else condition : ');
        }
      }, function () {
        //$log.info('Modal Task Delete dismissed at: ' + new Date());
      });
    };


    function genBusinessArray(businessArray) {
      var businessSecArr = [];
      for (var i = 0; i < businessArray.length; i++) {
        businessSecArr.push(businessArray[i].id);
      }
      if (businessArray.length === businessSecArr.length) {
        return businessSecArr;
      }
    }


    // addCompanyDetails company
    function addCompanyDetails(isValid) {


      //console.log('vm.company.categories value is : ' + vm.company.ProCat);
      //console.log('vm.company.categories value is : ' + JSON.stringify(vm.company.ProCat));

      $scope.addBtnText = 'Submiting...';

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company.productId) {
        //  console.log('Update product is called : ' + JSON.stringify(vm.company));
        //   console.log('Update product is called : ' + JSON.stringify(vm.company.productId));
        //vm.company.$update(successUpdateCallback, errorUpdateCallback);
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);

        if (vm.company.productImageURL) {

        } else {
          vm.company.logo = {
            filetype: $scope.productImg.filetype,
            base64: $scope.productImg.base64
          };
        }
        // console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));
        vm.company.operationalRegions = $scope.operationalRegionsList;

        // console.log('adproduct1');
        CompanyServiceUpdate.UpdateProduct.update({
          companyId: vm.company.productId
        }, vm.company, successUpdateCallback, errorUpdateCallback);



      } else {

        // vm.company.ProCat = $scope.selectedCategory;
        vm.company.businessSector = genBusinessArray($scope.businessSectorSelectedArray);
        vm.company.serviceOffered = genBusinessArray($scope.serviceOfferedSelectedArray);

        /*var replacedTitle = doc.Proname.replace(/\s/g, "-");
        productId: replacedTitle*/
        var productName = vm.company.Proname.replace(/\s/g, "-");
        // console.log("company productId :" + productName);

        vm.company.productId = productName;

        if (vm.company.productImageURL) {

        } else {
          vm.company.logo = {
            filetype: $scope.productImg.filetype,
            base64: $scope.productImg.base64
          };
        }

        //  console.log('Created product is called : ' + JSON.stringify(vm.company));
        // console.log('Operational regions list is : ' + JSON.stringify($scope.operationalRegionsList));

        //if ($scope.selectionOperational)
        vm.company.operationalRegions = $scope.operationalRegionsList;

        vm.company.$save(successCallback, errorCallback);


      }

      function successUpdateCallback(res) {
        $state.go('companies.list', {
          isSearch: false
        });
        NotificationFactory.success('Successfully Updated Product details...', 'Product Name : ' + res.Proname);
      }

      function errorUpdateCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to Update Product details...', res.data.message);
      }

      function successCallback(res) {
        $state.go('companies.list', {
          isSearch: false
        });
        NotificationFactory.success('Successfully Saved Product details...', 'Product Name : ' + res.Proname);
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }


    /*
        $scope.$on('data_shared', function () {
          var proDetails = dataShare.getData();
          //  console.log("datashare localstorage");
          //  $localStorage.editProductDetails = proDetails;
          console.log(JSON.stringify(proDetails.detailsState));


          if (proDetails.data.logo)
            $scope.previewImg(proDetails.data.logo);
          $scope.productImg = proDetails.data.logo;

          $scope.operationalRegionsList = (proDetails.data.operationalRegions.length != 0) ? proDetails.operationalRegions : $scope.data.operationalRegionsList;

          vm.company = proDetails.data;
          console.log('datashare last: ' + JSON.stringify(vm.company));
        });*/





    $scope.businessSectorSelectedArray = [];

    $scope.businessSectorList = [{
      id: 1,
      label: "Agriculture & Fisheries applications"
    }, {
      id: 2,
      label: "Automotive"
    }, {
      id: 3,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 4,
      label: "Agriculture"
    }, {
      id: 5,
      label: "Automotive Products"
    }, {
      id: 6,
      label: "Asset & Cargo Tracking"
    }, {
      id: 7,
      label: "Fisheries applications"
    }, {
      id: 8,
      label: "Fleet Management"
    }, {
      id: 9,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 10,
      label: "Agriculture applications"
    }, {
      id: 11,
      label: "Automotive Products"
    }, {
      id: 12,
      label: "Personal Tracking"
    }];

    $scope.businessSectorSettings = {
      displayProp: 'label',
      idProp: 'label',
      showCheckAll: false,
      showUncheckAll: false,
      dynamicTitle: false,
      buttonClasses: 'business_sector_select',
    };
    $scope.businessSectorTexts = {
      buttonDefaultText: 'Business Sector'
    };




    $scope.removebusinessSectorSelectedVal = function (indexVal) {
      $scope.businessSectorSelectedArray.splice(indexVal, 1);
      //console.log('Business sector vals : ' + JSON.stringify($scope.businessSectorSelectedArray));
    };



    $scope.serviceOfferedSelectedArray = [];

    $scope.serviceOfferedList = [{
      id: 1,
      label: "Agriculture & Fisheries applications"
    }, {
      id: 2,
      label: "Automotive"
    }, {
      id: 3,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 4,
      label: "Agriculture"
    }, {
      id: 5,
      label: "Automotive Products"
    }, {
      id: 6,
      label: "Asset & Cargo Tracking"
    }, {
      id: 7,
      label: "Fisheries applications"
    }, {
      id: 8,
      label: "Fleet Management"
    }, {
      id: 9,
      label: "Asset & Cargo Tracking; Fleet Management; Personal Tracking"
    }, {
      id: 10,
      label: "Agriculture applications"
    }, {
      id: 11,
      label: "Automotive Products"
    }, {
      id: 12,
      label: "Personal Tracking"
    }];

    $scope.serviceOfferedSettings = {
      displayProp: 'label',
      idProp: 'label',
      showCheckAll: false,
      showUncheckAll: false,
      dynamicTitle: false,
      buttonClasses: 'business_sector_select',
    };
    $scope.serviceOfferedTexts = {
      buttonDefaultText: 'Service Offered'
    };


    $scope.removeserviceOfferedSelectedVal = function (indexVal) {
      $scope.serviceOfferedSelectedArray.splice(indexVal, 1);
      //console.log('serviceOfferedSelectedArray sector vals : ' + JSON.stringify($scope.serviceOfferedSelectedArray));
    };


    $scope.operationalRegionsList = [{
      name: "Africa",
      checked: false
    }, {
      name: "Asia-Pacific",
      checked: false
    }, {
      name: "Europe",
      checked: false
    }, {
      name: "Latin America",
      checked: false
    }, {
      name: "Middle East",
      checked: false
    }, {
      name: "North America",
      checked: false
    }, {
      name: "All Regions",
      checked: false
    }];


    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES', 'ENTERTAINMENT', 'ACCESORIES',
'TOYS', 'SPORT', 'ELECTRONICS', 'OFFICE PRODUCTS', 'BABY PRODUCTS', 'MOTORS'];
    $scope.SelectedCat = function (val) {
      //console.log('SelectedCat cal is : ' + val);
    };


    $scope.previewImg = function (val) {

      if (val)
        $scope.imgUrl = 'data:' + val.filetype + ';base64,' + val.base64;
      //console.log('Base 64 img details filetype is : ' + val.filetype);
    };


  }
})();

(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompanyListController', CompanyListController);

  CompanyListController.$inject = ['CompanyService', '$scope', 'Authentication', '$localStorage', '$stateParams', 'SearchProducts', 'ListOfProducts', '$location', 'dataShare', '$state', 'CategoryService'];

  function CompanyListController(CompanyService, $scope, Authentication, $localStorage, $stateParams, SearchProducts, ListOfProducts, $location, dataShare, $state, CategoryService) {
    var vm = this;
    var pageId = 0;
    $scope.path = $location.absUrl();

    $scope.editProductFunc = function (productDetails) {
      /*console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));*/
      console.log('Edit Product details on Direc. : ');
      console.log($state.current.name);
      dataShare.setData(productDetails, $state.current.name);
      $state.go('companies.add');
    }

    $scope.getCategoriesForSide = function () {
      console.log('get categories function');
      CategoryService.query({}, function (res) {
        console.log('succesfully getting response');
        $scope.categoryList = res;
        console.log(JSON.stringify($scope.categoryList))
      }, function (err) {
        console.log('failed to fetch the products' + err);
      })
    }


    $scope.groups = [
      {
        title: 'Home',
        count: 21,
        content: ['under-maintenece']

    },
      {
        title: 'Healthcare',
        count: 45,
        content: ['Healthcare', 'Healthcare..']
    },
      {
        title: 'Accesories',
        count: 21,
        content: ['Accesories']

    },
      {
        title: 'Electronics',
        count: 21,
        content: ['Electronics']

    },
      {
        title: 'Wearables',
        count: 21,
        content: ['Wearables', 'Wearables1']

    },
      {
        title: 'Baby-Products',
        count: 21,
        content: ['Baby-Products']

    },
      {
        title: 'sports',
        count: 21,
        content: ['sports1', 'sports2', 'sports..']

    },
      {
        title: 'Automobile',
        count: 21,
        content: ['Automobile', 'Automobile1', 'Automobile2']

    },
      {
        title: 'Entertainment',
        count: 21,
        content: ['Entertainment']

    },
      {
        title: 'Patio,Lawn-&-Garden',
        count: 21,
        content: ['Patio,Lawn-&-Garden', 'Patio,Lawn-&-Garden1']

    },
      {
        title: 'Kids',
        count: 21,
        content: ['Kids']

    },
      {
        title: 'Motors',
        count: 21,
        content: ['Motors1']

    },
      {
        title: 'Others',
        count: 21,
        content: ['Others', 'Others..']

    }
  ];

    //vm.companys = ['123', '456', '789', '012', '345', '678', '901'];
    /*CompanyService.query(function (res) {
  //console.log(' Clicnt side lint of products : ' + JSON.stringify(res));
  vm.companys = res;
});*/
    // article.isCurrentUserOwner = req.user && article.user && article.user._id.toString() === req.user._id.toString() ? true : false;

    /* if($localStorage.user.roles.indexOf('admin')!==-1){
       console.log("admin is there");
     }else{
       console.log("admin not there");
     }*/
    $scope.userDetails = $localStorage.user;
    // console.log("USER :"+ JSON.stringify(Authentication));
    // console.log("USER :"+ JSON.stringify($localStorage.user));
    $scope.getSearchedProductsList = function () {


      //  console.log("Entering into getsearchproductslists");

      // var pageId = 0;

      if ($stateParams.cat == 'Home') {
        //console.log('HOME')
        $scope.productsDisplayText = 'Home Products'
      } else if ($stateParams.cat == 'Automobile') {
        //console.log('AUTOMOBILE')
        $scope.productsDisplayText = 'Automobile Products'
      } else if ($stateParams.cat == 'Healthcare') {
        //console.log('HEALTH')
        $scope.productsDisplayText = 'Health Care Products'
      } else if ($stateParams.cat == 'Utilities') {
        //console.log('UTILITIES')
        $scope.productsDisplayText = 'Utilities Products'
      } else if ($stateParams.cat && $stateParams.isSearch) {
        //console.log('$stateParams.cat && $stateParams.isSearch')
        $scope.productsDisplayText = 'Search Results';
      } else {
        //console.log('ELSE')
        $scope.productsDisplayText = 'All Products';
      }
      $scope.totalItems = $scope.getSearchedProductsList.length;
      $scope.currentPage = 1;
      $scope.itemsPerPage = 12;
      $scope.maxSize = 2;

      $scope.gridView = true;
      $scope.grdView = function () {
        $scope.gridView = true;
        //  console.log("coming to div1 funct");
      }

      $scope.listView = function () {
        $scope.gridView = false;
      }
      $scope.date = new Date();

      //console.log('$stateParams.isSearch is : ' + $stateParams.isSearch);

      $scope.spinnerLoading = true;
      $scope.searchOrder = {};
      $scope.searchOrder.Lists = [

        {
          'name': 'Sort by Ratings',
          'value': 'created'
        },
        {
          'name': 'Sort by Newest',
          'value': '-created'
        }
  ];
      $scope.searchOrder.List = $scope.searchOrder.Lists[1].value;

      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          pageId: pageId
        }, function (res) {
          // console.log('response is : ' + JSON.stringify(res));
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;

          pageId++;

        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {

        $scope.CatName = $stateParams.cat;

        //console.log('$stateParams.cat is :' + $stateParams.cat);
        //console.log('$stateParams.cat is :' + $stateParams.cat.length);

        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          ProRegions: $stateParams.regions,
          pageId: pageId
        }, function (res) {
          vm.companys = res.products;
          vm.count = res.count;
          $scope.spinnerLoading = false;
          pageId++;
        }, function (err) {
          console.log('Failed to fetch the product detailsss : ' + JSON.stringify(err));
        });
      }
    };



    $scope.LoadMoreProducts = function () {
      //console.log('LoadMoreProducts function is called');
      var onScroll = {};
      $scope.spinnerLoading = true;
      if ($stateParams.isSearch == 'false') {
        ListOfProducts.query({
          pageId: pageId
        }, function (res) {
          //vm.companys = res;
          $scope.spinnerLoading = false;
          pageId++;
          onScroll = res.products;
          if (res.length == 0) {
            $scope.noMoreProductsAvailable = true;
          }
          var oldProducts = vm.companys;
          vm.companys = oldProducts.concat(onScroll);

        }, function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
      } else {
        SearchProducts.query({
          ProCategory: $stateParams.cat,
          ProCompany: $stateParams.com,
          ProName: $stateParams.name,
          pageId: pageId
        }, function (res) {
          //vm.companys = res;
          $scope.spinnerLoading = false;
          pageId++;
          onScroll = res.products;
          if (res.length == 0) {
            $scope.noMoreProductsAvailable = true;
          }
          var oldProducts = vm.companys;
          vm.companys = oldProducts.concat(onScroll);
        }, function (err) {
          console.log('Failed to fetch the product details : ' + JSON.stringify(err));
        });
      }


    };



  }
})();

'use strict';


angular.module('companies')
  .directive('premiumProductDisplay', ["dataShare", "$state", "$localStorage", function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/premium-product-display.client.view.html',
      link: function (scope, elem, attrs) {
        scope.user = $localStorage.user;
        scope.proImgUrl = function () {
          if (scope.details.image) {
            return scope.details.image
          } else if (scope.details.logo != undefined) {
            //console.log('Detaisl of product getting eroor : ' + JSON.stringify(scope.details));
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
          }
        };
        //console.log('Product details are : ' + JSON.stringify(scope.details));


        /*scope.ProductDetails = function () {
          console.log('ProductDetails is triggred');
        }*/


      }
    };
  }]);

'use strict';

angular.module('companies').directive('tbHeaderCarousel', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      images: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-header-carousel.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to header carousel");
      console.log(scope.images);
    }
  }
}]).directive('repeatCarousel', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      // wait for the last item in the ng-repeat then call init
      if (scope.$last) {
        $(element.parent()).owlCarousel({
          autoplay: true,
          autoplayTimeout: 1000,
          loop: true,
          slideSpeed: 300,
          paginationSpeed: 400,
          items: 1,
          margin: 20,

        })
      }
    }
  };
});

'use strict';

angular.module('companies').directive('tbHeaderImage', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'modules/companies/client/views/directive-partials/new-header-image.client.view.html ',
    link: function (scope, elem, attr) {
      //  console.log("coming to directive");
      scope.backImage = attr.image;
      //  console.log(scope.backImage);
      var ImageOpcty = attr.opacity;
      scope.ImgMainTtl = attr.maintitle;
      scope.ImgSubTtl = attr.subtitle;
      /*scope.state = attr.state;
      console.log(scope.state);*/
      elem.addClass('mobileImage');
      elem.css({
        background: 'url(' + scope.backImage + ')',
        /*width: '100%',*/
        height: '250px',
        opacity: ImageOpcty,
        position: 'relative',
        backgroundPosition: '0px',
        backgroundSize: 'cover',
        backgroundColor: '#929292'
      });

      if (attr.state == 'contactUs' || attr.state == 'getListed') {
        // console.log('coming from contactUs');
        scope.contactStyles = {
          top: '135px',
          left: '25px'
        }
      }
    }
  }
});

 'use strict';

 angular.module('companies').directive('myTabs', function () {
     return {
       restrict: 'E',
       transclude: true,
       scope: {},
       controller: ["$scope", function ($scope) {
         var panes = $scope.panes = [];

         $scope.select = function (pane) {
           angular.forEach(panes, function (pane) {
             pane.selected = false;
           });
           pane.selected = true;
         };

         this.addPane = function (pane) {
           if (panes.length === 0) {
             $scope.select(pane);
           }
           panes.push(pane);
         };
       }],
       templateUrl: 'modules/companies/client/views/directive-partials/new-tabs.client.view.html'
     };
   })
   .directive('myPane', function () {
     return {
       require: '^^myTabs',
       restrict: 'E',
       transclude: true,
       scope: {
         title: '@'
       },
       link: function (scope, element, attrs, tabsCtrl) {
         tabsCtrl.addPane(scope);
       },
       templateUrl: 'modules/companies/client/views/directive-partials/new-panes.client.view.html'
     };
   });

'use strict';

angular.module('companies').directive('tbProductsGrid', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", "deactiveService", "$window", "$uibModal", "CompanyServiceUpdate", function (dataShare, $state, $localStorage, ratingService, NotificationFactory, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-grid.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      // console.log("coming to tb productsList");
      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          scope.editProduct = true;
        } else {
          scope.editProduct = false;
        }
      }
      scope.date1 = attr.dateOnProduct;

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };
      scope.deleteProduct = function () {
        var modalInstance = $uibModal.open({
          animation: scope.animationsEnabled,
          templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
          controller: 'ModalInstanceCtrl',
          backdrop: 'static',
          resolve: {
            productFromModal: function () {
              return scope.details;
            }
          }
        });

        modalInstance.result.then(function (product) {
          // console.log("REMOVING PRODUCTS");
          if (product) {
            //   console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              //    console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $window.location.reload();
              /*$state.go('companies.list', {
                isSearch: false
              });*/
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            //   console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        //   console.log("DEACTIVE PRDCT IS CALLED");
        deactiveService.update({
          companyId: scope.details.productId,
          deactive: 'deactive'
        }, scope.details, successUpdateCallback, errorUpdateCallback);

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list') {
            $window.location.reload();
          } else {
            $state.go('companies.list', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };


    }
  }
}]).directive('tbProductsList', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", "deactiveService", "$window", "$uibModal", "CompanyServiceUpdate", function (dataShare, $state, $localStorage, ratingService, NotificationFactory, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {
    restrict: 'E',
    scope: {
      details: '=',
      editIcon: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/product-list.dispaly.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to tb productsList");
      scope.date1 = attr.dateOnProduct;
      if (scope.editIcon) {
        if (scope.editIcon.roles.indexOf('admin') !== -1) {
          // console.log('directive admin is there');
          scope.editProduct = true;

        } else {
          // console.log('directive admin not there');
          scope.editProduct = false;
        }
      }

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };


      scope.deleteProduct = function () {
        var modalInstance = $uibModal.open({
          animation: scope.animationsEnabled,
          templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
          controller: 'ModalInstanceCtrl',
          backdrop: 'static',
          resolve: {
            productFromModal: function () {
              return scope.details;
            }
          }
        });

        modalInstance.result.then(function (product) {
          console.log("REMOVING PRODUCTS");
          if (product) {
            // console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              //  console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $window.location.reload();
              /*$state.go('companies.list', {
                isSearch: false
              });*/
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            // console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        // console.log("DEACTIVE PRDCT IS CALLED");
        deactiveService.update({
          companyId: scope.details.productId,
          deactive: 'deactive'
        }, scope.details, successUpdateCallback, errorUpdateCallback);

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list') {
            $window.location.reload();
          } else {
            $state.go('companies.list', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };



      /* scope.editProductFunc = function (productDetails) {
         // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));
         dataShare.setData(productDetails);
         $state.go('companies.add');
       }*/

      /* var proDetails = '';
       scope.$on('data_shared', function () {
         var proDetails = dataShare.getData();
         console.log("datashare localstorage");
         $localStorage.editProductDetails = proDetails;
         console.log(JSON.stringify($localStorage.editProductDetails));

         if (proDetails.logo)
           scope.previewImg(proDetails.logo);
         scope.productImg = proDetails.logo;

         scope.operationalRegionsList = (proDetails.operationalRegions.length != 0) ? proDetails.operationalRegions : scope.operationalRegionsList;

         vm.company = proDetails;
       });
       if (proDetails) {
         vm.company = proDetails;
       } else {
         vm.company = $localStorage.editProductDetails;
       }*/

      //  console.log("date in directive" + scope.date1);
      // console.log(scope.details);
      /* scope.productImageUrl = attr.productImage;
       scope.productName = attr.productName;
       scope.productUrl = attr.productUrl;
       scope.productDescription = attr.productDesc;*/
      // console.log(scope.productName);

    }
  }
}]);

'use strict';

angular.module('companies').directive('tbRatingsContainer', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      products: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-ratins-popover.display.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {
      //  console.log("coming to ratings container");
      //  console.log("before if cond:" + attr.state);

      if (attr.state == 'featurePrdct') {
        scope.featured = true;
      }
      if (attr.state == 'singlePrdct') {
        scope.singlePrdct = true
      }



      var previousRatingValue;
      var localStorageRatingKey;

      scope.user = $localStorage.user;
      /* console.log("---->:" + JSON.stringify(scope.user));*/

      // console.log(scope.products);

      var productname = scope.products.Proname;
      /* console.log(productname);*/
      var productNameLowerCase = productname.replace(/[^a-zA-Z]/g, "").toLowerCase();
      // console.log(productNameLowerCase);
      if (scope.user == undefined) {
        localStorageRatingKey = "guest" + productNameLowerCase;
        //  console.log("userId:" + localStorageRatingKey);
      } else {
        localStorageRatingKey = scope.user._id + productNameLowerCase;
        // console.log("userId:" + localStorageRatingKey);
      }

      scope.rating = function (rate) {


        scope.ratevalue = rate;
        //  console.log("ratevalue:" + scope.ratevalue);



        if ($localStorage[localStorageRatingKey] == undefined) {

          previousRatingValue = 0;
          $localStorage[localStorageRatingKey] = scope.ratevalue;

        } else {

          previousRatingValue = $localStorage[localStorageRatingKey];
          $localStorage[localStorageRatingKey] = scope.ratevalue;

        }
        //  console.log(previousRatingValue);
        //   console.log($localStorage[localStorageRatingKey]);

        ratingService.update({
          companyId: scope.products.productId,
          userRating: scope.ratevalue,
          previousRatingValue: previousRatingValue
        }, scope.products, successCallback, errorCallback);


        function successCallback(res) {
          //  console.log("coming from callback");
          scope.rate = res.avgRatings;
          scope.reviewsCount = res.totalRatingsCount;
          //   console.log(scope.rate);
          //   console.log(scope.reviewsCount);
        }


        function errorCallback(res) {
          //   console.log("coming from callback");
          NotificationFactory.error('Failed to update the product rating...', res.data.message);
        }

      };


      scope.rate1 = $localStorage[localStorageRatingKey];
      scope.isReadonly1 = false;
      scope.rate = scope.products.avgRatings;
      scope.reviewsCount = scope.products.totalRatingsCount;

      scope.max = 5;
      scope.isReadonly = true;

      /*scope.rate = 4;
           scope.isReadonly = true;*/
      scope.hoveringOver = function (value) {
        scope.overStar = value;
        scope.percent = 100 * (value / scope.max);
      };


    }
  }
}]);

'use strict';

angular.module('companies').directive('tbAccordions', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      categories: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-accordions.display.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to share directive link function");
      console.log("coming to share directive link function" + JSON.stringify(scope.categories));

    }
  }
}]);

'use strict';

angular.module('companies').directive('tbHeaderCarouselOptions', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      images: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-carosel-options.client.view.html',
    link: function (scope, elem, attr) {
      console.log("coming to carousel options ");
      console.log(" carousel Options images" + scope.images);
      var options = attr.options;
      console.log(options);
      if (options.indexOf("z") !== -1) {
        scope.showMeZ = true;
      }
      if (options.indexOf("f") !== -1) {
        scope.showMeF = true;
      }
      if (options.indexOf("s") !== -1) {
        scope.showMeS = true;
      }

    }
  }
}]).directive('fullScreen', function () {
  return {
    restrict: 'E',
    replace: true,
    template: ' <span><span class="glyphicon glyphicon-fullscreen"></span>&nbsp;VIEW FULL SCREEN</span>',
    link: function (scope, elem, attr) {
      console.log("coming to view full screen directive");

    }
  }
}).directive('share', function () {
  return {
    restrict: 'E',
    replace: true,
    template: '<span><i class="fa fa-share-alt" aria-hidden="true"></i>&nbsp;SHARE</span>',
    link: function (scope, elem, attr) {
      console.log("coming to Share directive");
    }
  }
});

'use strict';

angular.module('companies').directive('tbFullDesc', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      text: '='
    },
    template: '<div ><h4>Description</h4><p>{{text}}</p></div>',
    link: function (scope, elem, attr) {
      elem.css({
        border: '.5px solid lightgray',
        boxShadow: ' 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        margin: '10px',
        padding: '20px'

      });
    }
  }
});

'use strict';

angular.module('companies').directive('tbLinkButton', ["$location", function ($location) {
  return {
    restrict: 'E',
    replace: true,
    template: '<button class="btn btn-primary">LINK SITE&nbsp;&nbsp;<i class="fa fa-link" aria-hidden="true" style="transform: rotate(-45deg);"></i></button>',
    link: function (scope, elem, attr) {
      console.log("coming to link button");
      var newLink = attr.prodLink;
      var newColor = attr.btnColor;
      console.log(newColor);
      elem.css({
        backgroundColor: newColor,
        borderRadius: '0px',
        borderBottomColor: 'none',
        backgroundImage: 'none',
        marginTop: '10px'

      });
      elem.bind('click', function () {
        window.location.href = newLink;
      });
    }
  }
}]);

'use strict';

angular.module('companies').directive('tbShare', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    scope: {
      products: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-share.display.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {

      // console.log("coming to share directive link function");

      /*    if (attr.state == 'featured') {
            scope.shareStyles = {
              right: '-65px'
            }
          }
          if (attr.state == 'listview') {
            scope.shareStyles = {
              right: '-55px'
            }
          }
          if (attr.state == 'singlePrdct') {
            scope.shareStyles = {
              right: '-60px'
            }
          } */
      if (attr.state == 'featured') {
        scope.featured = true;
      }
      if (attr.state == 'listview') {
        scope.listview = true
      }
      if (attr.state == 'singlePrdct') {
        scope.singlePrdct = true;
      }



      // console.log(scope.products);





    }
  }
}]);

'use strict';

angular.module('companies').directive('tbSingleProduct', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", "Authentication", "deactiveService", "$window", "$uibModal", "CompanyServiceUpdate", function (dataShare, $state, $localStorage, ratingService, NotificationFactory, Authentication, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
  return {
    restrict: 'E',
    scope: {
      details: '='
    },
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-single-prdct.display.client.view.html',
    link: function (scope, elem, attr) {
      //  console.log("coming to tb single product");
      //  console.log("coming to tb single product:" + JSON.stringify(scope.details));
      // console.log(scope.editIcon.roles);
      scope.adminUser = Authentication.user;
      //   console.log(scope.adminUser.roles);

      if (scope.adminUser) {
        if (scope.adminUser.roles.indexOf('admin') !== -1) {
          // console.log('directive admin is there');
          scope.editProduct = true;

        } else {
          // console.log('directive admin not there');
          scope.editProduct = false;
        }
      }
      scope.date1 = attr.dateOnProduct;

      scope.dynamicPopover = {
        templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
      };

      scope.deleteProduct = function () {
        var modalInstance = $uibModal.open({
          animation: scope.animationsEnabled,
          templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
          controller: 'ModalInstanceCtrl',
          backdrop: 'static',
          resolve: {
            productFromModal: function () {
              return scope.details;
            }
          }
        });

        modalInstance.result.then(function (product) {
          //  console.log("REMOVING PRODUCTS");
          if (product) {
            // console.log('remove func. on if condition : ');
            CompanyServiceUpdate.DeleteProduct.remove({
              companyId: product.productId
            }, function (res) {
              console.log('Res details on remove success cb : ' + JSON.stringify(res));
              $state.go('companies.list', {
                isSearch: false
              });
              NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
            }, function (err) {
              console.log('Err details on remove Error cb : ' + JSON.stringify(err));
              NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
            })
          } else {
            console.log('remove func. on else condition : ');
          }
        }, function () {
          //$log.info('Modal Task Delete dismissed at: ' + new Date());
        });

      }


      scope.deactivateProduct = function () {
        //  console.log("DEACTIVE PRDCT IS CALLED");
        deactiveService.update({
          companyId: scope.details.productId,
          deactive: 'deactive'
        }, scope.details, successUpdateCallback, errorUpdateCallback);

        function successUpdateCallback(res) {
          if ($state.current.name == 'companies.list') {
            $window.location.reload();
          } else {
            $state.go('companies.list', {
              isSearch: false
            });
          }
          NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
        }

        function errorUpdateCallback(res) {
          vm.error = res.data.message;
          NotificationFactory.error('Failed to Update Product details...', res.data.message);
        }

      };
    }
  }
}])

'use strict';

angular.module('companies').directive('tbSmallSnippet', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'modules/companies/client/views/directive-partials/new-tb-small-snippet.client.view.html',
    transclude: true,
    link: function (scope, elem, attr) {
    //  console.log("coming to small snippet");
      scope.smallDescription = attr.desc;

    }
  }
}]);

'use strict';


angular.module('companies')
  .directive('productDisplay', ["dataShare", "$state", "$localStorage", "ratingService", "NotificationFactory", function (dataShare, $state, $localStorage, ratingService, NotificationFactory) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/companies/client/views/directive-partials/product-display.client.view.html',
      link: function (scope, elem, attrs) {

        var previousRatingValue;
        var localStorageRatingKey;

        scope.user = $localStorage.user;
        console.log("---->:" + JSON.stringify(scope.user));

        var productname = scope.details.Proname;
        var productNameLowerCase = productname.replace(/[^a-zA-Z]/g, "").toLowerCase();


        if (scope.user == undefined) {

          localStorageRatingKey = "guest" + productNameLowerCase;
          //console.log("userId:" + localStorageRatingKey);

        } else {

          localStorageRatingKey = scope.user._id + productNameLowerCase;
          // console.log("userId:" + localStorageRatingKey);

        }

        scope.rating = function (rate) {


          scope.ratevalue = rate;
          console.log("ratevalue:" + scope.ratevalue);



          if ($localStorage[localStorageRatingKey] == undefined) {

            previousRatingValue = 0;
            $localStorage[localStorageRatingKey] = scope.ratevalue;

          } else {

            previousRatingValue = $localStorage[localStorageRatingKey];
            $localStorage[localStorageRatingKey] = scope.ratevalue;

          }


          ratingService.update({
            companyId: scope.details._id,
            userRating: scope.ratevalue,
            previousRatingValue: previousRatingValue
          }, scope.details, successCallback, errorCallback);


          function successCallback(res) {
            // console.log("coming from callback");
            scope.rate = res.avgRatings;
            scope.reviewsCount = res.totalRatingsCount;
          }


          function errorCallback(res) {
            //  console.log("coming from callback");
            NotificationFactory.error('Failed to update the product rating...', res.data.message);
          }

        };


        scope.showMe = function () {

          scope.showRatings = !scope.showRatings;
          scope.ratevalue = false;
          console.log("showme :" + scope.showRatings);
          //  console.log("---->" + scope.ratevalue);
        }

        scope.mouseOut = function () {
            scope.showRatings = !scope.showRatings;
          }
          // scope.ratevalue = true;
          /*if (scope.ratevalue == true) {
            scope.showRatings = false;
          } else {
            scope.showRatings = false;
          }*/

        /*
                  if ($localStorage[localStorageRatingKey]) {
                    scope.ratevalue = true;
                  } else {
                    scope.ratevalue = false;

                  }*/




        scope.hoverOut = function () {

          if ($localStorage[localStorageRatingKey]) {

            scope.showRatings = !scope.showRatings;

          } else {

            scope.showRatings = true;
          }
          console.log("hoverOut ShowRatings:" + scope.showRatings);
        }


        if ($localStorage[localStorageRatingKey]) {

          scope.showRatings = false;

        } else {

          scope.showRatings = true;
        }
        console.log("showRatings :" + scope.showRatings);

        scope.rate1 = $localStorage[localStorageRatingKey];
        scope.isReadonly1 = false;
        scope.rate = scope.details.avgRatings;
        scope.reviewsCount = scope.details.totalRatingsCount;

        scope.max = 5;
        scope.isReadonly = true;


        scope.proImgUrl = function () {
          if (scope.details.productImageURL)
            return scope.details.productImageURL
          else
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
        };

        scope.changeLimit = function (pro) {
          if (scope.limit == pro.description.length)
            scope.limit = 100;
          else
            scope.limit = pro.description.length;
        }


        scope.editProduct = function (Pro) {
          //console.log('Edit Product details on Direc. : ' + JSON.stringify(Pro));
          dataShare.setData(Pro);
          $state.go('companies.add');
        };




        /* scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };
*/

        scope.hoveringOver = function (value) {
          //console.log('hoveringOver is called');
          scope.overStar = value;
          // console.log('hoveringOver is called:' + scope.overStar);
          if (scope.overStar == 1) {
            scope.productReviewLabel = 'Unusable Product';
            // console.log('hoveringOver is called:' + scope.percent);
          } else if (scope.overStar == 2) {
            scope.productReviewLabel = 'Poor Product';
          } else if (scope.overStar == 3) {
            scope.productReviewLabel = 'Ok Product';
          } else if (scope.overStar == 4) {
            scope.productReviewLabel = 'Good Product';
          } else {
            scope.productReviewLabel = 'Excellect Product';
          }
          // scope.percent = 100 * (value / scope.max);
        };

      }
    };
  }]);

(function () {
  'use strict';

  dataShare.$inject = ["$rootScope", "$timeout"];
  angular
    .module('companies.services')
    .factory('CompanyService', CompanyService)
    .factory('CategoryService', CategoryService)
    .factory('dataShare', dataShare)
    .factory('ratingService', ratingService)
    .factory('deactiveService', deactiveService)
    /*  .factory('productService', productService)*/




  .factory('CompanyServiceUpdate', ['$resource', function ($resource) {
    return {
      UpdateProduct: $resource('api/companies/:companyId', {
        companyId: '@companyId'
      }, {
        update: {
          method: 'PUT'
        }
      }),
      DeleteProduct: $resource('api/companies/:companyId', {
        companyId: '@companyId'
      }, {
        remove: {
          method: 'DELETE'
        }
      }),
      getProduct: $resource('api/companies/:companyId', {
        companyId: '@companyId'
      }, {
        query: {
          method: 'GET'
        }
      })
    }
}]);

  /*  .factory('deactiveService', ['$resource', function ($resource) {
      return {
        DeactivateProduct: $resource('api/companies/:companyId', {
          companyId: '@companyId'
        }, {
          update: {
            method: 'PUT'
          }
        });
      }
  }]);*/

  deactiveService.$inject = ['$resource'];

  function deactiveService($resource) {
    return $resource('api/deactivateProduct/:companyId/:deactive', {
      deactive: '@deactive',
      companyId: '@companyId'
    }, {
      update: {
        method: 'PUT'
      }
    });

  };




  CategoryService.$inject = ['$resource'];

  function CategoryService($resource) {
    return $resource('api/categories', {}, {
      query: {
        method: 'GET',
        isArray: true
      }
    });
  };



  CompanyService.$inject = ['$resource', '$rootScope', '$timeout'];

  function CompanyService($resource) {
    return $resource('api/companies/:companyId', {
      companyId: '@companyId'
    }, {
      update: {
        method: 'PUT'
      }
    });
  };


  /* function CompanyService($resource) {
     return $resource('api/companies/:productId', {
       productId: '@productId'
     }, {
       update: {
         method: 'PUT'
       }
     });
   };*/



  function dataShare($rootScope, $timeout) {
    var service = {};
    service.data = false;
    service.setData = function (proDetails, proDetailsState) {
      var data = {
        data: proDetails,
        detailsState: proDetailsState
      }
      this.data = data;
      $timeout(function () {
        $rootScope.$broadcast('data_shared');
      }, 100);
    };
    service.getData = function () {
      return this.data;
    };
    return service;
  };

  ratingService.$inject = ['$resource'];

  function ratingService($resource) {

    return $resource('api/updateRating/:companyId/:previousRatingValue/:userRating', {
      previousRatingValue: '@previousRatingValue',
      companyId: '@companyId'
    }, {
      update: {
        method: 'PUT'
      }
    });

  };

})();

'use strict';

angular.module('core.admin').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Admin',
      state: 'admin',
      type: 'dropdown',
      roles: ['admin']
    });
  }
]);

'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admin',
        template: '<ui-view/>',
        data: {
          roles: ['admin']
        }
      });
  }
]);

(function () {
  'use strict';

  angular
    .module('core')
    .run(MenuConfig);

  MenuConfig.$inject = ['Menus'];

  function MenuConfig(Menus) {

    Menus.addMenu('account', {
      roles: ['user']
    });

    Menus.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['user']
    });

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile'
    });

    /*Menus.addSubMenuItem('account', 'settings', {
  title: 'Edit Profile Picture',
  state: 'settings.picture'
});*/

    Menus.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password'
    });

    /* Menus.addSubMenuItem('account', 'settings', {
   title: 'Manage Social Accounts',
   state: 'settings.accounts'
 });*/

  }

})();

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

'use strict';

angular.module('core').controller('ContactUsController', ['$scope', 'Authentication', 'ContactUsService', 'NotificationFactory', 'GetListedService', '$location',
  function ($scope, Authentication, ContactUsService, NotificationFactory, GetListedService, $location) {
    // This provides Authentication context.
    $scope.authentication = Authentication;





    $scope.path = $location.absUrl();
    //console.log(path);
    $scope.contactUs = function () {

      //console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));
      ContactUsService.send($scope.contact, successCallback, errorCallback);
      /*ContactUsService.send($scope.contact);*/



      function successCallback(res) {
        //console.log('Success while sending the Contactus details : ' + res);
        NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.name);
        $scope.contactUsForm.$setPristine();
        $scope.contactUsForm.$setUntouched();
        $scope.contact = {};
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }


    $scope.getListedEmail = function () {

      console.log('getlisted form details on controller : ' + JSON.stringify($scope.getListed));


      console.log("entering into getlisted function");
      /*   console.log('contactUs form details on controller : ' + JSON.stringify($scope.contact));*/

      /*if ($stateParams.isPremium == 'isPremium')
        $scope.getListed.isPremium = true;*/

      $scope.getListed.isPremium = false;

      GetListedService.send($scope.getListed, successCallback, errorCallback);

      function successCallback(res) {
        console.log('Success while sending the Contactus details : ' + res);
        NotificationFactory.success('Thankyou for Contacting ThingsBerry', 'Hi ' + res.contactName);
        $scope.getListedForm.$setPristine();
        $scope.getListedForm.$setUntouched();
        $scope.getListed = '';
      }

      function errorCallback(res) {
        //console.log('Error while sending the Contactus details : ' + JSON.stringify(res));
        //vm.error = res.data.message;
        //NotificationFactory.error('Failed to save Product details...', res.data.message);
      }
    }
  }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', '$http', '$localStorage', '$mdSidenav',
  function ($scope, $state, Authentication, Menus, $http, $localStorage, $mdSidenav) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;


    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };

    $scope.date1 = new Date();
    $scope.showBoxOne = false;

    $scope.showSearchDirective = function () {
      if ($state.current.name === 'home') {
        $scope.showBoxOne;
      } else {
        $scope.showBoxOne = !$scope.showBoxOne;
      }

      // console.log($state.current.name)
    }



    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Get the account menu
    $scope.accountMenu = Menus.getMenu('account').items[0];

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      console.log('id="tb-navbar-collapse" is called : ' + $scope.isCollapsed);
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });


    //console.log('Signout callback : ' + JSON.stringify($localStorage.user));



    $scope.signout = function () {
      //console.log('signout is called');
      // console.log('@@# in $http'+JSON.stringify($localStorage));
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $localStorage.token;
      $http.get('/api/auth/jwtSignout').success(function (response) {
        console.log('Signout callback : ' + JSON.stringify(response));
        $scope.authentication.user = '';
        delete $localStorage.token;
        delete $localStorage.user;
        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        $state.go('home');
      });

    };


    /* $scope.content = [

       {

         link: 'HoMe',

         route: 'home'



                   },

       {

         link: 'ALLPRODUCTS',
         route: 'not-found'


                   },

       {

         link: 'BLOG',
         route: 'blog'

                   },

       {

         link: 'GETLISTED',
         route: 'getListed'

                   },

       {

         link: 'CONTACTUS',
         route: 'contactus'

                   }

                   ];*/




  }
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'PremiumProducts', '$timeout', 'ourClients', 'featuredProducts', 'quotes', 'videos', '$sce',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, PremiumProducts, $timeout, ourClients, featuredProducts, quotes, videos, $sce) {

    var vm = this;


    $scope.spinnerLoading = true;

    $scope.myInterval = 0;

    $scope.noWrapSlides = false;
    $scope.active = 0;

    // $scope.headersearch=false;


    // This provides Authentication context.
    $scope.authentication = Authentication;
    //  console.log($scope.authentication);


    $scope.Advanced_Search_Fields = false;

    $scope.categoriesList = ['Category', 'HOME', 'HEALTH CARE', 'AUTOMOBILE', 'AGRICULTURE', 'UTILITIES', 'ENTERTAINMENT', 'ACCESORIES',
'TOYS', 'SPORT', 'ELECTRONICS', 'OFFICE PRODUCTS', 'BABY PRODUCTS', 'MOTORS'];
    $scope.CountriesList = ['Country', 'INDIA', 'US', 'UK', 'CHINA', 'JAPAN', 'AUSTRALIA'];
    $scope.StatesList = ['State', 'ANDHRA PRADESH', 'NEW JERSY', 'LONDON', 'HONG KONG', 'SYDNEY'];
    $scope.BusinessList = ['Business', 'SMALL SCALE', 'LARGE SCALE', 'AUTOMOBILES', 'TRADING', 'MARKETING'];

    $scope.getSearchedProducts = function (details) {



      /*      console.log("entering into getsearchproducts :" + details);

            console.log('details outputBrowsers is : ' + JSON.stringify(details.outputBrowsers));
            console.log('details is : ' + JSON.stringify(details));
            details.regions = $scope.outputBrowsers;*/
      //  console.log('details is : ' + JSON.stringify(details));
      if (details != undefined) {
        if (details.Category || details.Company || details.Product || details.outputBrowsers) {
          var catsArray = [];
          var regionsArray = [];
          if (details.Category) {
            if (details.Category.length > 0) {
              for (var i = 0; i < details.Category.length; i++) {
                catsArray.push(details.Category[i].title);
              }
            } else {
              catsArray.push(details.Category.title);
            }
          }
          if (details.outputBrowsers) {
            //console.log('details.outputBrowsers is : ' + JSON.stringify(details.outputBrowsers));

            if (details.outputBrowsers.length > 0) {
              for (var i = 0; i < details.outputBrowsers.length; i++) {
                regionsArray.push(details.outputBrowsers[i].name);
              }
            } else {
              regionsArray.push(details.outputBrowsers.name);
            }
          }

          if ((catsArray == '') && (regionsArray == '') && (details.Company == undefined) && (details.Product == undefined)) {
            $state.go('companies.list', {
              isSearch: false
            });
          } else {
            $state.go('companies.list', {
              cat: (catsArray == '') ? 'Category' : catsArray,
              com: (details.Company == undefined) ? 'Company' : details.Company,
              name: (details.Product == undefined) ? 'Product' : details.Product,
              regions: (regionsArray == '') ? '' : regionsArray,
              isSearch: true
            });
          }
        }
      } else {
        $state.go('companies.list', {
          isSearch: false
        });
      }
    };


    /*$scope.homePageProductDetails = {
      title: 'SONY',
      logoURL: '../../../../modules/core/client/img/brand/sony logo.png',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      webAddress: 'http://www.sonos.com/shop/play5'
    };*/

    $scope.loadCategories = function ($query) {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      // console.log(JSON.stringify(catsList));
      return catsList.$promise.then(function (result) {
        //$scope.catsList = result;
        defObj.resolve(result);
        return result.filter(function (catList) {
          return catList.title.toLowerCase().indexOf($query.toLowerCase()) != -1;
        });
        // console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });
      //console.log('defferes1111 obj : ' + JSON.stringify(defObj));
      return defObj.promise;
    };

    $scope.loadSearchCategories = function ($query) {
      // console.log($query);
      var catsList = ['Home', 'Healthcare', 'Wearable', 'Sports', 'Fitness', 'Accessories', 'Electronics'];

      return catsList.filter(function (list) {
        return list.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });

    };









    $scope.loadRegions = function () {


      var regions = [{
          name: "Africa",
          checked: false
    }, {
          name: "Asia-Pacific",
          checked: false
    }, {
          name: "Europe",
          checked: false
    }, {
          name: "Latin America",
          checked: false
    }, {
          name: "Middle East",
          checked: false
    }, {
          name: "North America",
          checked: false
    }, {
          name: "All Regions",
          checked: false
    }
  ];

      var deferred = $q.defer();
      deferred.resolve(regions);
      return deferred.promise;

    };


    /* $scope.myInterval = 5000;
     var slides = $scope.slides = [];
     $scope.addSlide = function() {
       console.log('in the home controller');
       var newWidth = 600 + slides.length + 1;
       slides.push({
         image: 'http://placekitten.com/' + newWidth + '/300',
         text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
           ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
       });
     };
     for (var i=0; i<4; i++) {
       $scope.addSlide();
     };*/


    $scope.tbClients = function () {
      ourClients.query({}, function (res) {
          // console.log(res);
          $scope.clients = res;
        },
        function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
    };

    $scope.tbVideos = function () {
      $scope.carouselBg2.push('carousel_spinner_featured');
      videos.query({}, function (res) {
          $scope.videos = res;
          $timeout(function () {
            $scope.carouselBg2.pop('carousel_spinner_featured');
          }, 1000);
        },
        function (err) {
          console.log('Failed to fetch the product details : ' + err);
        });
    };


    $scope.featuredProducts = function () {
      $scope.date = new Date();
      $scope.carouselBg1.push('carousel_spinner_featured');

      featuredProducts.query({}, function (res) {
        // console.log(res);
        $scope.featuredProducts = res;
        // console.log('the length:' + JSON.stringify($scope.featuredProducts.length));
        for (var i = 0; i < ($scope.featuredProducts.length); i++) {
          $scope.addSlide2($scope.featuredProducts[i]);
        }
        $scope.sample = $scope.listToMatrix($scope.slides2, 3);
        // console.log('the resultant matrix' + JSON.stringify($scope.sample));

        for (var j = 0; j < ($scope.featuredProducts.length); j++) {
          $scope.addSlide3($scope.featuredProducts[j]);
        }
        $scope.sampleInSm = $scope.listToMatrix($scope.slides3, 2);
        // console.log('the resultant matrix' + JSON.stringify($scope.sampleInSm));


        for (var k = 0; k < $scope.featuredProducts.length; k++) {
          $scope.addSlide4($scope.featuredProducts[k]);
        }
        $scope.sampleInXs = $scope.listToMatrix($scope.slides4, 1);
        // console.log('the resultant matrix' + JSON.stringify($scope.sampleInXs));
        $timeout(function () {
          $scope.carouselBg1.pop('carousel_spinner_featured');
        }, 1000);


      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });

    };

    $scope.tbQuotes = function () {

      quotes.query({}, function (res) {
        // console.log(res);
        $scope.quotes = res;
        //  console.log('the length:' + JSON.stringify($scope.quotes));
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });

    }






    /*    $scope.myInterval = 5000;
        $scope.noWrapSlides = false;
        $scope.active = 0;
        var slides1 = $scope.slides1 = [];*/
    /*var slidesarray =$scope.slidesarray = [['slide1','slide2'],['slide3','slide4'],['slide5','slide6'],['slide7','slide8'],['slide9','slide10']];*/

    /*    var sample = $scope.sample = [];
        var slides3 = $scope.slides3 = [];
        var currIndex = 0;
        $scope.carouselBg = [];*/



    //    $scope.myInterval = 5000;
    //    $scope.noWrapSlides = false;
    //    $scope.active = 0;


    var slides1 = $scope.slides1 = [];
    var slides2 = $scope.slides2 = [];
    var slides3 = $scope.slides3 = [];
    var slides4 = $scope.slides4 = [];
    var currIndex = 0;
    $scope.carouselBg = [];
    $scope.carouselBg1 = [];
    $scope.carouselBg2 = [];


    $scope.premiumProducts = function () {
      // $scope.spinnerLoading = true;
      $scope.carouselBg.push('carousel_spinner');
      PremiumProducts.query({}, function (res) {

        $scope.premiumProducts = res;

        for (var i = 0; i < ($scope.premiumProducts.length); i++) {
          $scope.addSlide1($scope.premiumProducts[i]);
        }
        $scope.premiumPrdcts = $scope.listToMatrix($scope.slides1, 1);
        // console.log($scope.premiumPrdcts);
        $timeout(function () {
          $scope.carouselBg.pop('carousel_spinner');
        }, 1000);
      }, function (err) {
        console.log('Failed to fetch the product details : ' + err);
      });
    };





    //
    //    $scope.getPremiumProducts = function () {
    //      $scope.carouselBg.push('carousel_spinner');
    //      PremiumProducts.query({}, function (res) {
    //        $scope.premiumProducts = res;
    //
    //        //console.log('the length:'+JSON.stringify($scope.premiumProducts));
    //        for (var i = 0; i < ($scope.premiumProducts.length); i++) {
    //          $scope.addSlide1($scope.premiumProducts[i]);
    //        }
    //
    //        $scope.sample = $scope.listToMatrix($scope.slides1, 2);
    //        // console.log('the resultant matrix'+JSON.stringify($scope.sample));
    //
    //        for (var k = 0; k < $scope.premiumProducts.length; k++) {
    //          $scope.addSlide3($scope.premiumProducts[k]);
    //        }
    //        $timeout(function () {
    //          $scope.carouselBg.pop('carousel_spinner');
    //        }, 1000);
    //
    //      }, function (err) {
    //        console.log('Failed to fetch the product details : ' + err);
    //      });
    //    };


    $scope.listToMatrix = function (list, elementsPerSubArray) {
      //console.log('calling to listtomatrix function');
      var matrix = [],
        i, k;

      for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
          k++;
          matrix[k] = [];
        }

        matrix[k].push(list[i]);
      }

      return matrix;
      //console.log('the resultant matrix:'+matrix);
    }



    $scope.addSlide1 = function (details) {
      slides1.push(details);
    };

    $scope.addSlide2 = function (details) {
      slides2.push(details);
    };

    $scope.addSlide3 = function (details) {
      slides3.push(details);
    };
    $scope.addSlide4 = function (details) {
      slides4.push(details);
    };




    $scope.modernBrowsers = [{
        name: "Africa"
    }, {
        name: "Asia-Pacific"
    }, {
        name: "Europe"
    }, {
        name: "Latin America"
    }, {
        name: "Middle East"
    }, {
        name: "North America"
    }, {
        name: "All Regions"
    }
  ];



    $scope.fOpen = function () {
      //console.log('On-open');
    }

    $scope.fClose = function () {
      //console.log('On-close');
    }

    $scope.fClick = function (data) {
      console.log('On-item-click');
      //console.log('On-item-click - data:');
      //console.log(data);
    }

    $scope.fSelectAll = function () {
      //console.log('On-select-all');
    }

    $scope.fSelectNone = function () {
      //console.log('On-select-none');
    }

    $scope.fReset = function () {
      //console.log('On-reset');
    }

    $scope.fClear = function () {
      //console.log('On-clear');
    }

    $scope.fSearchChange = function (data) {
      console.log('On-search-change');
      console.log('On-search-change - keyword: ' + data.keyword);
      //console.log('On-search-change - result: ');
      //console.log(data.result);
    }

}
]);
angular.module('core').directive('myYoutube', ["$sce", function ($sce) {
  return {
    restrict: 'EA',
    scope: {
      code: '='
    },
    replace: true,
    template: '<div class="videoBox"><iframe style="overflow:hidden;height:100%;width:100%" controls="0" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
      //  console.log('here');
      scope.$watch('code', function (newVal) {
        if (newVal) {
          scope.url = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + newVal);
        }
      });
    }
  };
}]);

'use strict';


angular.module('core')
  .directive('tbClients', ["dataShare", "$state", "$localStorage", function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        clients: '='

      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-clients-display.html',
      link: function (scope, elem, attrs) {
        // console.log("entering into the clients link furnctions");
        // console.log(scope.clients);

      }
    };
  }]);

'use strict';


angular.module('core')
  .directive('tbPremiumProducts', ["dataShare", "$state", "$localStorage", "Authentication", function (dataShare, $state, $localStorage, Authentication) {
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-premium-products-display.html',
      link: function (scope, elem, attrs) {
        //  console.log("entering into the tbPremiumProducts products link furnctions");
        // console.log(scope.details);
        scope.adminUser = Authentication.user;
        // console.log(scope.adminUser.roles);

        if (scope.adminUser) {
          if (scope.adminUser.roles.indexOf('admin') !== -1) {
            // console.log('directive admin is there');
            scope.editProduct = true;

          } else {
            // console.log('directive admin not there');
            scope.editProduct = false;
          }
        }

        scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };

      }
    };
  }]);

'use strict';


angular.module('core')
  .directive('tbQuotes', ["dataShare", "$state", "$localStorage", function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        tbquote: '='

      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-quotes-display.html',
      link: function (scope, elem, attrs) {
        //  console.log("entering into the quotes link furnctions");
        //  console.log(scope.tbquote);

      }
    };
  }]);

'use strict';


angular.module('core')
  .directive('tbSearch', ["dataShare", "$state", "$localStorage", function (dataShare, $state, $localStorage) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        headersearch: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-tb-search-display.html',
      controller: 'HomeController',
      link: function (scope, elem, attrs) {
        // console.log("entering into the tbSearch link furnctions");
        // console.log("directive:" + scope.headersearch);

        if (attrs.state === 'headerSearchInput') {
          scope.headerSearch = function (value) {
            //  console.log("befor return incontroler");
            scope.headersearch = value;
            // console.log("after return incontroler");
          };
        }
      }
    };
  }]);

(function () {
  'use strict';

  angular.module('core')
    .directive('pageTitle', pageTitle);

  pageTitle.$inject = ['$rootScope', '$timeout', '$interpolate', '$state'];

  function pageTitle($rootScope, $timeout, $interpolate, $state) {
    var directive = {
      retrict: 'A',
      link: link
    };

    return directive;

    function link(scope, element) {
      $rootScope.$on('$stateChangeSuccess', listener);

      function listener(event, toState) {
        var title = (getTitle($state.$current));
        $timeout(function () {
          element.text(title);
        }, 0, false);
      }

      function getTitle(currentState) {
        var applicationCoreTitle = 'thingsberry.com';
        var workingState = currentState;
        if (currentState.data) {
          workingState = (typeof workingState.locals !== 'undefined') ? workingState.locals.globals : workingState;
          var stateTitle = $interpolate(currentState.data.pageTitle)(workingState);
          return applicationCoreTitle + ' - ' + stateTitle;
        } else {
          return applicationCoreTitle;
        }
      }
    }
  }
})();

'use strict';

/**
 * Edits by Ryan Hutchison
 * Credit: https://github.com/paulyoder/angular-bootstrap-show-errors */

angular.module('core')
  .directive('showErrors', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
    var linkFn = function (scope, el, attrs, formCtrl) {
      var inputEl, inputName, inputNgEl, options, showSuccess, toggleClasses,
        initCheck = false,
        showValidationMessages = false,
        blurred = false;

      options = scope.$eval(attrs.showErrors) || {};
      showSuccess = options.showSuccess || false;
      inputEl = el[0].querySelector('.form-control[name]') || el[0].querySelector('[name]');
      inputNgEl = angular.element(inputEl);
      inputName = $interpolate(inputNgEl.attr('name') || '')(scope);

      if (!inputName) {
        throw 'show-errors element has no child input elements with a \'name\' attribute class';
      }

      var reset = function () {
        return $timeout(function () {
          el.removeClass('has-error');
          el.removeClass('has-success');
          showValidationMessages = false;
        }, 0, false);
      };

      scope.$watch(function () {
        return formCtrl[inputName] && formCtrl[inputName].$invalid;
      }, function (invalid) {
        return toggleClasses(invalid);
      });

      scope.$on('show-errors-check-validity', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          initCheck = true;
          showValidationMessages = true;

          return toggleClasses(formCtrl[inputName].$invalid);
        }
      });

      scope.$on('show-errors-reset', function (event, name) {
        if (angular.isUndefined(name) || formCtrl.$name === name) {
          return reset();
        }
      });

      toggleClasses = function (invalid) {
        el.toggleClass('has-error', showValidationMessages && invalid);
        if (showSuccess) {
          return el.toggleClass('has-success', showValidationMessages && !invalid);
        }
      };
    };

    return {
      restrict: 'A',
      require: '^form',
      compile: function (elem, attrs) {
        if (attrs.showErrors.indexOf('skipFormGroupCheck') === -1) {
          if (!(elem.hasClass('form-group') || elem.hasClass('input-group'))) {
            throw 'show-errors element does not have the \'form-group\' or \'input-group\' class';
          }
        }
        return linkFn;
      }
    };
  }]);

'use strict';


angular.module('core')
  .directive('tbFeaturedProducts', ["dataShare", "$state", "$localStorage", "deactiveService", "$window", "$uibModal", "CompanyServiceUpdate", function (dataShare, $state, $localStorage, deactiveService, $window, $uibModal, CompanyServiceUpdate) {
    return {
      restrict: 'E',
      scope: {
        details: '=',
        editIcon: '='
      },
      templateUrl: 'modules/core/client/views/directive-partials/new-featured-products-display.html',
      link: function (scope, elem, attrs) {
        // console.log("entering into the featurred products link furnctions");

        scope.date1 = attrs.dateOnProduct;

        if (scope.editIcon.user) {
          if (scope.editIcon.user.roles.indexOf('admin') !== -1) {
            // console.log('directive admin is there');
            scope.editProduct = true;

          } else {
            // console.log('directive admin not there');
            scope.editProduct = false;
          }
        }
        scope.dynamicPopover = {
          templateUrl: 'modules/companies/client/views/popover/rating-popover.client.view.html'
        };

        scope.deleteProduct = function () {
          var modalInstance = $uibModal.open({
            animation: scope.animationsEnabled,
            templateUrl: 'modules/companies/client/views/modals/delete-product-modal.client.view.html',
            controller: 'ModalInstanceCtrl',
            backdrop: 'static',
            resolve: {
              productFromModal: function () {
                return scope.details;
              }
            }
          });

          modalInstance.result.then(function (product) {
            //  console.log("REMOVING PRODUCTS");
            if (product) {
              // console.log('remove func. on if condition : ');
              CompanyServiceUpdate.DeleteProduct.remove({
                companyId: product.productId
              }, function (res) {
                //   console.log('Res details on remove success cb : ' + JSON.stringify(res));
                $window.location.reload();
                /*$state.go('companies.list', {
                  isSearch: false
                });*/
                NotificationFactory.success('Successfully Removed Product details...', 'Product Name : ' + res.Proname);
              }, function (err) {
                console.log('Err details on remove Error cb : ' + JSON.stringify(err));
                NotificationFactory.error('Failed to Remove Product details...', 'Product Name : ' + vm.company.Proname);
              })
            } else {
              console.log('remove func. on else condition : ');
            }
          }, function () {
            //$log.info('Modal Task Delete dismissed at: ' + new Date());
          });

        }



        scope.deactivateProduct = function () {
          //  console.log("DEACTIVE PRDCT IS CALLED");
          deactiveService.update({
            companyId: scope.details.productId,
            deactive: 'deactive'
          }, scope.details, successUpdateCallback, errorUpdateCallback);

          function successUpdateCallback(res) {
            $window.location.reload();

            NotificationFactory.success('Successfully Deactivated Product....', 'Product Name : ' + res.Proname);
          }

          function errorUpdateCallback(res) {
            vm.error = res.data.message;
            NotificationFactory.error('Failed to Update Product details...', res.data.message);
          }

        };



        /*  scope.editProductFunc = function (productDetails) {
            console.log($state.current.name);
            // console.log('Edit Product details on Direc. : ' + JSON.stringify(productDetails));
            dataShare.setData(productDetails, $state.current.name);
            $state.go('companies.add');
          }*/
      }
    };
  }]);

'use strict';


angular.module('core')
  .directive('premiumProductsDisplay', ["dataShare", "$state", "$localStorage", function (dataShare, $state, $localStorage) {

    // console.log("entering into premiumProductsDisplay directive1");
    return {
      restrict: 'E',
      scope: {
        details: '='
      },
      templateUrl: 'modules/core/client/views/tb-premium-products-display.html',


      link: function (scope, elem, attrs) {


        //  console.log("entering into the premium products link furnctions");
        scope.user = $localStorage.user;
        scope.proImgUrl = function () {
          if (scope.details.image) {
            return scope.details.image
          } else if (scope.details.logo != undefined) {
            // console.log('Detaisl of product getting eroor : ' + JSON.stringify(scope.details));
            return 'data:' + scope.details.logo.filetype + ';base64,' + scope.details.logo.base64;
          }
        };


        // console.log('Product details are : ' + JSON.stringify(scope.details));


        scope.ProductDetails = function () {
          //   console.log('ProductDetails is triggred');
        }


      }
    };
  }]);

'use strict';

//Contact Us service
angular.module('core')

.factory('ContactUsService', ['$resource',
	function ($resource) {
    return $resource('api/contactUs', {}, {
      send: {
        method: 'POST'
      }
    });
	}
])

.factory('GetListedService', ['$resource',
	function ($resource) {
    return $resource('api/getListed', {}, {
      send: {
        method: 'POST'
      }
    });
	}
])

'use strict';

angular.module('core').factory('authInterceptor', ['$q', '$injector', 'Authentication',
  function ($q, $injector, Authentication) {
    return {
      responseError: function(rejection) {
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              $injector.get('$state').transitionTo('authentication.signin');
              break;
            case 403:
              $injector.get('$state').transitionTo('forbidden');
              break;
          }
        }
        // otherwise, default behaviour
        return $q.reject(rejection);
      }
    };
  }
]);

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [
  function () {
    // Define a set of default roles
    this.defaultRoles = ['user', 'admin'];

    // Define the menus object
    this.menus = {};

    // A private function for rendering decision
    var shouldRender = function (user) {
      if (!!~this.roles.indexOf('*')) {
        return true;
      } else {
        if(!user) {
          return false;
        }
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      }

      return false;
    };

    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exist');
        }
      } else {
        throw new Error('MenuId was not provided');
      }

      return false;
    };

    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      return this.menus[menuId];
    };

    // Add new menu object by menu id
    this.addMenu = function (menuId, options) {
      options = options || {};

      // Create the new menu
      this.menus[menuId] = {
        roles: options.roles || this.defaultRoles,
        items: options.items || [],
        shouldRender: shouldRender
      };

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Return the menu object
      delete this.menus[menuId];
    };

    // Add menu item object
    this.addMenuItem = function (menuId, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Push new menu item
      this.menus[menuId].items.push({
        title: options.title || '',
        state: options.state || '',
        type: options.type || 'item',
        class: options.class,
        roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.defaultRoles : options.roles),
        position: options.position || 0,
        items: [],
        shouldRender: shouldRender
      });

      // Add submenu items
      if (options.items) {
        for (var i in options.items) {
          this.addSubMenuItem(menuId, options.state, options.items[i]);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Add submenu item object
    this.addSubMenuItem = function (menuId, parentItemState, options) {
      options = options || {};

      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === parentItemState) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: options.title || '',
            state: options.state || '',
            roles: ((options.roles === null || typeof options.roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : options.roles),
            position: options.position || 0,
            shouldRender: shouldRender
          });
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].state === menuItemState) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemState) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);

      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].state === submenuItemState) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }

      // Return the menu object
      return this.menus[menuId];
    };

    //Adding the topbar menu
    this.addMenu('topbar', {
      roles: ['*']
    });
  }
]);

'use strict';

//Notification service
angular.module('core')

.factory('NotificationFactory', function () {
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "onclick": null,
    "showDuration": "400",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  }
  return {
    success: function (msg, title) {
      toastr.success(msg, title);
    },
    error: function (msg, title) {
      toastr.error(msg, title);
    }
  };
})

'use strict';

//Search service used for quering Products

angular.module('core')

.factory('SearchProducts', ["$resource", function ($resource) {
  return $resource('api/search/products/:ProCategory/:ProCompany/:ProName/:ProRegions/:pageId', {
    ProCategory: '@ProCategory',
    ProCompany: '@ProCompany',
    ProName: '@ProName',
    ProRegions: '@ProRegions',
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
    }
  });
}])



.factory('ListOfProducts', ["$resource", function ($resource) {
  return $resource('api/listOfProducts/:pageId', {
    pageId: '@pageId'
  }, {
    'query': {
      method: 'GET',
      timeout: 20000
    }
  });
}])


.factory('PremiumProducts', ["$resource", function ($resource) {
  return $resource('api/premiumProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
}])

.factory('featuredProducts', ["$resource", function ($resource) {
  return $resource('api/featuredProducts', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
}])


.factory('ourClients', ["$resource", function ($resource) {
  return $resource('api/clients', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
}])

.factory('quotes', ["$resource", function ($resource) {
  return $resource('api/quotes', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
}])

.factory('videos', ["$resource", function ($resource) {
  return $resource('api/videos', {}, {
    'query': {
      method: 'GET',
      timeout: 20000,
      isArray: true
    }
  });
}])

'use strict';

// Create the Socket.io wrapper service
angular.module('core').service('Socket', ['Authentication', '$state', '$timeout',
  function (Authentication, $state, $timeout) {
    // Connect to Socket.io server
    this.connect = function () {
      // Connect only when authenticated
      if (Authentication.user) {
        this.socket = io();
      }
    };
    this.connect();

    // Wrap the Socket.io 'on' method
    this.on = function (eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function (data) {
          $timeout(function () {
            callback(data);
          });
        });
      }
    };

    // Wrap the Socket.io 'emit' method
    this.emit = function (eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    // Wrap the Socket.io 'removeListener' method
    this.removeListener = function (eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };
  }
]);

'use strict';

// Configuring the Users module
angular.module('users.admin').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });
  }
]);

'use strict';

// Setting up route
angular.module('users.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: 'modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        data: {
          pageTitle: 'Users List'
        }
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        },
        data: {
          pageTitle: 'Edit {{ userResolve.displayName }}'
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        resolve: {
          userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
            return Admin.get({
              userId: $stateParams.userId
            });
          }]
        },
        data: {
          pageTitle: 'Edit User {{ userResolve.displayName }}'
        }
      });
  }
]);

'use strict';

// Setting up route

angular.module('users').config(['$stateProvider',
  function ($stateProvider) {
   // console.log('In the clientSide Routes');
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: 'modules/users/client/views/settings/settings.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: 'modules/users/client/views/settings/edit-profile.client.view.html',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: 'modules/users/client/views/settings/change-password.client.view.html',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: 'modules/users/client/views/settings/manage-social-accounts.client.view.html',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: 'modules/users/client/views/settings/change-profile-picture.client.view.html',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html'
      })
      .state('authentication.signup', {
        url: '/signup',
        templateUrl: 'modules/users/client/views/authentication/signup.client.view.html',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: 'modules/users/client/views/authentication/signin.client.view.html',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: 'modules/users/client/views/password/forgot-password.client.view.html',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: 'modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: 'modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      /*.state('password.reset.form', {
  url: '/passwordReset',
  templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
  data: {
    pageTitle: 'Password reset form'
  }
})*/
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: 'modules/users/client/views/password/reset-password.client.view.html',
        data: {
          pageTitle: 'Password reset form'
        }
      });
  }
]);

'use strict';

angular.module('users.admin').controller('UserListController', ['$scope', '$filter', 'Admin',
  function ($scope, $filter, Admin) {
    Admin.query(function (data) {
      $scope.users = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 15;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.users, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };
  }
]);

'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'userResolve',
  function ($scope, $state, Authentication, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;

    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };

    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', '$localStorage', 'NotificationFactory', 'SignUpCondition', 'Users',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, $localStorage, NotificationFactory, SignUpCondition, Users) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }



    $scope.pwdCompare = function () {
      console.log('Credentials checking pwd ');
      if ($scope.credentials.password1 === $scope.credentials.password2) {
        //console.log('Pwd Matched');
        $scope.error = null;
        $scope.credentials.password = $scope.credentials.password1;
      } else {
        //console.log('Pwd doesnt Matched');
        $scope.error = "Password Doesn't match";
      }
    };

    $scope.signup = function (isValid) {
      console.log('In the controller function from signup page');
      $scope.buttonTextSignUp = 'Signing Up...';


      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }
      console.log($scope.credentials);
      $http.post('/api/auth/jwtSignup', $scope.credentials).success(function (response) {
        //console.log('proving the route to go to server side routes');
        console.log("to signup:" + JSON.stringify(response));
        if (response.type === false) {
          $scope.error = response.data;
          //$scope.isDisabled = false;
          $scope.buttonTextSignUp = 'Sign Up';
          console.log('Error Msg : ' + JSON.stringify(response.data));

        } else {
          $scope.error = null;
          //$scope.populateUserLocally(res);
          // If successful we assign the response to the global user model
          $scope.populateUserLocally(response);
          console.log('Msg : ' + JSON.stringify(response));
        }




      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/jwtSignin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model


        if (response.type === false) {
          $scope.error = response.data;
          //$scope.isDisabled = false;
          //$scope.buttonTextSignUp = 'Sign Up';
          // console.log('Error Msg : ' + JSON.stringify(response.data));

        } else {
          $scope.error = null;
          //$scope.populateUserLocally(res);
          // If successful we assign the response to the global user model
          $scope.populateUserLocally(response);
          //console.log('#####->user login detailsss : ' + JSON.stringify(response));
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
    };



    $scope.populateUserLocally = function (respUser) {

      //console.log('After successfully created or login user details : ' + JSON.stringify(respUser));

      $scope.authentication.user = respUser;
      $localStorage.user = respUser;
      $localStorage.token = respUser.token;
      NotificationFactory.success('Hi ' + respUser.displayName, 'Authentication Success !');
      /* console.log('states:'+ $state.previous.state.name);
       console.log('states++++:'+ JSON.stringify($state.previous.params));*/
      $state.go($state.previous.state.name || 'home', $state.previous.params);
    };



    hello.init({
      google: '1011487504050-sjufok8ijqcho7h19uke77et14bmu87n.apps.googleusercontent.com',
      facebook: '239001833102223'
    }, {
      scope: 'email',
      redirect_uri: '/'
    });

    $scope.fbAuthLogIn = function () {
      //console.log('in the fbAuthlogin');
      hello('facebook').login().then(function (fbRes) {
        //console.log('user response is:'+JSON.stringify(fbRes));
        $http({
            method: "GET",
            url: 'https://graph.facebook.com/me?fields=email,first_name,gender,id,last_name&access_token=' + fbRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile Details is : ' + JSON.stringify(data));
            $scope.fUser = {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              provider: 'fb'
            };
            // console.log('$scope fuser details :'+JSON.stringify($scope.fUser));
            Users.Signup.create($scope.fUser).$promise.then(function (res) {
              // console.log('##users.signup.create response :'+JSON.stringify(res));
              if (res.type === false) {
                //  console.log('@@ res.type is :'+res.type);
                $scope.errMsg = res.data;
                //  console.log('@@ res.data is :'+res.data);
                $scope.populateUserLocally(res.user);
                //  console.log('@@ res.user is :'+JSON.stringify(res.user));
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
                //  console.log('@@ response in fb')
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      }, function (e) {
        console.log('Signin error: ' + e.error.message);
      })
    };




    $scope.googleAuthLogIn = function () {
      //console.log('in the googleAuthLogIn');
      hello('google').login().then(function (gRes) {
        //console.log('google user response' + JSON.stringify(gRes));
        $http({
            method: "GET",
            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + gRes.authResponse.access_token,
            data: null,
            dataType: 'json',
          })
          .success(function (data) {
            //console.log('User Profile is : ' + JSON.stringify(data));
            $scope.gUser = {
              firstName: data.given_name,
              lastName: data.family_name,
              email: data.email,
              provider: 'gmail'
            };
            Users.Signup.create($scope.gUser).$promise.then(function (res) {
              if (res.type === false) {
                console.log('@@ res.type is :' + res.type);
                $scope.errMsg = res.data;
                console.log('@@ res.data is :' + res.data);
                $scope.populateUserLocally(res.user);
                console.log('@@ res.user is :' + JSON.stringify(res.user));
              } else {
                $scope.errMsg = false;
                $scope.populateUserLocally(res);
              }
            }).catch(function (err) {
              alert('Looks like there is an issue with your connectivity, Please try after sometime!');
            });
          })
          .error(function (data, status) {
            $scope.errMsg = 'This seems to be Google login error. We willl look into it and let you know';
          });
      }, function (e) {
        console.log('Signin error: ' + e.error.message);
      })
    };






    /*  // OAuth provider request
    $scope.callOauthProvider = function (url) {
      console.log('client side url'+url);
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
        console.log('client side url'+JSON.stringify($state.previous.href));
        console.log('######client side url'+url);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };*/
  }
]);

'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication', 'PasswordValidator',
  function ($scope, $stateParams, $http, $location, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // If user is signed in then redirect back home
    if ($scope.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    $scope.askForPasswordReset = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'forgotPasswordForm');

        return false;
      }
console.log("forgot password:"+JSON.stringify($scope.credentials));
      $http.post('/api/auth/jwtForgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
         $scope.forgotPasswordForm.$setPristine();
        $scope.forgotPasswordForm.$setUntouched();
        $scope.credentials = null;
        $scope.success = response.message;

      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'resetPasswordForm');

        return false;
      }

      $http.post('/api/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;

        // Attach user profile
        Authentication.user = response;

        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangePasswordController', ['$scope', '$http', 'Authentication', 'PasswordValidator',
  function ($scope, $http, Authentication, PasswordValidator) {
    $scope.user = Authentication.user;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Change user password
    $scope.changeUserPassword = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'passwordForm');

        return false;
      }

      $http.post('/api/auth/jwtChangePassword', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.$broadcast('show-errors-reset', 'passwordForm');
        $scope.success = true;
         $scope.passwordForm.$setPristine();
        $scope.passwordForm.$setUntouched();

        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUpload();

      // Show error message
      $scope.error = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
  }
]);

'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication', '$localStorage',
  function ($scope, $http, $location, Users, Authentication, $localStorage) {
    $scope.authentication = Authentication;

    $scope.user = $localStorage.user;


    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');
        $scope.success = true;
        $scope.authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SocialAccountsController', ['$scope', '$http', 'Authentication',
  function ($scope, $http, Authentication) {
    $scope.user = Authentication.user;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;

      $http.delete('/api/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);

'use strict';

angular.module('users').controller('SettingsController', ['$scope', 'Authentication', '$localStorage',
  function ($scope, Authentication, $localStorage) {
    $scope.user = Authentication.user;
    $scope.user = $localStorage.user;
  }
]);

'use strict';

angular.module('users')
  .directive('passwordValidator', ['PasswordValidator', function(PasswordValidator) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.requirements = function (password) {
          var status = true;
          if (password) {
            var result = PasswordValidator.getResult(password);
            var requirementsIdx = 0;

            // Requirements Meter - visual indicator for users
            var requirementsMeter = [
              { color: 'danger', progress: '20' },
              { color: 'warning', progress: '40' },
              { color: 'info', progress: '60' },
              { color: 'primary', progress: '80' },
              { color: 'success', progress: '100' }
            ];

            if (result.errors.length < requirementsMeter.length) {
              requirementsIdx = requirementsMeter.length - result.errors.length - 1;
            }

            scope.requirementsColor = requirementsMeter[requirementsIdx].color;
            scope.requirementsProgress = requirementsMeter[requirementsIdx].progress;

            if (result.errors.length) {
              scope.popoverMsg = PasswordValidator.getPopoverMsg();
              scope.passwordErrors = result.errors;
              status = false;
            } else {
              scope.popoverMsg = '';
              scope.passwordErrors = [];
              status = true;
            }
          }
          return status;
        };
      }
    };
  }]);

'use strict';

angular.module('users')
  .directive('passwordVerify', [function() {
    return {
      require: 'ngModel',
      scope: {
        passwordVerify: '='
      },
      link: function(scope, element, attrs, ngModel) {
        var status = true;
        scope.$watch(function() {
          var combined;
          if (scope.passwordVerify || ngModel) {
            combined = scope.passwordVerify + '_' + ngModel;
          }
          return combined;
        }, function(value) {
          if (value) {
            ngModel.$validators.passwordVerify = function (password) {
              var origin = scope.passwordVerify;
              return (origin !== password) ? false : true;
            };
          }
        });
      }
    };
  }]);

'use strict';

// Users directive used to force lowercase input
angular.module('users').directive('lowercase', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, modelCtrl) {
      modelCtrl.$parsers.push(function (input) {
        return input ? input.toLowerCase() : '';
      });
      element.css('text-transform', 'lowercase');
    }
  };
});

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user
    };

    return auth;
  }
]);

'use strict';

// PasswordValidator service used for testing the password strength
angular.module('users').factory('PasswordValidator', ['$window',
  function ($window) {
    var owaspPasswordStrengthTest = $window.owaspPasswordStrengthTest;

    return {
      getResult: function (password) {
        var result = owaspPasswordStrengthTest.test(password);
        return result;
      },
      getPopoverMsg: function () {
        var popoverMsg = 'Please enter a passphrase or password with 10 or more characters, numbers, lowercase, uppercase, and special characters.';
        return popoverMsg;
      }
    };
  }
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
  function ($resource) {
    return $resource('api/users', {}, {
      update: {
        method: 'PUT'
      }
    });
  }
])

//TODO this should be Users service
angular.module('users.admin').factory('Admin', ['$resource',
  function ($resource) {
    return $resource('api/users/:userId', {
      userId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('SignUpCondition', function () {
  return false;
})






  .factory('Users', ['$resource', 'ConfigService', function ($resource, ConfigService, $localStorage) {
  return {
    Signup: $resource(ConfigService.API_URL + '/users/signup', {}, {
      create: {
        method: 'POST',
        timeout: 30000
      }
    }),
    Login: $resource(ConfigService.API_URL + '/users/signin', {}, {
      create: {
        method: 'POST',
        timeout: 20000
      }
    }),


  }
}])

/*provides environment specific API url */
.service('ConfigService', ["$window", function ($window) {
  if ($window.location.host.match(/localhost:3000\.com/)) {
    //console.log('its prod: ' + $window.location.host);
    this.API_URL = 'http://www.qa.thingsberry.com';
    return this.API_URL;
  } else if ($window.location.host.match(/202.83.31.92\:3000/)) {
    //console.log('its test: ' + $window.location.host);
    this.API_URL = 'http://localhost:3000';
    return this.API_URL;
  } else {
    //console.log('its dev: ' + $window.location.host);
    this.API_URL = 'http://' + $window.location.host;
    return this.API_URL;
  }
}])

