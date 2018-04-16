const express = require('express');
const router = express.Router();
const pathLib = require('../app_paths');
const path = require('path');
const multer = require('multer');
const uid = require('../middlewares/uid');
const fs = require('fs');
const urlLib = require('url');

const objMulter = multer({
  dest: pathLib.scripts
});

router.post('/import', objMulter.any(), function (req, res, next) {
  const file = req.files[0];
  const filename = `test.${uid.generate()}.${Date.now()}.js`;
  const newPath = `${file.destination}/${filename}`;
  const url = `http://${pathLib.host}/files/scripts/${filename}`;
  fs.renameSync(file.path, newPath);
  return res.json({
    code: 0,
    data: {
      msg: '上传成功',
      url: url
    }
  });
});

router.get('/exec', function (req, res, next) {
  const filename = urlLib.parse(req.url, true).query.filename;
  const reportPath = `http://${pathLib.host}/files/reports` +
    `/${filename.slice(0, filename.length - 3)}.html`;
  const filePath = path.join(pathLib.scripts, filename);

  fs.access(filePath, function (err) {
    if (err) {
      return res.json({
        code: 1,
        data: {
          msg: '无此文件，请重新上传'
        }
      });
    } else {
      function Run (cmd, args, cb_stdout, cb_end) {
        const spawn = require('child_process').spawn;
        const child = spawn(cmd, args);
        const self = this;
        self.exit = 0;
        child.stdout.on('data', function (data) { cb_stdout(data); });
        child.stdout.on('end', function () { cb_end(self); });
      }
      let instance = new Run('macaca',
        [
          'run',
          '-p',
          '3456',
          '-d',
          filePath,
          '--reporter',
          'macaca-reporter'
        ],
        function (data) {
          let temp = data.toString();
          console.log(temp);
          res.io.emit('log', temp);
        },
        function (self) {
          self.exit = 1;
          let report = `${pathLib.root}/reports/index.html`;
          let newReport = `${pathLib.reports}` +
            `/${filename.slice(0, filename.length - 3)}.html`;
          console.log(pathLib.reports, newReport);
          fs.access(report, function (err) {
            if (err) {
              return res.json({
                code: 1,
                data: {
                  msg: '生成报告错误'
                }
              });
            } else {
              fs.renameSync(report, newReport);
              return res.json({
                code: 0,
                data: {
                  msg: '测试完成',
                  url: reportPath
                }
              });
            }
          });
        }
      );
    }
  });
});

module.exports = router;
