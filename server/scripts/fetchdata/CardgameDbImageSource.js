/*eslint no-console:0 */
import fs from 'fs';
import { rename, writeFile } from 'fs/promises';

import { Jimp } from 'jimp';

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
        // nginx serves this directory live, so write a temp file and rename it into place rather
        // than letting a browser cache a half-written image
        Jimp.read(url)
            .then((image) => image.getBuffer('image/png'))
            .then(async (buffer) => {
                const tempPath = `${imagePath}.tmp`;
                await writeFile(tempPath, buffer);
                await rename(tempPath, imagePath);
            })
            .catch((err) => {
                console.log(`Error converting image for ${card.code}: ${err}`);
            });
    }
}

export default CardgameDbImageSource;
