'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'SearchProducts', '$state', 'CategoryService', '$q', 'PremiumProducts', '$timeout', 'ourClients', 'featuredProducts', 'quotes',
  function ($scope, Authentication, SearchProducts, $state, CategoryService, $q, PremiumProducts, $timeout, ourClients, featuredProducts, quotes) {

    var vm = this;




    $scope.myInterval = 0;

    $scope.noWrapSlides = false;
    $scope.active = 0;
    $scope.spinnerLoading = true;


    // This provides Authentication context.
    $scope.authentication = Authentication;


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
              com: details.Company,
              name: details.Product,
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


    $scope.homePageProductDetails = {
      title: 'SONY',
      logoURL: '../../../../modules/core/client/img/brand/sony logo.png',
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
      webAddress: 'http://www.sonos.com/shop/play5'
    };

    $scope.loadCategories = function () {
      var catsList = CategoryService.query(),
        defObj = $q.defer();
      catsList.$promise.then(function (result) {
        //$scope.catsList = result;
        defObj.resolve(result);
        // console.log('$scope.catsList is : ' + JSON.stringify(catsList));
      });

      //console.log('defferes1111 obj : ' + JSON.stringify(defObj));
      return defObj.promise;
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


    $scope.getClients = function () {
      ourClients.query({}, function (res) {
        // console.log(res);
        $scope.client = res;

        /*for (var i = 0; i < $scope.client; i++) {
  $scope.test = $scope.client[i];
  console.log('final obj' + JSON.stringify($scope.test));
}*/
      })

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
    //    var slides2 = $scope.slides2 = [];
    //    var slides3 = $scope.slides3 = [];
    var currIndex = 0;
    $scope.carouselBg = [];

    $scope.getPremiumProducts = function () {


      $scope.carouselBg.push('carousel_spinner');
      PremiumProducts.query({}, function (res) {


        $scope.premiumProducts = res;

        for (var i = 0; i < ($scope.premiumProducts.length / 4); i++) {


          $scope.addSlide1($scope.premiumProducts[i]);
        }

        /*    for (var j = ($scope.premiumProducts.length / 4); j < $scope.premiumProducts.length; j++) {
              $scope.addSlide2($scope.premiumProducts[j]);
            }*/
        //
        //        for (var k = 0; k < $scope.premiumProducts.length; k++) {
        //          $scope.addSlide3($scope.premiumProducts[k]);
        //        }
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
      slides1.push({
        image: details.productImageURL,
        proAddress: details.webAddress,
        desc: details.description,
        web: details.companyWebsite,
        text: details.Proname,
        id: currIndex++
      });
    };

    /*  $scope.addSlide2 = function (details) {
        slides2.push({
          image: details.productImageURL,
          proAddress: details.webAddress,
          desc: details.description,
          web: details.companyWebsite,
          text: details.Proname,
          id: currIndex++
        });
      };*/

    //    $scope.addSlide3 = function (details) {
    //      slides3.push({
    //        image: details.productImageURL,
    //        proAddress: details.webAddress,
    //        desc: details.description,
    //        web: details.companyWebsite,
    //        text: details.Proname,
    //        id: currIndex++
    //      });
    //    };




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
      //console.log('On-item-click');
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
      //console.log('On-search-change');
      //console.log('On-search-change - keyword: ' + data.keyword);
      //console.log('On-search-change - result: ');
      //console.log(data.result);
    }

    /*

        $scope.slides = [



          {

            title: 'STACKBOX: BEAUTIFUL SIMPLE AND CONNECTED',

            description: 'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',

            image: 'http://www.xkuty.com/images/xkuty.jpg',

                    },

          {

            title: 'XKUTY ONE: BEAUTIFUL SIMPLE AND CONNECTED',

            description: 'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',

            image: 'http://www.xkuty.com/images/xkuty.jpg',

                    },

          {

            title: 'STACKBOX: BEAUTIFUL SIMPLE AND CONNECTED',

            description: 'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',


            image: 'http://www.xkuty.com/images/xkuty.jpg',

                    }

                ];



              $scope.slides1 = [



          {

            title: 'STACKBOX: BEAUTIFUL SIMPLE AND CONNECTED',

            description: 'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',

            image: 'https://ksr-ugc.imgix.net/assets/011/803/987/bc382547b1160d0bce8400d1e6373f83_original.jpg?w=1536&h=864&fit=fill&bg=FFFFFF&v=1463696995&auto=format&q=92&s=427d1a7f748b5453324ee61a31be2f92',

                    },

          {

            title: 'XKUTY ONE: BEAUTIFUL SIMPLE AND CONNECTED',

            description: 'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',

            image: 'https://ksr-ugc.imgix.net/assets/011/803/987/bc382547b1160d0bce8400d1e6373f83_original.jpg?w=1536&h=864&fit=fill&bg=FFFFFF&v=1463696995&auto=format&q=92&s=427d1a7f748b5453324ee61a31be2f92',

                    },

          {

            title: 'STACKBOX: BEAUTIFUL SIMPLE AND CONNECTED',

            description: 'The first smart thermostat that doesnt think its smarter than  Most home thermostat are either extremely unattractive',


            image: 'http://www.xkuty.com/images/xkuty.jpg',

                    }

                ];
    */









    $scope.slidesarray = [
                   [

        {

          image: 'http://www.xkuty.com/images/xkuty.jpg',


          date: 'june 6,2016',

          title: 'Xkuty One',

          content: 'its fun to go quietly over the asp and get the city turning around to look at it easily and effortless.Leaving the funes and around to the noise behind while..'


                  },
        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',

          date: 'june 6,2016',

          title: 'Pulse O2',

          content: 'Track steps,running,calaries burned,elevation & distance.Measure heart rate & blood oxygen level with asingle touch Analyze funes and ..'


                  },
        {

          image: 'https://ksr-ugc.imgix.net/assets/011/803/987/bc382547b1160d0bce8400d1e6373f83_original.jpg?w=1536&h=864&fit=fill&bg=FFFFFF&v=1463696995&auto=format&q=92&s=427d1a7f748b5453324ee61a31be2f92',

          date: 'june 6,2016',

          title: 'Stack Box',

          content: 'With 16 infrared sensors and our patented HotSpot Sensor,Thermo finds the hottest spot and provides a highly accurate touch Analyze temperature..'


                  }],
                   [

        {

          image: 'http://g01.a.alicdn.com/kf/HTB1i0nJHVXXXXatXFXXq6xXFXXXf/Fashion-Health-Electronic-Devices-Bluetooth-Smart-Watch-LED-Display-Touch-Screen-Smartwatches-for-Android-IOS-mobile.jpg_640x640.jpg',


          date: 'june 6,2016',

          title: 'Xkuty One',

          content: 'Track steps,running,calaries burned,elevation & distance.Measure heart rate & blood oxygen level with a single touch Analyze your night..'


                  },
        {

          image: 'http://www.xkuty.com/images/xkuty.jpg',




          date: 'june 6,2016',

          title: 'Pulse O2',

          content: 'With 16 infrared sensors and our patented HotSpot Sensor,Thermo finds the hottest spot and provides a highly accurate temperature..'


                  },
        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',

          date: 'june 6,2016',

          title: 'Stack Box',

          content: 'its fun to go quietly over the asp and get the city turning around to look at it easily and effortless.Leaving the funes and around to the noise behind while..'


                  }],


                   [


        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',


          date: 'june 6,2016',

          title: 'Xkuty One',

          content: 'With 16 infrared sensors and our patented HotSpot Sensor,Thermo finds the hottest spot and provides a highly accurate touch Analyze temperature..'


                  },
        {

          image: 'http://www.xkuty.com/images/xkuty.jpg',




          date: 'june 6,2016',

          title: 'Pulse O2',

          content: 'Track steps,running,calaries burned,elevation & distance.Measure heart rate & blood oxygen level with a single touch Analyze your night..'


                  },
        {

          image: 'http://g01.a.alicdn.com/kf/HTB1i0nJHVXXXXatXFXXq6xXFXXXf/Fashion-Health-Electronic-Devices-Bluetooth-Smart-Watch-LED-Display-Touch-Screen-Smartwatches-for-Android-IOS-mobile.jpg_640x640.jpg',

          date: 'june 6,2016',

          title: 'Stack Box',

          content: 'its fun to go quietly over the asp and get the city turning around to look at it easily and effortless.Leaving the funes and around to the noise behind while..'


                  }]



              ];


    $scope.slidesarray1 = [

                   [

        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',


          date: 'june 6,2016',

          title: 'Xkuty One',

          content: 'its fun to go quietly over the asp and get the city turning around to look at it easily and effortless.Leaving the funes and around to the noise behind while..'


                  },
        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',

          date: 'june 6,2016',

          title: 'Pulse O2',

          content: 'Track steps,running,calaries burned,elevation & distance.Measure heart rate & blood oxygen level with asingle touch Analyze funes and ..'


                  },
        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',

          date: 'june 6,2016',

          title: 'Stack Box',

          content: 'With 16 infrared sensors and our patented HotSpot Sensor,Thermo finds the hottest spot and provides a highly accurate touch Analyze temperature..'


                  }],
                   [

        {

          image: 'http://g01.a.alicdn.com/kf/HTB1i0nJHVXXXXatXFXXq6xXFXXXf/Fashion-Health-Electronic-Devices-Bluetooth-Smart-Watch-LED-Display-Touch-Screen-Smartwatches-for-Android-IOS-mobile.jpg_640x640.jpg',


          date: 'june 6,2016',

          title: 'Xkuty One',

          content: 'Track steps,running,calaries burned,elevation & distance.Measure heart rate & blood oxygen level with a single touch Analyze your night..'


                  },
        {

          image: 'http://www.xkuty.com/images/xkuty.jpg',




          date: 'june 6,2016',

          title: 'Pulse O2',

          content: 'With 16 infrared sensors and our patented HotSpot Sensor,Thermo finds the hottest spot and provides a highly accurate temperature..'


                  },
        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',

          date: 'june 6,2016',

          title: 'Stack Box',

          content: 'its fun to go quietly over the asp and get the city turning around to look at it easily and effortless.Leaving the funes and around to the noise behind while..'


                  }],


                   [


        {

          image: 'http://cdn.toptenreviews.com/rev/scrn/medium/59964-withings-pulse3.jpg',


          date: 'june 6,2016',

          title: 'Xkuty One',

          content: 'With 16 infrared sensors and our patented HotSpot Sensor,Thermo finds the hottest spot and provides a highly accurate touch Analyze temperature..'


                  },
        {

          image: 'http://www.xkuty.com/images/xkuty.jpg',




          date: 'june 6,2016',

          title: 'Pulse O2',

          content: 'Track steps,running,calaries burned,elevation & distance.Measure heart rate & blood oxygen level with a single touch Analyze your night..'


                  },
        {

          image: 'http://g01.a.alicdn.com/kf/HTB1i0nJHVXXXXatXFXXq6xXFXXXf/Fashion-Health-Electronic-Devices-Bluetooth-Smart-Watch-LED-Display-Touch-Screen-Smartwatches-for-Android-IOS-mobile.jpg_640x640.jpg',

          date: 'june 6,2016',

          title: 'Stack Box',

          content: 'its fun to go quietly over the asp and get the city turning around to look at it easily and effortless.Leaving the funes and around to the noise behind while..'


                  }]



              ];





    /*   $scope.activeTab = false;

      $scope.selectTab1 = function() {
        $scope.activeTab = true;
      }
      $scope.clickTab1 = function() {
        $scope.activeTab = true;
      }
      $scope.clickTab2 = function() {
        $scope.activeTab = false;
      }*/

    $scope.activeTab = true;

    $scope.selectTab1 = function () {
      $scope.activeTab = false;
    }
    $scope.clickTab1 = function () {
      $scope.activeTab = true;
    }
    $scope.clickTab2 = function () {
      $scope.activeTab = false;
    }









}
]);
/*.directive("billgates",function(){


         console.log("entering into billgates directive");


         var linkfunction=function(scope,element,attrs){

             scope.title=attrs.title;
             scope.description=attrs.description;

             scope.img1=attrs.img1;
             scope.img2=attrs.img2;
             scope.img3=attrs.img3;


         }




         return{

             restrict:'E',

             templateUrl:'modules/core/client/views/billgates.html',

             link: linkfunction

         };

     })*/

/* .directive("ourclients",function(){

     console.log("entering into ourclients directive1");





     return{

         restrict:'E',

         scope:{

             ourclients:'='
         },

         templateUrl:'modules/core/client/views/new-tb-our-clients.html'


     };


 })*/





/*        .directive("tbFirstCarousel",function(){


           console.log("entering into tbFirstCarousel directive");


           return{

               restrict:'E',

               templateUrl:'modules/core/client/views/new-tb-first-carousel.html',

               link:function(scope,elem,attrs){


                   console.log("entering into tbFirstCarousel link function");

                   var options=attrs.options;

                   console.log("options are.." +options);


                   if(options.indexOf("p") !== -1) {

                       console.log("entering into premium products");

                       scope.showMeP = true;
                   }


                   if(options.indexOf("f") !== -1){

                       console.log("entering into feautured products");

                       scope.showMeF = true;
                   }

               }



           };

       })*/





/*
         .directive("tbSecondCarousel",function(){


            console.log("entering into tbSecondCarousel directive");



            return{

                restrict:'E',

                templateUrl:'modules/core/client/views/new-tb-second-carousel.html',

                  link:function(scope,elem,attrs){


                    console.log("entering into tbSecondCarousel link function");

                    var options=attrs.options;

                    console.log("options are.." +options);


                    if(options.indexOf("p") !== -1) {

                        console.log("entering into premium products");

                        scope.showMeP = true;
                    }


                    if(options.indexOf("f") !== -1){

                        console.log("entering into feautured products");

                        scope.showMeF = true;
                    }

                }



            };

        })*/
