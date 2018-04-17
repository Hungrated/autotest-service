const socket = io.connect();
socket.on('connection', function (msg) {
  console.log(msg);
});
socket.on('log', function (msg) {
  htmlLog(msg);
});

function request (opts, sucCb, errCb) {
  const defaultOpts = {
    method: 'GET',
    success: sucCb,
    dataType: 'json',
    error: errCb
  };

  let newOpts = {
    ...defaultOpts,
    ...opts
  };
  $.ajax(newOpts);
}

function htmlLog (msg) {
  let newMsg = msg.replace(/\[[0-9]*m/g, '');
  $('.J_cmd').append(`<p class="f-blue">${newMsg}</p>`)
}

function handleUpload () {
  const file = $('#upload')[0].files[0];
  let formData = new FormData();
  formData.append('file', file);
  request({
    url: '/api/import',
    method: 'POST',
    data: formData,
    cache: false,
    processData: false,
    contentType: false
  }, function (res) {
    if(res.code === 0) {
      $('.J_url').html(res.data.url);
      $('.J_url').attr('href', res.data.url);
    }
  }, function (err) {
    console.log(err);
  });
}

function handleTest () {
  $('.J_cmd').html('');
  $('.J_report').html('');
  $('.J_report').attr('href', '');
  const filename = $('.J_url').html().split('scripts/')[1];
  if(!filename) {
    return;
  }
  $('#start').removeClass('btn-a');
  $('#start').attr('disabled', 'disabled');
  $('#start').html('执行中');
  request({
    url: `/api/exec?filename=${filename}`
  }, function (res) {
    if (res.code === 0) {
      htmlLog('<br>');
      htmlLog(res.data.msg);
      $('.J_report').html(res.data.url);
      $('.J_report').attr('href', res.data.url);
    }
    $('#start').addClass('btn-a');
    $('#start').removeAttr('disabled');
    $('#start').html('重 试');
  }, function (err) {
    console.log(err);
  });
}

$('#start').click(function () {
  handleTest();
});
