function isPlainObject( obj ) {
	// Not plain objects:
	// - Any object or value whose internal [[Class]] property is not "[object Object]"
	// - DOM nodes
	// - window
	if ( typeof obj !== "object" || obj.nodeType || (obj != null && obj === obj.window)) {
		return false;
	}

	if ( obj.constructor && !(obj.constructor.prototype.hasOwnProperty("isPrototypeOf"))) {
		return false;
	}

	// If the function hasn't returned already, we're confident that
	// |obj| is a plain object, created by {} or constructed with new Object
	return true;
}

var downloadDataURI = function(options) {
  if(!options) {
    return;
  }
  isPlainObject(options) || (options = {data: options});

  options.filename || (options.filename = "download." + options.data.split(",")[0].split(";")[0].substring(5).split("/")[1]);
  options.url || (options.url = "http://download-data-uri.appspot.com/");
  var form = '<form id="export-form" method="post" action="'+options.url+'" style="display:none"><input type="hidden" name="filename" value="'+options.filename+'"/><input type="hidden" name="data" value="'+options.data+'"/></form>';
  $("body").append(form);
  var element = document.getElementById("export-form");
  element.submit();
  element.parentNode.removeChild(element);
  // document.getElementById("export-form").submit();
  // $('#export-form').submit().remove();
}

