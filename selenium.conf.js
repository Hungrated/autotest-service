module.exports = {
    // check for more recent versions of selenium here:
    // https://selenium-release.storage.googleapis.com/index.html
    version: '2.53.1',
    baseURL: 'https://selenium-release.storage.googleapis.com',
    drivers: {
        chrome: {
            // check for more recent versions of chrome driver here:
            // https://chromedriver.storage.googleapis.com/index.html
            version: '2.38',
            arch: process.arch,
            baseURL: 'https://chromedriver.storage.googleapis.com'
        },
        ie: {
            // check for more recent versions of internet explorer driver here:
            // https://selenium-release.storage.googleapis.com/index.html
            version: '2.53.1',
            arch: process.arch,
            baseURL: 'https://selenium-release.storage.googleapis.com'
        }
    }
};
