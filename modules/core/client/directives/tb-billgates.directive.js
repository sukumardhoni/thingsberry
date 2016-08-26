
'use strict';
 angular.module('core').directive("tbBillgates",function(){


            console.log("entering into tbBillgates directive");


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

        });
