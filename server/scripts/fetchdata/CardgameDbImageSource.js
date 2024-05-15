/*eslint no-console:0 */
import fs from 'fs';

import jimp from 'jimp';

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

    async fetchImage(card, imagePath) {
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

        console.log(
            'Downloading ' +
                (pack.workInProgress ? 'latest Work in Progress ' : '') +
                'image for ' +
                card.code
        );
        jimp.read(url)
            .then((lenna) => {
                lenna.write(imagePath);
            })
            .catch((err) => {
                console.log(`Error converting image for ${card.code}: ${err}`);
            });
    }
}

export default CardgameDbImageSource;
