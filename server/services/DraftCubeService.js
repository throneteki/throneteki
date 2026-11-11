import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';

const SelectDraftCube = `
    SELECT id::text AS "_id", name, pack_definitions AS "packDefinitions", starter_deck AS "starterDeck",
        last_updated AS "lastUpdated"
    FROM draft_cubes`;

class DraftCubeService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    async getAll() {
        try {
            return await this.db.query(`${SelectDraftCube} ORDER BY id`);
        } catch (err) {
            logger.error('Error fetching draft cubes %s', err);

            throw new Error('Error occured fetching draft cubes');
        }
    }

    async getById(id) {
        try {
            const rows = await this.db.query(`${SelectDraftCube} WHERE ${idColumn(id)} = $1`, [
                String(id)
            ]);

            return rows[0] || null;
        } catch (err) {
            logger.error('Unable to fetch draft cube %s', err);
            throw new Error('Unable to fetch draft cube ' + id);
        }
    }

    async create(draftCube) {
        const rows = await this.db.query(
            'INSERT INTO draft_cubes (name, pack_definitions, starter_deck, last_updated) ' +
                'VALUES ($1, $2, $3, now()) RETURNING id',
            [
                draftCube.name,
                JSON.stringify(draftCube.packDefinitions || []),
                draftCube.starterDeck === undefined ? null : JSON.stringify(draftCube.starterDeck)
            ]
        );

        return this.getById(rows[0].id);
    }

    async update(draftCube) {
        return this.db.query(
            'UPDATE draft_cubes SET name = $1, pack_definitions = $2, starter_deck = $3, last_updated = now() ' +
                `WHERE ${idColumn(draftCube.id)} = $4`,
            [
                draftCube.name,
                JSON.stringify(draftCube.packDefinitions || []),
                draftCube.starterDeck === undefined ? null : JSON.stringify(draftCube.starterDeck),
                String(draftCube.id)
            ]
        );
    }

    async delete(id) {
        return this.db.query(`DELETE FROM draft_cubes WHERE ${idColumn(id)} = $1`, [String(id)]);
    }
}

export default DraftCubeService;
