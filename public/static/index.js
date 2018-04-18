const socket = io.connect();
socket.on('connection', function (msg) {
    console.log(msg);
});
socket.on('log', function (msg) {
    htmlLog(msg);
});

function request(opts, sucCb, errCb) {
    const defaultOpts = {
        method: 'GET',
        success: sucCb,
        dataType: 'json',
        error: errCb,
    };

    let newOpts = {
        ...defaultOpts,
        ...opts,
    };
    $.ajax(newOpts);
}

function htmlLog(msg) {
    let newMsg = msg.replace(/\[[0-9]*m/g, '');
    $('.J_cmd').append(`<p class="f-blue">${newMsg}</p>`);
}

function handleUpload() {
    const file = $('#upload')[0].files[0];
    let formData = new FormData();
    formData.append('file', file);
    request({
        url: '/api/import',
        method: 'POST',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
    }, function (res) {
        if (res.code === 0) {
            $('.J_url').html(res.data.url);
            $('.J_url').attr('href', res.data.url);
            $('#start').html('执 行');
        }
    }, function (err) {
        console.log(err);
    });
}

function handleTest() {
    $('.J_cmd').html('');
    // $('.J_report_title').html('');
    $('.J_report_list').html('');
    const filename = $('.J_url').html().split('scripts/')[1];
    if (!filename) {
        return;
    }
    $('#start').removeClass('btn-a');
    $('#start').attr('disabled', 'disabled');
    $('#start').html('执行中');
    request({
        url: `/api/exec?filename=${filename}`,
    }, function (res) {
        if (res.code === 0) {
            htmlLog('<br>');
            htmlLog(res.data.msg);
            handleReport(res.data)
        }
        $('#start').addClass('btn-a');
        $('#start').removeAttr('disabled');
        $('#start').html('重 试');
    }, function (err) {
        console.log(err);
    });
}

function handleReport(data) {
    request({
        url: `${data.dir}/${data.rawname}.json`
    }, function (res) {
        renderReport(data.dir, res.suites.suites[0].tests, data.screenshots);
    });
}

function renderReport(dir, tests, screenshots) {
    tests.map(function (_v, _i) {
        $('.J_report_list').append(renderTest(_i + 1, dir, _v, screenshots[_i]));
    });
}

function renderTest(index, dir, test, screenshot) {
    return `
        <div class="u-test">
            <span class="title">${index}</span>
            <span class="title">${test.title}</span>
            ${test.pass ? `<span class="title">passed</span>`
                : `<span class="title">failed</span>`}
            <span class="title">${test.duration}&nbsp;ms</span>
            <div class="code">
                <code>${test.code}</code>
            </div>
            <div class="screenshot">
                <img src="${dir}/${screenshot}">
            </div>
        </div>    
    `;
}

$('#start').click(function () {
    handleTest();
});
