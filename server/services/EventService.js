import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';

export const EventFields = [
    { property: 'name', column: 'name' },
    { property: 'format', column: 'format' },
    { property: 'variant', column: 'variant' },
    { property: 'legality', column: 'legality', type: 'json' },
    { property: 'customLegality', column: 'custom_legality', type: 'json' },
    { property: 'gameType', column: 'game_type' },
    { property: 'lockDecks', column: 'lock_decks', default: false },
    { property: 'useEventGameOptions', column: 'use_event_game_options', default: false },
    { property: 'eventGameOptions', column: 'event_game_options', type: 'json' },
    { property: 'validTableCreators', column: 'valid_table_creators' },
    { property: 'validSpectators', column: 'valid_spectators' }
];

const SelectEvent = `SELECT id, legacy, ${EventFields.map((field) => field.column).join(', ')} FROM events`;

function rowToEvent(row) {
    const event = { ...(row.legacy || {}), _id: String(row.id) };

    for (const field of EventFields) {
        event[field.property] = row[field.column];
    }

    return event;
}

function toColumnValue(field, value) {
    if (value === undefined || value === null) {
        return field.default ?? null;
    }

    return field.type === 'json' ? JSON.stringify(value) : value;
}

class EventService {
    constructor(db = defaultDb) {
        this.db = db;
    }

    async init() {}

    async getEvents() {
        try {
            const rows = await this.db.query(`${SelectEvent} ORDER BY id`);

            return rows.map(rowToEvent);
        } catch (err) {
            logger.error('Error fetching events %s', err);

            throw new Error('Error occured fetching events');
        }
    }

    async getEventById(id) {
        const rows = await this.db.query(`${SelectEvent} WHERE ${idColumn(id)} = $1`, [String(id)]);

        return rows[0] && rowToEvent(rows[0]);
    }

    async create(entry) {
        try {
            const rows = await this.db.query(
                `INSERT INTO events (${EventFields.map((field) => field.column).join(', ')}) ` +
                    `VALUES (${EventFields.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING id`,
                EventFields.map((field) => toColumnValue(field, entry[field.property]))
            );

            return { ...entry, _id: String(rows[0].id) };
        } catch (err) {
            logger.error('Error adding event %s %s', err, entry);

            throw new Error('Error occured adding event');
        }
    }

    async update(event) {
        const { _id, ...properties } = event;
        const fields = EventFields.filter((field) => field.property in properties);

        try {
            if (fields.length > 0) {
                await this.db.query(
                    `UPDATE events SET ${fields.map((field, index) => `${field.column} = $${index + 1}`).join(', ')} ` +
                        `WHERE ${idColumn(_id)} = $${fields.length + 1}`,
                    [
                        ...fields.map((field) => toColumnValue(field, properties[field.property])),
                        String(_id)
                    ]
                );
            }

            return event;
        } catch (err) {
            logger.error('Unable to update event %s', err);
            throw new Error('Unable to update event');
        }
    }

    async delete(id) {
        return this.db.query(`DELETE FROM events WHERE ${idColumn(id)} = $1`, [String(id)]);
    }
}

export default EventService;
