(function () {
    'use strict';

    var app = angular.module('ngWordpress', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute'
    ]);

    var initInjector = angular.injector(['ng']),
        $http = initInjector.get('$http'),
        hostName = 'daytonave.org',
        protocol = 'http:',
        wpUrl = protocol + '//' + hostName;

    angular.module('ngWordpress').constant('wpConfig', {
        hostName: hostName,
        protocol: protocol
    });

    var getWpData = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/pages?per_page=100').then(function (result) {
            angular.module('ngWordpress').constant('wpData', result.data);
        });
    };

    var getWpMenu = function () {
        return $http.get(wpUrl + '/wp-json/wp-api-menus/v2/menus').then(function (result) {
            var mainMenu = window._.findWhere(result.data, { slug: 'main-menu' });
            if (mainMenu) {
                $http.get(wpUrl + '/wp-json/wp-api-menus/v2/menus/' + mainMenu.ID).then(function (result) {
                    angular.module('ngWordpress').constant('wpMenu', result.data);
                });
            }
        });
    };

    var bootstrapApplication = function () {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['ngWordpress']);
        });
    };

    getWpData()
        .then(getWpMenu)
        .then(bootstrapApplication);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/:page*', {
                controller: 'pageController',
                templateUrl: 'modules/pageTemplate.html'
            })
            .when('/', {
                controller: 'pageController',
                templateUrl: 'modules/pageTemplate.html'
            });
    })
    .value('moment', window.moment)
    .value('_', window._)
    .value('replace_all_rel_by_abs', window.replace_all_rel_by_abs);
}());
