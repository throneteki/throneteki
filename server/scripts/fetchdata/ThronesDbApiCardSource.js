const request = require('request');

class ThronesDbApiCardSource {
    getCards() {
        return this.apiRequest('cards');
    }

    getPacks() {
        return this.apiRequest('packs');
    }

    apiRequest(path) {
        const apiUrl = 'https://thronesdb.com/api/public/';

        return new Promise((resolve, reject) => {
            request.get(apiUrl + path, function(error, res, body) {
                if(error) {
                    return reject(error);
                }

                resolve(JSON.parse(body));
            });
        });
    }
}

module.exports = ThronesDbApiCardSource;
