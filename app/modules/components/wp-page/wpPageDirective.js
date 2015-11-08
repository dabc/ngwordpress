(function () {
    'use strict';

    angular.module('ngWordpress').controller('wpPageController', function ($scope, wpData, Page, _) {
        $scope.page = {};

        var initialize = function () {
            var param = $scope.id ? { id: $scope.id } : { slug: $scope.slug };
            $scope.page = Page.transformer(_.findWhere(wpData.posts, param));
        };

        initialize();
    }).directive('wpPage', function () {
        return {
            controller: 'wpPageController',
            templateUrl: 'modules/components/wp-page/wpPageDirectiveTemplate.html',
            restrict: 'E',
            scope: {
                id: '=',
                slug: '='
            }
        };
    });
}());
