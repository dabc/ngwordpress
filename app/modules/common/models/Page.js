(function () {
    'use strict';

    angular.module('ngWordpress').factory('Page', function (wpConfig, Attachment, Author) {
        var Page = function (attachments, author, categories, commentCount, commentStatus, comments, content, customFields, date, excerpt, id, modified, slug, status, tags, title, titlePlain, type, url) {
            this.attachments = Attachment.transformer(attachments);
            this.author = Author.transformer(author);
            this.categories = categories;
            this.commentCount = commentCount;
            this.commentStatus = commentStatus;
            this.comments = comments;
            this.content = content;
            this.customFields = customFields;
            this.date = moment(date).format('MMMM DD, YYYY h:mm a');
            this.excerpt = excerpt;
            this.id = id;
            this.modified = modified;
            this.slug = slug;
            this.status = status;
            this.tags = tags;
            this.title = title;
            this.titlePlain = titlePlain;
            this.type = type;
            this.url = url;
        };

        Page.prototype = {
            formatHtml: function () {
                return replace_all_rel_by_abs(this.content, this.url, wpConfig.hostName, wpConfig.protocol);
            }
        };

        Page.build = function (data) {
            if (data) {
                return new Page(
                    data.attachments,
                    data.author,
                    data.categories,
                    data.comment_count,
                    data.comment_status,
                    data.comments,
                    data.content,
                    data.custom_fields,
                    data.date,
                    data.excerpt,
                    data.id,
                    data.modified,
                    data.slug,
                    data.status,
                    data.tags,
                    data.title,
                    data.title_plain,
                    data.type,
                    data.url
                );
            }
            return new Page();
        };

        Page.transformer = function (data) {
            if (angular.isArray(data)) {
                return data
                    .map(Page.build)
                    .filter(Boolean);
            }
            return Page.build(data);
        };

        return Page;
    });
}());
