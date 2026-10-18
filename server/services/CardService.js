import fs from 'fs';
import path from 'path';
import moment from 'moment';
import startCase from 'lodash.startcase';
import defaultDb from '../db/index.js';
import logger from '../log.js';

const __dirname = import.meta.dirname;

const defaultVariant = {
    joust: 'standard',
    melee: 'standard',
    draft: 'valyrian'
};

class CardService {
    constructor(db = defaultDb) {
        this.db = db;
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

    async processLegality(format, variant, legality, event) {
        // No legality provided, or full legality object provided
        if (!legality || legality._id) {
            return legality;
        }
        // Custom legality (only for events)
        if (legality === 'custom' && !!event) {
            return event.customLegality;
        }
        const lists = await this.getRestrictedList();
        // Latest (active) legality
        if (legality === 'latest') {
            return lists.find((l) => l.format === format && l.variant === variant && l.active);
        }
        // Specific legality by Id (or null if none found)
        return lists.find((l) => l._id === legality);
    }

    compileLists(lists) {
        // Sort by newest first
        const sorted = lists.sort((a, b) => new Date(b.date) - new Date(a.date));
        const compiled = [];
        for (const legality of sorted) {
            // Cards banned at legality level apply to all formats/lists
            const legalityBanned = legality.bannedCards ?? [];
            for (const list of legality.formats) {
                const { name: lName, variant: lVariant, banned: listBanned, ...details } = list;
                const format = lName;
                const variant = lVariant ?? defaultVariant[format];
                const version = legality.version;
                const name = `${startCase(`${format} ${variant}`)} ${version}`;
                const banned = [...new Set([...(listBanned ?? []), ...legalityBanned])];
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
                    banned,
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

    replaceCards(cards) {
        return this.replaceAll('cards', cards);
    }

    replacePacks(packs) {
        return this.replaceAll('packs', packs);
    }

    replaceAll(table, items) {
        return this.db.transaction(async (tx) => {
            await tx.query(`DELETE FROM ${table}`);
            await tx.query(
                `INSERT INTO ${table} (code, data) SELECT item->>'code', item FROM jsonb_array_elements($1::jsonb) AS item`,
                [JSON.stringify(items)]
            );
        });
    }

    async getAllCards() {
        try {
            const rows = await this.db.query('SELECT data FROM cards');

            return Object.fromEntries(rows.map((row) => [row.data.code, row.data]));
        } catch (err) {
            logger.info(err);
        }
    }

    async getTitleCards() {
        const rows = await this.db.query("SELECT data FROM cards WHERE data->>'type' = 'title'");

        return Object.fromEntries(rows.map((row) => [row.data.code, row.data]));
    }

    async getAllPacks() {
        try {
            const rows = await this.db.query(
                "SELECT data FROM packs ORDER BY data->>'releaseDate' NULLS LAST, code"
            );

            return rows.map((row) => row.data);
        } catch (err) {
            logger.info(err);
        }
    }
}

export default CardService;
