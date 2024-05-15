/*eslint no-console:0 */
const fs = require('fs');
const jimp = require('jimp');
const request = require('request');

class CardgameDbImageSource {
    constructor() {
        this.packs = this.loadPacks();
    }

    loadPacks() {
        let files = fs.readdirSync('throneteki-json-data/packs');
        return files.map((file) =>
            JSON.parse(fs.readFileSync('throneteki-json-data/packs/' + file))
        );
    }

    fetchImage(card, imagePath) {
        let pack = this.packs.find((pack) => pack.code === card.packCode);
        if (!pack) {
            console.log(
                `Could not find pack '${card.packCode}' for ${card.name}, submodule data may be out of date.`
            );
            return;
        }

        if (!pack.cgdbId && !card.imageUrl) {
            console.log(
                `Could not fetch image for ${card.name} (${card.packCode}), as no images are hosted for ${pack.name}`
            );
            return;
        }

        let url = card.imageUrl;

        // Use the official card images if imageUrl isn't present
        if (!url) {
            let cgdbId = pack.cgdbId.toString().padStart(2, '0');
            let cardNumber = parseInt(card.code.substring(2), 10);
            url = `http://lcg-cdn.fantasyflightgames.com/got2nd/GT${cgdbId}_${cardNumber}.jpg`;
        }

        request({ url: url, encoding: null }, function (err, response, body) {
            if (err || response.statusCode !== 200) {
                console.log(`Unable to fetch image for ${card.code} from ${url}`);
                return;
            }
            console.log(
                'Downloading ' +
                    (pack.workInProgress ? 'latest Work in Progress ' : '') +
                    'image for ' +
                    card.code
            );
            jimp.read(body)
                .then((lenna) => {
                    lenna.write(imagePath);
                })
                .catch((err) => {
                    console.log(`Error converting image for ${card.code}: ${err}`);
                });
        });
    }
}

module.exports = CardgameDbImageSource;
