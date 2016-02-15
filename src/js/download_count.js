var showDownloadCount = function(){
  var count = 0;
  $.ajax({
    type: "GET",
    url: 'https://pykcharts-api.herokuapp.com/downloads/count',
    error: function(data, textStatus, request) {
    },
    success: function (data, textStatus, request) {
        count = data.count;
        $('#pycharts_download_count').html(count);
    }
  });
}
