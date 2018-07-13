const request = require('request');
const configFile = '../conf/' + (process.env.CONFIG_FILE || 'remote') + '.conf.js';
const config = require(configFile).config;

module.exports = {
    postToEndpoint: function (endpoint, params, authToken) {
        return new Promise((resolve, reject) => {
            let options = {
                url: `${config.testHost}/api/${endpoint}`,
                method: 'POST',
                body: params,
                json: true
            };

            if(authToken) {
                options.auth = {
                    bearer: authToken
                };
            }

            request.post(options, (err, res, body) => {
                if(err) {
                    return reject(err);
                }

                resolve({ response: res, body: body });
            });
        });
    }
};
