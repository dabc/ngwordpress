(function () {
    'use strict';

    angular.module('ngWordpress').factory('Attachment', function () {
        var Attachment = function (caption, description, id, images, mimeType, parent, slug, title, url) {
            this.caption = caption;
            this.description = description;
            this.id = id;
            this.images = images;
            this.mimeType = mimeType;
            this.parent = parent;
            this.slug = slug;
            this.title = title;
            this.url = url;
        };

        Attachment.prototype = {

        };

        Attachment.build = function (data) {
            if (data) {
                return new Attachment(
                    data.caption,
                    data.description,
                    data.id,
                    data.images,
                    data.mime_type,
                    data.parent,
                    data.slug,
                    data.title,
                    data.url
                );
            }
            return new Attachment();
        };

        Attachment.transformer = function (data) {
            if (angular.isArray(data)) {
                return data
                    .map(Attachment.build)
                    .filter(Boolean);
            }
            return Attachment.build(data);
        };

        return Attachment;
    });
}());
