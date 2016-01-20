(function () {
    'use strict';

    angular.module('ngwordpress').directive('wpMenu', function () {
        return {
            restrict: 'E',
            templateUrl: 'modules/components/menu/menuTemplate.html',
            controller: 'menuController',
            scope: {}
        };
    });
})();