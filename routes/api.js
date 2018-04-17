const express = require('express');
const router = express.Router();
const pathLib = require('../app_paths');
const path = require('path');
const multer = require('multer');
const uid = require('../middlewares/uid');
const fs = require('fs');
const urlLib = require('url');

const objMulter = multer({
    dest: pathLib.scripts,
});

router.post('/import', objMulter.any(), function (req, res) {
    const file = req.files[0];
    if (!file) {
        return res.json({
            code: 1,
            data: {
                msg: '上传失败或取消上传',
            },
        });
    }
    const filename = `test_${uid.generate()}_${Date.now()}.js`;
    const newPath = `${file.destination}/${filename}`;
    const url = `http://${pathLib.host}/files/scripts/${filename}`;
    fs.renameSync(file.path, newPath);
    return res.json({
        code: 0,
        data: {
            msg: '上传成功',
            url: url,
        },
    });
});

router.get('/exec', function (req, res) {
    const filename = urlLib.parse(req.url, true).query.filename;
    const rawFilename = filename.slice(0, filename.length - 3);
    const filePath = path.join(pathLib.scripts, filename);
    const dirUrl = `http://${pathLib.host}/files/reports/${rawFilename}`;

    const putFile = function (oldPath, newPath, type) {
        fs.renameSync(`${oldPath}.${type}`, `${newPath}.${type}`);
    };
    const removeDirContents = function (dir) {
        let files = fs.readdirSync(dir);
        files.forEach(function (file) {
            fs.unlinkSync(`${dir}/${file}`);
        });
    };

    fs.access(filePath, function (err) {
        if (err) {
            return res.json({
                code: 1,
                data: {
                    msg: '无此文件，请重新上传',
                },
            });
        } else {
            function Run(cmd, args, options, cb_stdout, cb_end) {
                const spawn = require('child_process').spawn;
                const child = spawn(cmd, args, options);
                const self = this;
                self.exit = 0;
                child.stdout.on('data', function (data) {
                    cb_stdout(data);
                });
                child.stdout.on('end', function () {
                    cb_end(self);
                });
            }

            let env = Object.create(process.env);
            env.MOCHAWESOME_REPORTFILENAME = rawFilename;
            let instance = new Run('macaca',
                [
                    'run',
                    '-p',
                    '3456',
                    '-d',
                    filePath,
                    '-r',
                    'mochawesome',
                ],
                {
                    env: env,
                },
                function (data) {
                    let temp = data.toString();
                    console.log(temp);
                    res.io.emit('log', temp);
                },
                function (self) {
                    self.exit = 1;
                    let oldPath1 = `${pathLib.root}/mochawesome-report/${rawFilename}`;
                    let oldPath2 = `${pathLib.root}/screenshots/public/files/scripts`;
                    let newPath = `${pathLib.reports}/${rawFilename}`;

                    function createReportFile() {
                        removeDirContents(newPath);
                        putFile(oldPath1, `${newPath}/${rawFilename}`, 'json');
                        fs.unlinkSync(`${oldPath1}/${rawFilename}.html`);
                        let files = fs.readdirSync(oldPath2);
                        let screenshots = [];
                        files.forEach(function (file) {
                            if (new RegExp(rawFilename).test(file)) {
                                if(/\.png$/.test(file)) {
                                    screenshots.push(file);
                                    let pngName = file.slice(0, file.length - 4);
                                    putFile(`${oldPath2}/${pngName}`, `${newPath}/${pngName}`, 'png');
                                } else {
                                    fs.unlinkSync(`${oldPath2}/${file}`);
                                }
                            }
                        });
                        return res.json({
                            code: 0,
                            data: {
                                msg: '测试完成',
                                dir: dirUrl,
                                rawname: rawFilename,
                                screenshots: screenshots
                            },
                        });
                    }

                    fs.access(newPath, function (err) {
                        if (err) {
                            if (err.code === 'ENOENT') {
                                fs.mkdirSync(newPath);
                                createReportFile();
                            } else {
                                return res.json({
                                    code: 1,
                                    data: {
                                        msg: '生成报告错误',
                                    },
                                });
                            }
                        } else {
                            createReportFile();
                        }
                    });
                },
            );
        }
    });
});

module.exports = router;
