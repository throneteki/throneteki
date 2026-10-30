import fs from 'fs';
import path from 'path';
import {
    compileLegalityLists,
    setActiveLegalityLists
} from '../../deck-helper/compileLegalityLists.js';
import defaultDb from '../db/index.js';
import logger from '../log.js';

const __dirname = import.meta.dirname;

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
        const compiled = compileLegalityLists(lists);
        this.setActiveLists(compiled);
        return compiled;
    }

    setActiveLists(compiled) {
        return setActiveLegalityLists(compiled);
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
