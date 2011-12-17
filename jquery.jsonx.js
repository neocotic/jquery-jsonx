// [jquery-jsonx](http://neocotic.com/jquery-jsonx) 1.0.0  
// (c) 2011 Alasdair Mercer  
// Freely distributable under the MIT license.  
// For all details and documentation:  
// <http://neocotic.com/jquery-jsonx>

(function ($) {

  // Private functions
  // -----------------

  // Return a map of attribute name and value pairs for the element provided.
  function attributes(obj) {
    var
      ele    = obj[0],
      name   = '',
      notXml = ele.nodeType !== 1 || !$.isXMLDoc(ele),
      ret    = {};
    if (ele.attributes.length > 0) {
      for (var i = 0; i < ele.attributes.length; i++) {
        name = ele.attributes[i].name;
        name = notXml && $.propFix[name] || name;
        ret[name] = obj.attr(name);
      }
    }
    return ret;
  }

  // Public functions
  // ----------------

  var api = {

    // Build jQuery based on the JSON provided.  
    // If the argument is a string it is parsed in to JSON before being
    // processed.  
    // The jQuery object is built in the same hierarchy in which it is defined
    // in the JSON structure and all attributes are transferred.
    build: function (value) {
      // Convert JSONX provided to jQuery objects.
      function convertJSONX(obj, parent) {
        var
          arr = [],
          ele = {};
        if ($.isArray(obj)) {
          if (!obj.length || $.type(obj[0]) !== 'string') {
            $.error('JSONX.build: Syntax error');
          }
          ele = $(document.createElement(obj[0]));
          if (obj.length > 1) {
            if ($.isPlainObject(obj[1])) {
              ele.attr(obj[1]);
              if (obj.length > 2) arr = Array.prototype.slice.call(obj, 2);
            } else {
              arr = Array.prototype.slice.call(obj, 1);
            }
            if (arr.length) convertJSONX(arr, ele);
          }
        } else if ($.type(obj) === 'string') {
          parent.append(obj);
        }
        return parent;
      }

      if ($.type(value) === 'string') value = api.parse(value);
      if (!$.isArray(value)) $.error('JSONX.build: Type error');
      return convertJSONX(value, $('<x/>')).contents();
    },

    // Parse the jQuery object or string provided in to JSON.  
    // If the argument is a string it is parsed in to JSON. This basically acts
    // as a shortcut method to `JSON.parse` in this case.  
    // If no argument is specified the selected jQuery is parsed.  
    // JSON is built in the same hierarchy in which it is defined in the XML
    // structure and all attributes are transferred.
    parse: function (value) {
      // Convert jQuery objects to JSONX.
      function convertJQuery(obj) {
        var ret = [];
        obj.each(function () {
          var 
            $this    = $(this),
            attrs    = {},
            contents = $this.contents();
          Array.prototype.push.call(ret, this.nodeName.toLowerCase());
          attrs = attributes($this);
          if (!$.isEmptyObject(attrs)) Array.prototype.push.call(ret, attrs);
          if (contents.length) {
            for (var i = 0; i < contents.length; i++) {
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
      if (typeof value === 'undefined') value = this;
      switch ($.type(value)) {
      case 'string':
        return JSON.parse(value);
      case 'object':
        return convertJQuery($(value));
      }
      $.error('JSONX.parse: Type error');
    },

    // Transform the jQuery object or JSON provided in to a string
    // representation of themselves.  
    // If the argument is a jQuery object then it is parsed in to JSON before
    // being transformed in to a string.  
    // If no argument is specified the selected jQuery parsed in to JSON and
    // then transformed in to a string.
    stringify: function (value) {
      if (typeof value === 'undefined') {
        value = api.parse(this);
      } else if ($.type(value) === 'object' && value.jquery) {
        value = api.parse(value);
      } else if (!$.isArray(value)) {
        $.error('JSONX.stringify: Type error');
      }
      return JSON.stringify(value);
    }

  };

  // Setup JSONX plugin.
  $.fn.jsonx = function (arg) {
    if (api[arg]) {
      return api[arg].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    return api.build.apply(this, arguments);
  };

}(jQuery));