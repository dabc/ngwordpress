(function () {
    'use strict';

    var app = angular.module('ngWordpress', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute'
    ]);

    var getWpData = function () {
        var initInjector = angular.injector(['ng']),
            $http = initInjector.get('$http');

        return $http.get('http://daytonave.org/api/get_posts/?count=100&post_type=page').then(function (result) {
            angular.module('ngWordpress').constant('wpData', result.data);
        });
    };

    var bootstrapApplication = function () {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['ngWordpress']);
        });
    };

    getWpData().then(bootstrapApplication);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: 'modules/pages/home/homeTemplate.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .value('moment', window.moment)
    .value('_', window._);
}());
