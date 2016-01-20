(function () {
    'use strict';

    angular.module('ngwordpress').factory('Page', function (wpConfig, moment, $, _) {
        var Page = function (_links, author, comment_status, content, date, date_gmt, excerpt, featured_image, guid, id, link, menu_order, modified, modified_gmt, parent, ping_status, slug, template, title, type) {
            this._links = _links;
            this.author = author;
            this.comment_status = comment_status;
            this.content = content;
            this.date = moment(date).format('MMMM DD, YYYY h:mm a');
            this.date_gmt = moment.utc(date_gmt).format('MMMM DD, YYYY h:mm a');
            this.excerpt = excerpt;
            this.featured_image = featured_image;
            this.guid = guid;
            this.id = id;
            this.link = link;
            this.menu_order = menu_order;
            this.modified = moment(modified).format('MMMM DD, YYYY h:mm a');
            this.modified_gmt = moment.utc(modified_gmt).format('MMMM DD, YYYY h:mm a');
            this.parent = parent;
            this.ping_status = ping_status;
            this.slug = slug;
            this.template = template;
            this.title = title;
            this.type = type;
        };

        Page.prototype = {
            formatHtml: function () {
                var content = $(this.content.rendered),
                    absLinks = content.find('a[href*="' + wpConfig.hostName + '"]'),
                    relLinks = content.find('a[href^="/"]'),
                    returnStr = '';

                _.forEach(absLinks, function (l) {
                    if (l.pathname.split('.').length === 1) {
                        l.href = '/#' + l.pathname;
                    }
                });

                _.forEach(relLinks, function (l) {
                    if (l.pathname.split('.').length === 1) {
                        l.href = '/#' + l.pathname;
                    }
                });

                _.forEach(content, function (c) {
                    if (c.outerHTML) {
                        returnStr += c.outerHTML;
                    }
                });

                return returnStr;
            }
        };

        Page.build = function (data) {
            if (data) {
                return new Page(
                    data._links,
                    data.author,
                    data.comment_status,
                    data.content,
                    data.date,
                    data.date_gmt,
                    data.excerpt,
                    data.featured_image,
                    data.guid,
                    data.id,
                    data.link,
                    data.menu_order,
                    data.modified,
                    data.modified_gmt,
                    data.parent,
                    data.ping_status,
                    data.slug,
                    data.template,
                    data.title,
                    data.type
                );
            }
            return new Page();
        };

        Page.transformer = function (data) {
            if (angular.isArray(data)) {
                return data
                    .map(Page.build);
            }
            return Page.build(data);
        };

        return Page;
    });
})();
