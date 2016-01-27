(function () {
    'use strict';

    angular.module('ngwordpress').directive('wpCarousel', function ($) {
        return {
            restrict: 'E',
            templateUrl: 'modules/components/carousel/carouselTemplate.html',
            controller: 'carouselController',
            scope: {},
            link: function () {
                angular.element(document).ready(function () {
                    $('.carousel').carousel({
                        interval: 5000
                    });
                });
            }
        };
    });
})();