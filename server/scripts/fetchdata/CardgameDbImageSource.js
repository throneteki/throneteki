/*eslint no-console:0 */
const fs = require('fs');
const imagemagick = require('imagemagick-native');
const request = require('request');

class CardgameDbImageSource {
    constructor() {
        this.packs = JSON.parse(fs.readFileSync('thronesdb-json-data/packs.json'));
    }

    fetchImage(card, imagePath) {
        let pack = this.packs.find(pack => pack.code === card.pack_code);
        let cgdbId = pack.cgdb_id.toString().padStart(2, '0');
        let url = `http://lcg-cdn.fantasyflightgames.com/got2nd/GT${cgdbId}_${card.position}.jpg`;

        request({ url: url, encoding: null }, function(err, response, body) {
            if(err || response.statusCode !== 200) {
                console.log(`Unable to fetch image for ${card.code} from ${url}`);
                return;
            }

            console.log('Downloading image for ' + card.code);
            fs.writeFileSync(imagePath, imagemagick.convert({
                srcData: body,
                format: 'PNG'
            }));
        });
    }
}

module.exports = CardgameDbImageSource;
