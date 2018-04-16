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
  const newName = `${file.destination}/test.${uid.generate()}.${Date.now()}.js`;
  fs.renameSync(file.path, newName);
  console.log(file);
  res.json({
    code: 0,
    data: {
      msg: 'success'
    }
  });
});

module.exports = router;
