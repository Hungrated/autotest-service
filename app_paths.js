const path = require('path');
const fs = require('fs');

const files = path.join(__dirname, 'public', 'files');

const makeDir = function (dir) {
  fs.mkdir(dir, function (err) {
    if (err) {
      console.log('dir: `' + dir + '` exists.');
    } else {
      console.log(dir + ' created.');
    }
  });
};

const mkdirIfNotExist = function (dir) {
  fs.access(dir, function (err) {
    if (err && err.code === 'ENOENT') {
      makeDir(dir);
    } else {
      console.log('dir: `' + dir + '` exists.');
    }
  });
};

mkdirIfNotExist(files);

module.exports = {
  files
};
