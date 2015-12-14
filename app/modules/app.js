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
        hostName = 'daytonave.org',
        protocol = 'http:',
        wpUrl = protocol + '//' + hostName;

    angular.module('ngwordpress').constant('wpConfig', {
        hostName: hostName,
        protocol: protocol
    });

    var getWpPages = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/pages?per_page=500').then(function (result) {
            angular.module('ngwordpress').constant('wpPages', result.data);
        });
    };

    var getWpPosts = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/posts?per_page=500').then(function (result) {
            angular.module('ngwordpress').constant('wpPosts', result.data);
        });
    };

    var getWpMedia = function () {
        return $http.get(wpUrl + '/wp-json/wp/v2/media').then(function (result) {
            angular.module('ngwordpress').constant('wpMedia', result.data);
        });
    };

    var getWpMenu = function () {
        return $http.get(wpUrl + '/wp-json/wp-api-menus/v2/menus').then(function (result) {
            var mainMenu = window._.findWhere(result.data, { slug: 'main-menu' });
            if (mainMenu) {
                return $http.get(wpUrl + '/wp-json/wp-api-menus/v2/menus/' + mainMenu.ID).then(function (result) {
                    angular.module('ngwordpress').constant('wpMenu', result.data);
                });
            }
        });
    };

    var bootstrapApplication = function () {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['ngwordpress']);
        });
    };

    getWpPages()
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
    .value('replace_all_rel_by_abs', window.replace_all_rel_by_abs);
}());
