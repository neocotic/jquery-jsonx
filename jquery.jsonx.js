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
 * (jQuery) $(*).jsonx(String|Array);
 * (jQuery) $.jsonx(String|Array);
 * (jQuery) $(*).jsonx('build', String|Array);
 * (jQuery) $.jsonx('build', String|Array);
 * (Array) $(*).jsonx('parse', String|jQuery);
 * (Array) $.jsonx('parse', String|jQuery);
 * (String) $(*).jsonx('stringify', Array|jQuery);
 * (String) $.jsonx('stringify', Array|jQuery);
 * 
 * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
 * @requires jQuery
 */
(function ($, undefined) {
    var helper = {
        attributes: function (obj) {
            var ele = obj[0], i = 0, name, notXml = ele.nodeType !== 1 || !$.isXMLDoc(ele), ret = {};
            if (ele.attributes.length > 0) {
                for (; i < ele.attributes.length; i++) {
                    name = ele.attributes[i].name;
                    name = notXml && $.propFix[name] || name;
                    map[name] = obj.attr(name);
                }
            }
            return ret;
        }
    };
    var api = {
        /**
         * <p></p>
         * @param {String|Array} value
         * @returns {jQuery}
         */
        build: function (value) {
            function convertJsonx(obj, parent) {
                var arr = [], ele = {};
                if ($.isArray(obj)) {
                    if (!obj.length || $.type(obj[0]) !== 'string') {
                        $.error('JSONX.build: Syntax error');
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
                } else if ($.type(obj) === 'string') {
                    parent.append(obj);
                }
                return parent;
            }
            if ($.type(value) === 'string') {
                value = api.parse(value);
            }
            if (!$.isArray(value)) {
                $.error('JSONX.build: Type error');
            }
            return convertJsonx(value, $('<x/>')).contents();
        },
        /**
         * <p></p>
         * @param {String|jQuery} [value]
         * @returns {Array}
         */
        parse: function (value) {
            function convertJQuery(obj) {
                var ret = [];
                obj.each(function () {
                    var $this = $(this), attrs = {}, contents = $this.contents(), i = 0;
                    Array.prototype.push.call(ret, this.nodeName.toLowerCase());
                    attrs = helper.attributes($this);
                    if (!$.isEmptyObject(attrs)) {
                        Array.prototype.push.call(ret, attrs);
                    }
                    if (contents.length) {
                        for (; i < contents.length; i++) {
                            if (contents[i].nodeType === 3) {
                                Array.prototype.push.call(ret, contents[i].textContent);
                            } else {
                                Array.prototype.push.call(ret, convertJQuery($(contents[i])));
                            }
                        }
                    }
                });
                return ret;
            }
            if (value === undefined) {
                value = this;
            }
            switch ($.type(value)) {
                case 'string':
                    return JSON.parse(value);
                case 'object':
                    return convertJQuery($(value));
            }
            $.error('JSONX.parse: Type error');
        },
        /**
         * <p></p>
         * @param {Array|jQuery} [value]
         * @return {String}
         */
        stringify: function (value) {
            if (value === undefined) {
                value = api.parse(this);
            } else if ($.type(value) === 'object' && value.jquery) {
                value = api.parse(value);
            } else if (!$.isArray(value)) {
                $.error('JSONX.stringify: Type error');
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