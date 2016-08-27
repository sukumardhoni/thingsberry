'use strict';
 angular.module('core').directive("tbFirstCarousel",function(){


            console.log("entering into tbFirstCarousel directive");


            return{

                restrict:'E',

                templateUrl:'modules/core/client/views/new-tb-first-carousel.html',


              /*  link:function(scope,elem,attrs){


                    console.log("entering into tbFirstCarousel link function");

                    var options=attrs.options;

                    console.log("option choice is.." +options);


                    if(options.indexOf("p") !== -1) {

                        console.log("entering into premium products");

                        scope.showMeP = true;
                    }


                    if(options.indexOf("f") !== -1){

                        console.log("entering into feautured products");

                        scope.showMeF = true;
                    }

                }*/



            };

        })
