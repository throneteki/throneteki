/*eslint no-console:0 */

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const CardService = require('../../services/CardService.js');

class CardImport {
    constructor(db, dataSource, imageSource, imageDir) {
        this.db = db;
        this.dataSource = dataSource;
        this.imageSource = imageSource;
        this.imageDir = imageDir;
        this.cardService = new CardService(db);
    }

    async import() {
        try {
            await Promise.all([this.importCards(), this.importPacks()]);
        } catch (e) {
            console.log('Unable to fetch data', e);
        } finally {
            this.db.close();
        }
    }

    async importCards() {
        let cards = await this.dataSource.getCards();

        await this.cardService.replaceCards(cards);

        console.info(cards.length + ' cards fetched');

        await this.fetchImages(cards);
    }

    fetchImages(cards) {
        mkdirp(this.imageDir);

        let i = 0;

        for (let card of cards) {
            let imagePath = path.join(this.imageDir, card.code + '.png');

            if (!fs.existsSync(imagePath) || this.isWorkInProgress(card)) {
                setTimeout(() => {
                    this.imageSource.fetchImage(card, imagePath);
                }, i++ * 200);
            }
        }
    }

    isWorkInProgress(card) {
        let pack = this.imageSource.packs.find((pack) => pack.code === card.packCode);
        return pack && pack.workInProgress;
    }
    async importPacks() {
        let packs = await this.dataSource.getPacks();

        await this.cardService.replacePacks(packs);

        console.info(packs.length + ' packs fetched');
    }
}

module.exports = CardImport;
