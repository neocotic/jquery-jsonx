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
 * (Object) $(*).jsonx();
 * (Object) $.jsonx(*);
 * (jQuery) $(*).jsonx('parse', ''|{});
 * (jQuery) $.jsonx('parse', ''|{});
 * (String) $(*).jsonx('stringify');
 * (String) $.jsonx('stringify', {});
 * @author <a href="http://github.com/neocotic">Alasdair Mercer</a>
 */
(function ($) {
    var methods = {
        init: function (value) {
            function convertJQuery(obj) {
                var ret = [];
                obj.each(function () {
                    var $this = $(this),
                        attrs = {},
                        contents = $this.contents(),
                        i;
                    ret.push(this.nodeName.toLowerCase());
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
            if (typeof value !== 'undefined') {
                return convertJQuery($(value));
            }
            return convertJQuery(this);
        },
        parse: function (value) {
            function convertJsonx(obj, parent) {
                var arr = [],
                    ele = {};
                if ($.isArray(obj)) {
                    if (!obj.length || typeof obj[0] !== 'string') {
                        throw new SyntaxError('JSONX.parse');
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
                value = JSON.parse(value);
            }
            // TODO: Should this be children()?
            return convertJsonx(value, $('<x/>')).contents();
        },
        stringify: function (value) {
            if (typeof value === 'undefined') {
                value = this.jsonx();
            }
            return JSON.stringify(value);
        }
    };
    $.fn.jsonx = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        return methods.init.apply(this, arguments);
    };
})(jQuery);