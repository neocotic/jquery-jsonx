/*!
 * jquery-jsonx v1.0.0
 * 
 * Copyright 2011, Alasdair Mercer
 * Freely distributable under the MIT license.
 * 
 * For all details and documentation:
 * http://neocotic.com/jquery-jsonx
 */

/**
 * <p>jQuery plugin to support XML to JSON transformations and vice versa.</p>
 * @author <a href="http://neocotic.com">Alasdair Mercer</a>
 * @version 1.0.0
 * @requires jQuery
 * @requires JSON
 */
(function ($, undefined) {
    var helper = {
        attributes: function (obj) {
            var ele = obj[0],
                i = 0,
                name,
                notXml = ele.nodeType !== 1 || !$.isXMLDoc(ele),
                ret = {};
            if (ele.attributes.length > 0) {
                for (; i < ele.attributes.length; i++) {
                    name = ele.attributes[i].name;
                    name = notXml && $.propFix[name] || name;
                    ret[name] = obj.attr(name);
                }
            }
            return ret;
        }
    };
    var api = {
        /**
         * <p>Builds jQuery based on the JSON provided.</p>
         * <p>If the argument is a string it is parsed in to JSON before being
         * processed.</p>
         * <p>The jQuery object is built in the same hierarchy in which it is
         * defined in the JSON structure and all attributes are transferred.</p>
         * @param {Object[]|String} value The JSON to be used for building the
         * jQuery object or a string representation of it.
         * @returns {jQuery} The jQuery object based on the JSON provided. This
         * can be empty.
         */
        build: function (value) {
            function convertJsonx(obj, parent) {
                var arr = [], ele = {};
                if ($.isArray(obj)) {
                    if (!obj.length || $.type(obj[0]) !== 'string') {
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
                } else if ($.type(obj) === 'string') {
                    parent.append(obj);
                }
                return parent;
            }
            if ($.type(value) === 'string') {
                value = api.parse(value);
            }
            if (!$.isArray(value)) {
                $.error('jsonx.build: Type error');
            }
            return convertJsonx(value, $('<x/>')).contents();
        },
        /**
         * <p>Parses the jQuery object or string provided in to JSON.</p>
         * <p>If the argument is a string it is parsed in to JSON. This
         * basically acts as a shortcut method to <code>JSON.parse</code> in
         * this case.</p>
         * <p>If no argument is specified the selected jQuery is parsed.</p>
         * <p>JSON is built in the same hierarchy in which it is defined in the
         * XML structure and all attributes are transferred.</p>
         * @param {jQuery|String} [value] The jQuery object to be parsed in to
         * JSON or a string to be JSONified.
         * @returns {Object[]} The JSON array created from parsing the jQuery
         * object or string input or the selected jQuery if there was none.
         * This may not be an array if a string argument was provided that did
         * not represent an array.
         */
        parse: function (value) {
            function convertJQuery(obj) {
                var ret = [];
                obj.each(function () {
                    var $this = $(this),
                        attrs = {},
                        contents = $this.contents(),
                        i = 0;
                    Array.prototype.push.call(ret,
                            this.nodeName.toLowerCase());
                    attrs = helper.attributes($this);
                    if (!$.isEmptyObject(attrs)) {
                        Array.prototype.push.call(ret, attrs);
                    }
                    if (contents.length) {
                        for (; i < contents.length; i++) {
                            if (contents[i].nodeType === 3) {
                                Array.prototype.push.call(ret,
                                        contents[i].textContent);
                            } else {
                                Array.prototype.push.call(ret,
                                        convertJQuery($(contents[i])));
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
            $.error('jsonx.parse: Type error');
        },
        /**
         * <p>Transforms the jQuery object or JSON provided in to a string
         * representation of themselves.</p>
         * <p>If the argument is a jQuery object then it is parsed in to JSON
         * before being transformed in to a string.</p>
         * <p>If no argument is specified the selected jQuery parsed in to JSON
         * and then transformed in to a string.</p>
         * @param {jQuery|Object[]} [value] The jQuery object or JSON to be
         * transformed in to a string.
         * @return {String} The string representation of the input provided or
         * the selected jQuery if there was none.
         */
        stringify: function (value) {
            if (value === undefined) {
                value = api.parse(this);
            } else if ($.type(value) === 'object' && value.jquery) {
                value = api.parse(value);
            } else if (!$.isArray(value)) {
                $.error('jsonx.stringify: Type error');
            }
            return JSON.stringify(value);
        }
    };
    $.fn.jsonx = function (arg) {
        if (api[arg]) {
            return api[arg].apply(this,
                    Array.prototype.slice.call(arguments, 1));
        }
        return api.build.apply(this, arguments);
    };
}(jQuery));