import EventEmitter from 'events';
import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';

class MessageService extends EventEmitter {
    constructor(db = defaultDb) {
        super();

        this.db = db;
    }

    async addMessage(message) {
        try {
            const rows = await this.db.query(
                `INSERT INTO messages (user_id, poster, message, posted_at)
                VALUES ((SELECT id FROM users WHERE lower(username) = lower($1)), $2, $3, $4) RETURNING id`,
                [
                    message.user?.username ?? null,
                    JSON.stringify(message.user || {}),
                    message.message,
                    message.time || new Date()
                ]
            );

            return { ...message, _id: String(rows[0].id) };
        } catch (err) {
            logger.error('Unable to insert message %s', err);
            throw new Error('Unable to insert message');
        }
    }

    async getLastMessages(isModerator) {
        const messages = await this.db.query(
            `SELECT id::text AS "_id", poster AS "user", message, posted_at AS "time", deleted, deleted_by AS "deletedBy"
            FROM messages ORDER BY posted_at DESC, id DESC LIMIT 100`
        );

        return messages.map((message) => {
            return {
                _id: message._id,
                user: message.user,
                message: !message.deleted || isModerator ? message.message : undefined,
                time: message.time,
                deleted: message.deleted,
                deletedBy: isModerator ? message.deletedBy : undefined
            };
        });
    }

    removeMessage(messageId, deletedBy) {
        return this.db
            .query(
                `UPDATE messages SET deleted = true, deleted_by = $1 WHERE ${idColumn(messageId)} = $2`,
                [deletedBy.username, String(messageId)]
            )
            .then(() => {
                this.emit('messageDeleted', messageId, deletedBy);
            });
    }

    async getMotdMessage() {
        return this.db.query(
            `SELECT 'motd' AS "_id", 'motd' AS type, message, poster AS "user", posted_at AS "time",
                motd_type AS "motdType"
            FROM motd`
        );
    }

    async setMotdMessage(message) {
        const rows = await this.db.query(
            `INSERT INTO motd (id, poster, message, motd_type, posted_at) VALUES (true, $1, $2, $3, $4)
            ON CONFLICT (id) DO UPDATE SET poster = $1, message = $2, motd_type = $3, posted_at = $4
            RETURNING 'motd' AS "_id", 'motd' AS type, message, poster AS "user", posted_at AS "time",
                motd_type AS "motdType"`,
            [
                message.user === undefined ? null : JSON.stringify(message.user),
                message.message ?? null,
                message.motdType ?? null,
                message.time ?? null
            ]
        );

        return rows[0];
    }
}

export default MessageService;
