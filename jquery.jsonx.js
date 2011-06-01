/**
 * Structure:
 * 
 * element
 *   = '[' tag-name ',' attributes ',' element-list ']'
 *   | '[' tag-name ',' attributes ']'
 *   | '[' tag-name ',' element-list ']'
 *   | '[' tag-name ']'
 *   | string
 *   ;
 * tag-name
 *   = string
 *   ;
 * attributes
 *   = '{' attribute-list '}'
 *   | '{' '}'
 *   ;
 * attribute-list
 *   = attribute ',' attribute-list
 *   | attribute
 *   ;
 * attribute
 *   = attribute-name ':' attribute-value
 *   ;
 * attribute-name
 *   = string
 *   ;
 * attribute-value
 *   = string
 *   | number
 *   | 'true'
 *   | 'false'
 *   | 'null'
 *   ;
 * element-list
 *   = element ',' element-list
 *   | element
 *   ;
 * 
 * Usage:
 * 
 * (jQuery) $(*).jsonx(''|[]);
 * (jQuery) $.jsonx(''|[]);
 * (jQuery) $(*).jsonx('build', ''|[]);
 * (jQuery) $.jsonx('build', ''|[]);
 * (Array) $(*).jsonx('parse', ''|jQuery);
 * (Array) $.jsonx('parse', ''|jQuery);
 * (String) $(*).jsonx('stringify', []|jQuery);
 * (String) $.jsonx('stringify', []|jQuery);
 * 
 * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
 * @requires jQuery
 */
(function ($) {
    var api = {
        /**
         * <p></p>
         * @param {String|Array} value The JSONX string or array to be
         * transformed in to a jQuery object.
         * @returns {jQuery} The generated jQuery object.
         */
        build: function (value) {
            function convertJsonx(obj, parent) {
                var arr = [],
                    ele = {};
                if ($.isArray(obj)) {
                    if (!obj.length || typeof obj[0] !== 'string') {
                        $.error('jsonx.build: Syntax error');
                    }
                    ele = $(document.createElement(obj[0]));
                    if (obj.length > 1) {
                        if ($.isPlainObject(obj[1])) {
                            ele.attr(obj[1]);
                            if (obj.length > 2) {
                                arr = Array.prototype.slice.call(obj, 2);
                            }
                        } else {
                            arr = Array.prototype.slice.call(obj, 1);
                        }
                        if (arr.length) {
                            convertJsonx(arr, ele);
                        }
                    }
                } else if (typeof obj === 'string') {
                    parent.append(obj);
                }
                return parent;
            }
            if (typeof value === 'string') {
                value = api.parse(value);
            }
            return convertJsonx(value, $('<x/>')).contents();
        },
        /**
         * <p></p>
         * @param {String|jQuery} [value] The JSONX string to be parsed or the
         * jQuery object to be transformed in to a JSONX array. If omitted, an
         * attempt will be made to transform the current jQuery object.
         * @returns {Array} The generated JSONX array.
         */
        parse: function (value) {
            function convertJQuery(obj) {
                var ret = [];
                obj.each(function () {
                    var $this = $(this),
                        attrs = {},
                        contents = $this.contents(),
                        i;
                    ret.push(this.nodeName.toLowerCase());
                    // TODO: Ensure logic is sound and no mapping is required (e.g. for keywords)
                    if (this.attributes.length) {
                        for (i = 0; i < this.attributes.length; i++) {
                            attrs[this.attributes[i].name] = this.attributes[i].value;
                        }
                        ret.push(attrs);
                    }
                    if (contents.length) {
                        for (i = 0; i < contents.length; i++) {
                            if (contents[i].nodeType === 3) {
                                ret.push(contents[i].textContent);
                            } else {
                                ret.push(convertJQuery($(contents[i])));
                            }
                        }
                    }
                });
                return ret;
            }
            if (typeof value === 'string') {
                return JSON.parse(value);
            }
            value = value || this;
            return convertJQuery($(value));
        },
        /**
         * <p></p>
         * @param {String|jQuery} [value] The JSONX array or jQuery object to be
         * transformed in to a JSONX string. If omitted, an attempt will be made
         * to transform the current jQuery object.
         * @return {String} The generated JSONX string.
         */
        stringify: function (value) {
            if (typeof value === 'undefined') {
                value = api.parse(this);
            } else if (typeof value.jquery === 'string') {
                value = api.parse(value);
            }
            return JSON.stringify(value);
        }
    };
    $.fn.jsonx = function (arg) {
        if (api[arg]) {
            return api[arg].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        return api.build.apply(this, arguments);
    };
})(jQuery);