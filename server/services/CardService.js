const fs = require('fs');
const path = require('path');

const logger = require('../log.js');

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({})
            .then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({})
            .then(() => this.packs.insert(cards));
    }

    getAllCards() {
        return this.cards.find({})
            .then(result => {
                let cards = {};

                for(let card of result) {
                    cards[card.code] = card;
                }

                return cards;
            }).catch(err => {
                logger.info(err);
            });
    }

    getTitleCards() {
        return this.cards.find({ type: 'title' })
            .then(cards => {
                return cards.reduce((memo, card) => {
                    memo[card.code] = card;
                    return memo;
                }, {});
            });
    }

    getAllPacks() {
        return this.packs.find({}).catch(err => {
            logger.info(err);
        });
    }

    getRestrictedList() {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '../../throneteki-json-data/restricted-list.json'), (err, data) => {
                if(err) {
                    return reject(err);
                }

                resolve(JSON.parse(data));
            });
        });
    }
}

module.exports = CardService;

