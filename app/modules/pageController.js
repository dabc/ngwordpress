(function () {
    'use strict';

    angular.module('ngwordpress').controller('pageController', function ($scope, $routeParams, wpPages, wpPosts, Page, _) {
        var page = {};

        $scope.showCarousel = false;

        if ($routeParams.page) {
            var route = $routeParams.page.replace(/\/?$/, '/'); // add trailing slash if not present

            page = _.find(wpPages, function (d) {
                var link = d.link.replace(/^(?:\/\/|[^\/]+)*\//, ''); // get link url starting after domain name
                return link === route;
            });

            // hide carousel
            $scope.showCarousel = false;
        } else {
            // user requested home route
            page = _.find(wpPages, function (d) {
                return d.title.rendered === 'Home';
            });

            // show carousel
            $scope.showCarousel = true;
        }

        page = Page.transformer(page);
        $scope.pageHtml = page.formatHtml();

        var initialize = function () {

        };

        initialize();
    });
})();
