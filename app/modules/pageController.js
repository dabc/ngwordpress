(function () {
    'use strict';

    angular.module('ngWordpress').controller('pageController', function ($scope, $routeParams, wpData, Page, _) {
        var data = wpData,
            route = $routeParams.page.replace(/\/?$/, '/'); // add trailing slash if not present

        var page = _.find(data, function (d) {
            var link = d.link.replace(/^(?:\/\/|[^\/]+)*\//, '');
            return link === route;
        });

        $scope.page = Page.transformer(page);

        var initialize = function () {

        };

        initialize();
    });
}());
