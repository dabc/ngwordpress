(function () {
    'use strict';

    angular.module('ngwordpress').controller('pageController', function ($scope, $routeParams, wpPages, wpPosts, Page, _) {
        var page = {};

        if ($routeParams.page) {
            var route = $routeParams.page.replace(/\/?$/, '/'); // add trailing slash if not present

            page = _.find(wpPages, function (d) {
                var link = d.link.replace(/^(?:\/\/|[^\/]+)*\//, ''); // get link url starting after domain name
                return link === route;
            });
        } else {
            // user requested home route
            page = _.find(wpPages, function (d) {
                return d.title.rendered === 'Home';
            });
        }

        $scope.page = Page.transformer(page);

        var initialize = function () {

        };

        initialize();
    });
}());
