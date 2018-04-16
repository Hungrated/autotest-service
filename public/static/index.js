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
