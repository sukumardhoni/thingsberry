 'use strict';
 angular.module('core')
         .directive("tbSecondCarousel",function(){


            console.log("entering into tbSecondCarousel directive");



            return{

                restrict:'E',

                templateUrl:'modules/core/client/views/new-tb-second-carousel.html',

                  link:function(scope,elem,attrs){


                    console.log("entering into tbSecondCarousel link function");

                    var options=attrs.options;

                    console.log("option choice is.." +options);


                    if(options.indexOf("p") !== -1) {

                        console.log("entering into premium products");

                        scope.showMeM = true;
                    }


                    if(options.indexOf("f") !== -1){

                        console.log("entering into feautured products");

                        scope.showMeB = true;
                    }

                }



            };

        })
