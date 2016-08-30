 'use strict';
 angular.module('core')
         .directive("tbTabs",function(){


            console.log("entering into tbTabs directive");

        return{

            restrict:"E",

            templateUrl:'modules/core/client/views/new-tb-tabs.html',
        }

 })   .directive("tbSmTabs",function(){


            console.log("entering into tbSmTabs directive");

        return{

            restrict:"E",

            templateUrl:'modules/core/client/views/new-tb-sm-tabs.html',
        }

 }) .directive("tbXsTabs",function(){


            console.log("entering into tbXsTabs directive");

        return{

            restrict:"E",

            templateUrl:'modules/core/client/views/new-tb-xs-tabs.html',
        }

 });
