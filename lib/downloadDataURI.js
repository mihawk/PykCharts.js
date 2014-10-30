var downloadDataURI = function(options) {
  if(!options) {
    return;
  }
  $.isPlainObject(options) || (options = {data: options});

  options.filename || (options.filename = "download." + options.data.split(",")[0].split(";")[0].substring(5).split("/")[1]);
  options.url || (options.url = "http://download-data-uri.appspot.com/");
  var form = '<form id="export-form" method="post" action="'+options.url+'" style="display:none"><input type="text" name="filename" value="'+options.filename+'"/><input type="text" name="data" value="'+options.data+'"/></form>';
  $("body").append(form);
  $('#export-form').submit().remove();
}
