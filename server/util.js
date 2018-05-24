const request = require('request');

function escapeRegex(regex) {
    return regex.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function httpRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        request(url, options, (err, res, body) => {
            if(err) {
                return reject(err);
            }

            resolve(body);
        });
    });
}

function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(next);
    };
}

module.exports = {
    escapeRegex: escapeRegex,
    httpRequest: httpRequest,
    wrapAsync: wrapAsync
};
