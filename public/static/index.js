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
  $('.J_cmd').append(`<p>${msg}</p>`)
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
  }, function (data) {
    console.log(data);
  }, function (err) {
    console.log(err);
  });
}

function handleTest () {
  const socket = io.connect();
  socket.on('connection', function (msg) {
    console.log(msg);
  });
  socket.on('log', function (msg) {
    htmlLog(msg);
  });
  request({
    url: `/api/exec?filename=test.4423dd.1523867088362.js`
  }, function (data) {
    console.log(data);
    socket.emit('disconnect');
  }, function (err) {
    console.log(err);
  });
}

handleTest();
