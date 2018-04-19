module.exports = {
    // check for more recent versions of selenium here:
    // https://selenium-release.storage.googleapis.com/index.html
    version: '3.0.1',
    baseURL: 'https://selenium-release.storage.googleapis.com',
    drivers: {
        chrome: {
            // check for more recent versions of chrome driver here:
            // https://chromedriver.storage.googleapis.com/index.html
            version: '2.31',
            arch: process.arch,
            baseURL: 'https://chromedriver.storage.googleapis.com'
        },
        ie: {
            // check for more recent versions of internet explorer driver here:
            // https://selenium-release.storage.googleapis.com/index.html
            version: '3.0.1',
            arch: process.arch,
            baseURL: 'https://selenium-release.storage.googleapis.com'
        }
    },
    proxy: 'http://localproxy.com', // see https://github.com/request/request#proxies
    requestOpts: { // see https://github.com/request/request#requestoptions-callback
        timeout: 10000
    },
    logger: function (message) {

    },
    progressCb: function (totalLength, progressLength, chunkLength) {

    }
};
