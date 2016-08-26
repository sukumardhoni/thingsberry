'use strict';
 angular.module('core').directive("tbOurclients",function(){

            console.log("entering into tbOurclients directive1");


            return{

                restrict:'E',

                scope:{

                    ourclients:'='
                },

                templateUrl:'modules/core/client/views/new-tb-our-clients.html'


            };


        });
