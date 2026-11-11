import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';

class NewsService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    getRecentNewsItems(options = {}) {
        const limit = parseInt(options.limit);

        return this.db.query(
            `SELECT id::text AS "_id", poster, text, published_at AS "datePublished"
            FROM news ORDER BY published_at DESC, id DESC${limit > 0 ? ' LIMIT $1' : ''}`,
            limit > 0 ? [limit] : []
        );
    }

    async addNews(news) {
        try {
            const rows = await this.db.query(
                'INSERT INTO news (poster, text, published_at) VALUES ($1, $2, $3) RETURNING id',
                [news.poster ?? null, news.text, news.datePublished || new Date()]
            );

            return { ...news, _id: String(rows[0].id) };
        } catch (err) {
            logger.error('Error adding news item %s', err);

            throw new Error('Error occured adding news item');
        }
    }

    async editNews(id, text) {
        try {
            await this.db.query(`UPDATE news SET text = $1 WHERE ${idColumn(id)} = $2`, [
                text,
                String(id)
            ]);

            return true;
        } catch (err) {
            logger.error('Error saving news item %s', err);

            throw new Error('Error occured saving news item');
        }
    }

    async deleteNews(id) {
        try {
            await this.db.query(`DELETE FROM news WHERE ${idColumn(id)} = $1`, [String(id)]);

            return true;
        } catch (err) {
            logger.error('Error deleting news item %s %s', err, id);

            throw new Error('Error occured deleting news item');
        }
    }
}

export default NewsService;
