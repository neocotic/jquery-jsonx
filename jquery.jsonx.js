/**
 * Structure:
 * 
 * 
 * 
 * Usage:
 * 
 * (Object) $(*).jsonx();
 * (Object) $.jsonx(*);
 * (jQuery) $(*).jsonx('parse', ''|{});
 * (jQuery) $.jsonx('parse', ''|{});
 * (String) $(*).jsonx('stringify');
 * (String) $.jsonx('stringify', {});
 */
(function ($) {
    var methods = {
        init: function (value) {
            var j, obj;
            if (typeof value !== 'undefined') {
                obj = $(value);
            } else {
                obj = this;
            }
            if (obj.length) {
                // TODO: Create JSON(x) from jQuery object
                j = {};
            }
            return j;
        },
        parse: function (value) {
            var obj;
            if (typeof value === 'string') {
                value = JSON.parse(value);
            }
            // TODO: Create jQuery object from JSON(x)
            return obj;
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