const express = require('express');
const router = express.Router();
const pathLib = require('../app_paths');
const path = require('path');
const multer = require('multer');
const uid = require('../middlewares/uid');
const fs = require('fs');
const urlLib = require('url');

const objMulter = multer({
  dest: pathLib.files
});

router.post('/import', objMulter.any(), function (req, res, next) {
  const file = req.files[0];
  const filename = `test.${uid.generate()}.${Date.now()}.js`;
  const newPath = `${file.destination}/${filename}`;
  const url = `http://${pathLib.host}/files/${filename}`;
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
  // const exec = require('child_process').exec;
  const filePath = path.join(pathLib.files, filename);

  function Run (cmd, args, cb_stdout, cb_end) {
    const spawn = require('child_process').spawn;
    const child = spawn(cmd, args);
    const self = this;
    self.exit = 0;
    self.stdout = '';
    child.stdout.on('data', function (data) { cb_stdout(self, data); });
    child.stdout.on('end', function () { cb_end(self); });
  }

  fs.access(filePath, function (err) {
    if (err) {
      res.json({
        code: 1,
        data: {
          msg: '无此文件，请重新上传'
        }
      });
    } else {
      let instance = new Run('macaca', ['run', '-p', '3456', '-d', filePath],
        function (self, data) {
          self.stdout += data.toString();
          // console.log(data.toString());
          res.io.emit('log', data.toString());
        },
        function (self) {
          self.exit = 1;
          return res.json({
            code: 0,
            data: {
              msg: '测试完成'
            }
          });
        }
      );
      setTimeout(function () {
        console.log(instance.stdout);
      }, 250);
    }
  });
});

module.exports = router;
