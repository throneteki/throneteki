const fs = require('fs');
const path = require('path');
const moment = require('moment');

const logger = require('../log.js');

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
        this.events = db.get('events');
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

                const officialLists = this.convertOfficialListToNewFormat(JSON.parse(data));
                this.events.find({}).then(events => {
                    resolve(officialLists.concat(events));
                }).catch(err => {
                    logger.info(`Unable to load events: ${err}`);
                    resolve(officialLists);
                });
            });
        });
    }

    convertOfficialListToNewFormat(versions) {
        const activeVersion = this.getActiveVersion(versions);
        const joustFormat = activeVersion.formats.find(format => format.name === 'joust');
        return [
            {
                name: `${activeVersion.issuer} FAQ v${activeVersion.version}`,
                date: activeVersion.date,
                restricted: joustFormat.restricted,
                banned: activeVersion.bannedCards.concat(joustFormat.banned || []),
                pods: joustFormat.pods
            }
        ];
    }

    getActiveVersion(versions) {
        const now = moment();
        return versions.reduce((max, list) => {
            let effectiveDate = moment(list.date, 'YYYY-MM-DD');
            if(effectiveDate <= now && effectiveDate > moment(max.date, 'YYYY-MM-DD')) {
                return list;
            }

            return max;
        });
    }
}

module.exports = CardService;

