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

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: 'modules/pages/home/homeTemplate.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .value('moment', window.moment)
    .value('_', window._);
}());

(function () {
    'use strict';

    angular.module('ngWordpress').constant('wpConfig', {
        apiUrl: 'http://daytonave.org/api',
        hostName: 'daytonave.org',
        protocol: 'http:'
    });
}());

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

(function () {
    'use strict';

    angular.module('ngWordpress').factory('Page', ['wpConfig', 'Attachment', 'Author', function (wpConfig, Attachment, Author) {
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
    }]);
}());

(function () {
    'use strict';

    angular.module('ngWordpress').service('wpService', ['$http', '$q', 'wpConfig', 'Page', function ($http, $q, wpConfig, Page) {
        return {

        };
    }]);
}());

(function () {
    'use strict';

    angular.module('ngWordpress').controller('wpPageController', ['$scope', 'wpData', 'Page', '_', function ($scope, wpData, Page, _) {
        $scope.page = {};

        var initialize = function () {
            var param = $scope.id ? { id: $scope.id } : { slug: $scope.slug };
            $scope.page = Page.transformer(_.findWhere(wpData.posts, param));
        };

        initialize();
    }]).directive('wpPage', function () {
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

(function () {
    'use strict';

    angular.module('ngWordpress').controller('homeController', ['$scope', function ($scope) {
        var initialize = function () {

        };

        initialize();
    }]);
}());

function replace_all_rel_by_abs(html, targetUrl, targetHost, targetProtocol) {
    /*HTML/XML Attribute may not be prefixed by these characters (common
     attribute chars.  This list is not complete, but will be sufficient
     for this function (see http://www.w3.org/TR/REC-xml/#NT-NameChar). */
    var att = "[^-a-z0-9:._]";

    var entityEnd = "(?:;|(?!\\d))";
    var ents = {
        " ": "(?:\\s|&nbsp;?|&#0*32" + entityEnd + "|&#x0*20" + entityEnd + ")",
        "(": "(?:\\(|&#0*40" + entityEnd + "|&#x0*28" + entityEnd + ")",
        ")": "(?:\\)|&#0*41" + entityEnd + "|&#x0*29" + entityEnd + ")",
        ".": "(?:\\.|&#0*46" + entityEnd + "|&#x0*2e" + entityEnd + ")"
    };

    /* Placeholders to filter obfuscations */
    var charMap = {};
    var s = ents[" "] + "*";
    var myany = "(?:[^>\"']*(?:\"[^\"]*\"|'[^']*'))*?[^>]*";

    /* ^ Important: Must be pre- and postfixed by < and >.
     *   This RE should match anything within a tag!  */
    /*
     @name ae
     @description  Converts a given string in a sequence of the original
     input and the HTML entity
     @param String string  String to convert
     */
    function ae(mystring) {
        var all_chars_lowercase = mystring.toLowerCase();
        if (ents[mystring])
            return ents[mystring];
        var all_chars_uppercase = mystring.toUpperCase();
        var RE_res = "";
        for (var i = 0; i < mystring.length; i++) {
            var char_lowercase = all_chars_lowercase.charAt(i);
            if (charMap[char_lowercase]) {
                RE_res += charMap[char_lowercase];
                continue;
            }
            var char_uppercase = all_chars_uppercase.charAt(i);
            var RE_sub = [char_lowercase];
            RE_sub.push("&#0*" + char_lowercase.charCodeAt(0) + entityEnd);
            RE_sub.push("&#x0*" + char_lowercase.charCodeAt(0).toString(16) + entityEnd);
            if (char_lowercase != char_uppercase) {
                /* Note: RE ignorecase flag has already been activated */
                RE_sub.push("&#0*" + char_uppercase.charCodeAt(0) + entityEnd);
                RE_sub.push("&#x0*" + char_uppercase.charCodeAt(0).toString(16) + entityEnd);
            }
            RE_sub = "(?:" + RE_sub.join("|") + ")";
            RE_res += (charMap[char_lowercase] = RE_sub);
        }
        return (ents[mystring] = RE_res);
    }

    function rel_to_abs(url) {
        if (/^(https?|file|ftps?|mailto|javascript|data:image\/[^;]{2,9};):/i.test(url))
            return url;

        var base_url = targetUrl.match(/^(.+)\/?(?:#.+)?$/)[0] + '/';
        if (url.substring(0, 2) == "//")
            return targetProtocol + url;
        else if (url.charAt(0) == "/")
            return targetProtocol + "//" + targetHost + url;
        else if (url.substring(0, 2) == "./")
            url = "." + url;
        else if (/^\s*$/.test(url))
            return "";
        else
            url = "../" + url;

        url = base_url + url;
        var i = 0;
        while (/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g, "")))
            ;

        /* Escape certain characters to prevent XSS */
        url = url.replace(/\.$/, "").replace(/\/\./g, "").replace(/"/g, "%22").replace(/'/g, "%27").replace(/</g, "%3C").replace(/>/g, "%3E");
        return url;
    }

    ///*
    //  @name by
    //  @description  2nd argument for replace().
    //  */
    function by2(match, group1, group2, group3) {
        /* Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
        return group1 + rel_to_abs(group2) + group3;
    }

    /*
     @name by
     @description  2nd argument for replace(). Parses relevant HTML entities
     */
    var slashRE = new RegExp(ae("/"), 'g');
    var dotRE = new RegExp(ae("."), 'g');
    function by(match, group1, group2, group3) {
        /*Note that this function can also be used to remove links:
         * return group1 + "javascript://" + group3; */
        group2 = group2.replace(slashRE, "/").replace(dotRE, ".");
        return group1 + rel_to_abs(group2) + group3;
    }

    /*
     @name cr
     @description            Selects a HTML element and performs a
     search-and-replace on attributes
     @param String selector  HTML substring to match
     @param String attribute RegExp-escaped; HTML element attribute to match
     @param String marker    Optional RegExp-escaped; marks the prefix
     @param String delimiter Optional RegExp escaped; non-quote delimiters
     @param String end       Optional RegExp-escaped; forces the match to end
     before an occurence of <end>
     */
    function cr(selector, attribute, marker, delimiter, end) {
        if (typeof selector == "string")
            selector = new RegExp(selector, "gi");
        attribute = att + attribute;
        marker = typeof marker == "string" ? marker : "\\s*=\\s*";
        delimiter = typeof delimiter == "string" ? delimiter : "";
        end = typeof end == "string" ? "?)(" + end : ")(";
        var re1 = new RegExp('(' + attribute + marker + '")([^"' + delimiter + ']+' + end + ')', 'gi');
        var re2 = new RegExp("(" + attribute + marker + "')([^'" + delimiter + "]+" + end + ")", 'gi');
        var re3 = new RegExp('(' + attribute + marker + ')([^"\'][^\\s>' + delimiter + ']*' + end + ')', 'gi');
        html = html.replace(selector, function (match) {
            return match.replace(re1, by).replace(re2, by).replace(re3, by);
        });
    }

    /*
     @name cri
     @description            Selects an attribute of a HTML element, and
     performs a search-and-replace on certain values
     @param String selector  HTML element to match
     @param String attribute RegExp-escaped; HTML element attribute to match
     @param String front     RegExp-escaped; attribute value, prefix to match
     @param String flags     Optional RegExp flags, default "gi"
     @param String delimiter Optional RegExp-escaped; non-quote delimiters
     @param String end       Optional RegExp-escaped; forces the match to end
     before an occurence of <end>
     */
    function cri(selector, attribute, front, flags, delimiter, end) {
        if (typeof selector == "string")
            selector = new RegExp(selector, "gi");
        attribute = att + attribute;
        flags = typeof flags == "string" ? flags : "gi";
        var re1 = new RegExp('(' + attribute + '\\s*=\\s*")([^"]*)', 'gi');
        var re2 = new RegExp("(" + attribute + "\\s*=\\s*')([^']+)", 'gi');
        var at1 = new RegExp('(' + front + ')([^"]+)(")', flags);
        var at2 = new RegExp("(" + front + ")([^']+)(')", flags);
        var handleAttr = function () {};
        if (typeof delimiter == "string") {
            end = typeof end == "string" ? end : "";
            var at3 = new RegExp("(" + front + ")([^\"'][^" + delimiter + "]*" + (end ? "?)(" + end + ")" : ")()"), flags);
            handleAttr = function (match, g1, g2) {
                return g1 + g2.replace(at1, by).replace(at2, by).replace(at3, by);
            };
        } else {
            handleAttr = function (match, g1, g2) {
                return g1 + g2.replace(at1, by).replace(at2, by);
            };
        }
        html = html.replace(selector, function (match) {
            return match.replace(re1, handleAttr).replace(re2, handleAttr);
        });
    }

    /* <meta http-equiv=refresh content="  ; url= " > */
    cri("<meta" + myany + att + "http-equiv\\s*=\\s*(?:\"" + ae("refresh") + "\"" + myany + ">|'" + ae("refresh") + "'" + myany + ">|" + ae("refresh") + "(?:" + ae(" ") + myany + ">|>))", "content", ae("url") + s + ae("=") + s, "i", undefined, undefined);

    cr("<" + myany + att + "href\\s*=" + myany + ">", "href", undefined, undefined, undefined);
    cr("<" + myany + att + "src\\s*=" + myany + ">", "src", undefined, undefined, undefined);

    cr("<object" + myany + att + "data\\s*=" + myany + ">", "data", undefined, undefined, undefined);
    cr("<applet" + myany + att + "codebase\\s*=" + myany + ">", "codebase", undefined, undefined, undefined);

    /* <param name=movie value= >*/
    cr("<param" + myany + att + "name\\s*=\\s*(?:\"" + ae("movie") + "\"" + myany + ">|'" + ae("movie") + "'" + myany + ">|" + ae("movie") + "(?:" + ae(" ") + myany + ">|>))", "value", undefined, undefined, undefined);

    cr(/<style[^>]*>(?:[^"']*(?:"[^"]*"|'[^']*'))*?[^'"]*(?:<\/style|$)/gi, "url", "\\s*\\(\\s*", "", "\\s*\\)");
    cri("<" + myany + att + "style\\s*=" + myany + ">", "style", ae("url") + s + ae("(") + s, 0, s + ae(")"), ae(")"));
    return html;
}