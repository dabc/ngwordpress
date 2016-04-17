(function () {
    'use strict';

    var app = angular.module('ngwordpress', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'blockUI'
    ]);

    var initInjector = angular.injector(['ng']),
        $http = initInjector.get('$http'),
        wpUrl = '';

    var getWpConfig = function () {
        return $http.get('./config/wpConfig.json').then(function (response) {
            wpUrl = response.data.protocol + '//' + response.data.hostName;
            angular.module('ngwordpress').constant('wpConfig', response.data);
        });
    };

    var getWpPages = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/pages?per_page=100').then(function (response) {
            angular.module('ngwordpress').constant('wpPages', response.data);
        });
    };

    var getWpPosts = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/posts?per_page=100').then(function (response) {
            angular.module('ngwordpress').constant('wpPosts', response.data);
        });
    };

    var getWpMedia = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/media').then(function (response) {
            angular.module('ngwordpress').constant('wpMedia', response.data);
        });
    };

    var getWpMenu = function () {
        return $http.get(wpUrl + '/wp-json/wp-api-menus/v2/menus').then(function (response) {
            var mainMenu = window._.findWhere(response.data, { slug: 'main-menu' });
            if (mainMenu) {
                return $http.get(wpUrl + '/wp-json/wp-api-menus/v2/menus/' + mainMenu.ID).then(function (response) {
                    angular.module('ngwordpress').constant('wpMenu', response.data);
                });
            }
        });
    };

    var bootstrapApplication = function () {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['ngwordpress']);
        });
    };

    getWpConfig()
        .then(getWpPages)
        .then(getWpPosts)
        .then(getWpMedia)
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
    .value('$', window.$);
})();
