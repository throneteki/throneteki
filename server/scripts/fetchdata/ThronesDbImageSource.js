/*eslint no-console:0 */

const request = require('request');
const fs = require('fs');

class ThronesDbImageSource {
    fetchImage(card, imagePath) {
        let url = `https://thronesdb.com/bundles/cards/${card.code}.png`;
        request({ url: url, encoding: null }, function(err, response, body) {
            if(err || response.statusCode !== 200) {
                console.log(`Unable to fetch image for ${card.code} from ${url}`);
                return;
            }

            console.log('Downloading image for ' + card.code);
            fs.writeFileSync(imagePath, body);
        });
    }
}

module.exports = ThronesDbImageSource;
