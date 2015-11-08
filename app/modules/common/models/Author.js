(function () {
    'use strict';

    angular.module('ngWordpress').factory('Author', function () {
        var Author = function (description, firstName, id, lastName, name, nickname, slug, url) {
            this.description = description;
            this.firstName = firstName;
            this.id = id;
            this.lastName = lastName;
            this.name = name;
            this.nickname = nickname;
            this.slug = slug;
            this.url = url;
        };

        Author.prototype = {

        };

        Author.build = function (data) {
            if (data) {
                return new Author(
                    data.description,
                    data.first_name,
                    data.id,
                    data.last_name,
                    data.name,
                    data.nickname,
                    data.slug,
                    data.url
                );
            }
            return new Author();
        };

        Author.transformer = function (data) {
            if (angular.isArray(data)) {
                return data
                    .map(Author.build)
                    .filter(Boolean);
            }
            return Author.build(data);
        };

        return Author;
    });
}());
