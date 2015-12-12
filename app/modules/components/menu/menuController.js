(function () {
    'use strict';

    angular.module('ngwordpress').controller('menuController', function ($scope, wpMenu) {
        $scope.links = wpMenu.items;

        $scope.formatUrl = function (url) {
            return url.replace(/^(?:\/\/|[^\/]+)*\//, ''); // get link url starting after domain name
        };
    });
}());
