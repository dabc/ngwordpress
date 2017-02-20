(function () {
    'use strict';

    angular.module('ngwordpress').controller('carouselController', function ($scope, wpMedia, _) {
        $scope.sliderImages = _.filter(wpMedia, { caption: 'carousel' });
    });
})();
