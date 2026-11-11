import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';

const SelectEntry =
    'SELECT id::text AS "_id", ip, created_by AS "user", created_at AS "added" FROM banlist';

class BanlistService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    async getBanList() {
        try {
            return await this.db.query(`${SelectEntry} ORDER BY created_at`);
        } catch (err) {
            logger.error('Error fetching banlist %s', err);

            throw new Error('Error occured fetching banlist');
        }
    }

    async getEntryByIp(ip) {
        try {
            const rows = await this.db.query(`${SelectEntry} WHERE ip = $1`, [ip]);

            return rows[0];
        } catch (err) {
            logger.error('Error fetching banlist %s', err);

            throw new Error('Error occured fetching banlist');
        }
    }

    async addBanlistEntry(entry) {
        try {
            const rows = await this.db.query(
                'INSERT INTO banlist (ip, created_by, created_at) VALUES ($1, $2, $3) RETURNING id',
                [entry.ip, entry.user, entry.added || new Date()]
            );

            return { ...entry, _id: String(rows[0].id) };
        } catch (err) {
            logger.error('Error adding banlist entry %s %s', err, entry);

            throw new Error('Error occured adding banlist entry');
        }
    }

    async removeBanlistEntry(id) {
        try {
            await this.db.query(`DELETE FROM banlist WHERE ${idColumn(id)} = $1`, [String(id)]);
        } catch (err) {
            logger.error('Error removing banlist entry %s %s', err, id);

            throw new Error('Error occured removing banlist entry');
        }
    }
}

export default BanlistService;
