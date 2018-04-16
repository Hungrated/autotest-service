const express = require('express');
const router = express.Router();
const pathLib = require('../app_paths');
const multer = require('multer');
const uid = require('../middlewares/uid');
const fs = require('fs');

const objMulter = multer({
  dest: pathLib.files
});

router.post('/import', objMulter.any(), function (req, res, next) {
  const file = req.files[0];
  const filename = `test.${uid.generate()}.${Date.now()}.js`;
  const newPath = `${file.destination}/${filename}`;
  const url = `http://${pathLib.host}/files/${filename}`;
  fs.renameSync(file.path, newPath);
  console.log(file);
  res.json({
    code: 0,
    data: {
      msg: '上传成功',
      url: url
    }
  });
});

module.exports = router;
