import crypto from 'crypto';
import defaultDb from '../db/index.js';

const BannerColumns = `id::text AS "_id", title, link_url AS "linkUrl", event_id::text AS "eventId",
    event_date::text AS "eventDate", image_token AS "image"`;

const AdminColumns = `${BannerColumns}, show_from AS "showFrom", show_until AS "showUntil",
    created_by AS "createdBy", created_at AS "createdAt"`;

const ActiveCacheMs = 60 * 1000;

class BannerService {
    constructor(db = defaultDb) {
        this.db = db;
        this.activeCache = undefined;
    }

    // Every lobby view asks for these. Writes on this server clear the cache, and the expiry covers
    // writes on other servers and banners starting or ending.
    async getCachedActiveBanners() {
        const now = Date.now();
        if (!this.activeCache || this.activeCache.expires <= now) {
            const entry = {
                expires: now + ActiveCacheMs,
                banners: this.getActiveBanners(new Date(now))
            };
            entry.banners.catch(() => {
                if (this.activeCache === entry) {
                    this.activeCache = undefined;
                }
            });
            this.activeCache = entry;
        }

        return this.activeCache.banners;
    }

    getActiveBanners(now = new Date()) {
        return this.db.query(
            `SELECT ${BannerColumns} FROM banners
            WHERE show_from <= $1 AND show_until > $1 AND image_token IS NOT NULL
            ORDER BY event_date ASC NULLS LAST, show_until ASC, id ASC`,
            [now]
        );
    }

    getBanners() {
        return this.db.query(
            `SELECT ${AdminColumns} FROM banners ORDER BY show_until DESC, id DESC`
        );
    }

    async addBanner(banner, createdBy) {
        const rows = await this.write(
            `INSERT INTO banners (title, link_url, event_id, event_date, show_from, show_until, created_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING ${AdminColumns}`,
            [...bannerValues(banner), createdBy]
        );

        return rows[0];
    }

    async updateBanner(id, banner) {
        const rows = await this.write(
            `UPDATE banners SET title = $1, link_url = $2, event_id = $3, event_date = $4,
            show_from = $5, show_until = $6 WHERE id = $7 RETURNING ${AdminColumns}`,
            [...bannerValues(banner), id]
        );

        return rows[0];
    }

    async deleteBanner(id) {
        const rows = await this.write('DELETE FROM banners WHERE id = $1 RETURNING id', [id]);

        return rows.length > 0;
    }

    async setImage(id, { contentType, image }) {
        const token = crypto.randomBytes(16).toString('hex');
        const rows = await this.write(
            `UPDATE banners SET image_token = $2, image_content_type = $3, image = $4
            WHERE id = $1 RETURNING ${AdminColumns}`,
            [id, token, contentType, image]
        );

        return rows[0];
    }

    async write(text, params) {
        try {
            return await this.db.query(text, params);
        } finally {
            this.activeCache = undefined;
        }
    }

    async getImage(token) {
        const rows = await this.db.query(
            'SELECT image_content_type, image FROM banners WHERE image_token = $1',
            [token]
        );

        return rows[0] && { contentType: rows[0].image_content_type, image: rows[0].image };
    }
}

function bannerValues(banner) {
    return [
        banner.title,
        banner.linkUrl ?? null,
        banner.eventId ?? null,
        banner.eventDate ?? null,
        banner.showFrom,
        banner.showUntil
    ];
}

export default BannerService;
