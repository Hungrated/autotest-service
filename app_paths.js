const path = require('path');
const fs = require('fs');

const host = '127.0.0.1:9090';

const root = __dirname;

const files = path.join(__dirname, 'public', 'files');

const scripts = path.join(files, 'scripts');

const reports = path.join(files, 'reports');

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
mkdirIfNotExist(scripts);
mkdirIfNotExist(reports);

module.exports = {
  host,
  root,
  files,
  scripts,
  reports
};
