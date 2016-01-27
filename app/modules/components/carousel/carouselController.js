(function () {
    'use strict';

    angular.module('ngwordpress').controller('carouselController', function ($scope, wpMedia, _) {
        $scope.sliderImages = _.where(wpMedia, { caption: 'carousel' });
    });
})();