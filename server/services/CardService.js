import fs from 'fs';
import path from 'path';
import moment from 'moment';
import logger from '../log.js';
import startCase from 'lodash.startcase';

const __dirname = import.meta.dirname;

const defaultVariant = {
    joust: 'standard',
    melee: 'standard',
    draft: 'valyrian'
};

class CardService {
    constructor(db) {
        this.cards = db.get('cards');
        this.packs = db.get('packs');
    }

    replaceCards(cards) {
        return this.cards.remove({}).then(() => this.cards.insert(cards));
    }

    replacePacks(cards) {
        return this.packs.remove({}).then(() => this.packs.insert(cards));
    }

    getAllCards() {
        return this.cards
            .find({})
            .then((result) => {
                let cards = {};

                for (let card of result) {
                    cards[card.code] = card;
                }

                return cards;
            })
            .catch((err) => {
                logger.info(err);
            });
    }

    getTitleCards() {
        return this.cards.find({ type: 'title' }).then((cards) => {
            return cards.reduce((memo, card) => {
                memo[card.code] = card;
                return memo;
            }, {});
        });
    }

    getAllPacks() {
        return this.packs.find({}).catch((err) => {
            logger.info(err);
        });
    }

    getRestrictedList() {
        return new Promise((resolve, reject) => {
            fs.readFile(
                path.join(__dirname, '../../throneteki-json-data/restricted-list.json'),
                (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    const jsonData = JSON.parse(data);
                    const lists = this.compileLists(jsonData);

                    resolve(lists);
                }
            );
        });
    }

    async processLegality(format, variant, legality) {
        if (!legality) {
            return legality;
        }
        // Custom legality (return itself)
        if (typeof legality === 'object') {
            return legality;
        }
        const lists = await this.getRestrictedList();
        // Latest (active) legality
        if (legality === 'latest') {
            return lists.find((l) => l.format === format && l.variant === variant && l.active);
        }
        // Specific legality by Id
        return lists.find((l) => l._id === legality);
    }

    compileLists(lists) {
        // Sort by newest first
        const sorted = lists.sort((a, b) => new Date(b.date) - new Date(a.date));
        const compiled = [];
        for (const legality of sorted) {
            for (const list of legality.formats) {
                const { name: lName, variant: lVariant, ...details } = list;
                const format = lName;
                const variant = lVariant ?? defaultVariant[format];
                const version = legality.version;
                const name = `${startCase(`${format} ${variant}`)} ${version}`;
                const data = {
                    _id: `${legality.code}_${format}_${variant}`,
                    format,
                    variant,
                    name,
                    version,
                    date: legality.date,
                    issuer: legality.issuer,
                    official: true,
                    active: false, // Actually set in setActiveLists,
                    restricted: [],
                    pods: [],
                    banned: [],
                    ...details
                };
                compiled.push(data);
            }
        }

        this.setActiveLists(compiled);

        return compiled;
    }
    setActiveLists(compiled) {
        const today = moment().startOf('day');

        const closest = {};

        for (const item of compiled) {
            const date = moment(item.date, 'YYYY-MM-DD');

            if (!date.isSameOrBefore(today)) continue;

            const key = `${item.format}__${item.variant}`;
            if (!closest[key] || date.isAfter(moment(closest[key].date, 'YYYY-MM-DD'))) {
                closest[key] = item;
            }
        }

        for (const item of Object.values(closest)) {
            item.active = true;
        }

        return compiled;
    }
}

export default CardService;
