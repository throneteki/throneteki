import { formatDeckAsFullCards } from '../../deck-helper/formatDeckAsFullCards.js';
import { validateDeck } from '../../deck-helper/index.js';
import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';

export const Factions = [
    { name: 'House Baratheon', value: 'baratheon' },
    { name: 'House Greyjoy', value: 'greyjoy' },
    { name: 'House Lannister', value: 'lannister' },
    { name: 'House Martell', value: 'martell' },
    { name: "The Night's Watch", value: 'thenightswatch' },
    { name: 'House Stark', value: 'stark' },
    { name: 'House Targaryen', value: 'targaryen' },
    { name: 'House Tyrell', value: 'tyrell' }
];

const FilterableFields = ['name', 'faction.name', 'agenda.label'];
const SortColumns = {
    name: 'd.name',
    lastUpdated: 'd.last_updated',
    isFavourite: 'd.is_favourite'
};
const MaxPageSize = 50;
const MaxCardCount = 99;
const MaxFilterValueLength = 100;

const SelectDeck = `
    SELECT d.id, u.username, d.name, d.format, d.variant, d.faction_code, d.agenda_code, d.event_id,
        d.is_favourite, d.last_updated, d.standalone_deck_id,
        COALESCE((
            SELECT json_agg(json_build_object('section', c.section, 'code', c.card_code, 'count', c.count)
                ORDER BY c.section, c.position)
            FROM deck_cards c WHERE c.deck_id = d.id
        ), '[]') AS cards
    FROM decks d
    LEFT JOIN users u ON u.id = d.user_id`;

function factionFromCode(code) {
    return Factions.find((faction) => faction.value === code) || { name: code, value: code };
}

export function cardCode(card) {
    if (typeof card === 'string') {
        return card;
    }

    return (
        card?.cardcode ??
        card?.code ??
        (typeof card?.card === 'string' ? card.card : card?.card?.code)
    );
}

export function deckCardRows(deck) {
    const rows = [];
    const add = (section, cards, withCounts) => {
        let position = 0;

        for (const card of cards || []) {
            const code = cardCode(card);
            const count = withCounts ? Number(card?.count) : 1;

            if (code && Number.isInteger(count) && count > 0 && count <= MaxCardCount) {
                rows.push({ section, position: position++, card_code: code, count });
            }
        }
    };

    add('plot', deck.plotCards, true);
    add('draw', deck.drawCards, true);
    add('banner', deck.bannerCards, false);
    add('pool', deck.pool, true);

    return rows;
}

function rowToDeck(row) {
    const sections = { plot: [], draw: [], banner: [], pool: [] };
    for (const card of row.cards) {
        sections[card.section].push(card);
    }

    const deck = {
        _id: String(row.id),
        name: row.name,
        format: row.format,
        variant: row.variant,
        faction: factionFromCode(row.faction_code),
        agenda: row.agenda_code || undefined,
        bannerCards: sections.banner.map((card) => card.code),
        plotCards: sections.plot.map((card) => ({ cardcode: card.code, count: card.count })),
        drawCards: sections.draw.map((card) => ({ cardcode: card.code, count: card.count })),
        isFavourite: row.is_favourite,
        lastUpdated: row.last_updated
    };

    if (row.username) {
        deck.username = row.username;
    }

    if (row.standalone_deck_id) {
        deck.standaloneDeckId = row.standalone_deck_id;
    }

    if (row.event_id) {
        deck.eventId = String(row.event_id);
    }

    if (sections.pool.length > 0) {
        deck.pool = sections.pool.map((card) => ({ cardcode: card.code, count: card.count }));
    }

    return deck;
}

function escapeLike(value) {
    return String(value)
        .substring(0, MaxFilterValueLength)
        .replace(/[\\%_]/g, (character) => `\\${character}`);
}

function filterValues(value) {
    const values = Array.isArray(value) ? value : [value];

    return values.filter((val) => val !== undefined && val !== null && typeof val !== 'object');
}

function getQueryOptions(options, params) {
    const conditions = [];

    for (const filter of Array.isArray(options.filters) ? options.filters : []) {
        if (!filter || !FilterableFields.includes(filter.id)) {
            continue;
        }

        const values = filterValues(filter.value);
        if (values.length === 0) {
            continue;
        }

        if (filter.id === 'name') {
            params.push(values.map((val) => `%${escapeLike(val)}%`));
            conditions.push(`d.name ILIKE ANY ($${params.length}::text[])`);
        } else if (filter.id === 'faction.name') {
            const codes = Factions.filter((faction) =>
                values.some((val) =>
                    faction.name
                        .toLowerCase()
                        .includes(String(val).substring(0, MaxFilterValueLength).toLowerCase())
                )
            ).map((faction) => faction.value);

            params.push(codes);
            conditions.push(`d.faction_code = ANY ($${params.length}::text[])`);
        } else {
            params.push(values.map((val) => `%${escapeLike(val)}%`));
            conditions.push(
                `EXISTS (SELECT 1 FROM cards c WHERE c.code = d.agenda_code AND c.data->>'label' ILIKE ANY ($${params.length}::text[]))`
            );
        }
    }

    const requestedSort = Array.isArray(options.sorting) ? options.sorting[0] : undefined;
    const order =
        requestedSort && SortColumns[requestedSort.id]
            ? `${SortColumns[requestedSort.id]} ${requestedSort.desc === 'true' ? 'DESC' : 'ASC'}`
            : 'd.last_updated DESC';

    const page = Math.max(parseInt(options.pageNumber, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(options.pageSize, 10) || 10, 1), MaxPageSize);

    return { conditions, order, page, pageSize };
}

function eventIdExpression(index, eventId) {
    return `(SELECT id FROM events WHERE ${idColumn(eventId)} = $${index})`;
}

class DeckService {
    constructor(cardService, eventService, db = defaultDb) {
        this.cardService = cardService;
        this.eventService = eventService;
        this.db = db;
    }

    async init() {
        this.packs = await this.cardService.getAllPacks();
        this.cards = await this.cardService.getAllCards();
    }

    processDeck = async (deck, options = {}) => {
        deck.locked = !!deck.eventId;
        deck.status = {};

        let { eventId, format, variant, legality } = options;
        let event = null;
        if (eventId && eventId !== 'none') {
            event = await this.eventService.getEventById(eventId);
            if (event) {
                format = event.format;
                variant = event.variant;
                legality = event.legality;
            }
        }

        const legalityObj = await this.cardService.processLegality(
            format,
            variant,
            legality,
            event
        );
        // Only validate if all required parameters were provided
        // Note: Sometimes, deck validation is not needed, such as fetching deck id for deck update
        if (format && variant && legalityObj) {
            const fullDeck = formatDeckAsFullCards(deck, { cards: this.cards });
            deck.status = validateDeck(fullDeck, {
                packs: this.packs,
                format,
                variant,
                legality: legalityObj
            });
        }

        return deck;
    };

    async findDeck(where, params) {
        const rows = await this.db.query(`${SelectDeck} WHERE ${where} LIMIT 1`, params);

        return rows[0] ? rowToDeck(rows[0]) : null;
    }

    async getById(id, options = {}) {
        try {
            const deck = await this.findDeck(`d.${idColumn(id)} = $1`, [String(id)]);
            if (!deck) {
                return null;
            }

            deck.locked = !!deck.eventId;

            return await this.processDeck(deck, options);
        } catch (err) {
            logger.error('Unable to fetch deck %s', err);
            throw new Error('Unable to fetch deck ' + id);
        }
    }

    async getByName(name) {
        const deck = await this.findDeck('d.name = $1 ORDER BY d.id', [name]);
        if (!deck) {
            throw new Error('Unable to fetch deck ' + name);
        }

        deck.locked = !!deck.eventId;

        return deck;
    }

    async getByStandaloneId(id) {
        try {
            return await this.findDeck('d.standalone_deck_id = $1', [String(id)]);
        } catch (err) {
            logger.error('Unable to fetch standalone deck %s', err);
            throw new Error('Unable to fetch standalone deck ' + id);
        }
    }

    async findDecks(baseCondition, baseParams, options) {
        const params = [...baseParams];
        const { conditions, order, page, pageSize } = getQueryOptions(options, params);
        const where = [baseCondition, ...conditions].join(' AND ');

        const [{ count }] = await this.db.query(
            `SELECT count(*) AS count FROM decks d LEFT JOIN users u ON u.id = d.user_id WHERE ${where}`,
            params
        );

        if (count === 0) {
            return { success: true, data: [], totalCount: 0, page, pageSize };
        }

        const rows = await this.db.query(
            `${SelectDeck} WHERE ${where} ORDER BY ${order}, d.id LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
            params
        );

        const data = [];
        for (const row of rows) {
            data.push(await this.processDeck(rowToDeck(row), options));
        }

        return { totalCount: count, page, pageSize, success: true, data };
    }

    findByUserName(username, options = {}) {
        return this.findDecks('lower(u.username) = lower($1)', [username], options);
    }

    getStandaloneDecks(options = {}) {
        return this.findDecks('d.standalone_deck_id IS NOT NULL', [], options);
    }

    removeEventIdAndUnlockDecks(eventId) {
        return this.db.query(
            `UPDATE decks SET event_id = NULL WHERE event_id = ${eventIdExpression(1, eventId)}`,
            [String(eventId)]
        );
    }

    async insertDeck(properties) {
        try {
            return await this.db.transaction(async (tx) => {
                const [{ id }] = await tx.query(
                    `INSERT INTO decks (user_id, standalone_deck_id, name, format, variant, faction_code, agenda_code,
                        event_id, last_updated)
                    VALUES ((SELECT id FROM users WHERE lower(username) = lower($1)), $2, $3, $4, $5, $6, $7,
                        ${eventIdExpression(8, properties.eventId)}, $9)
                    RETURNING id`,
                    [
                        properties.username ?? null,
                        properties.standaloneDeckId ?? null,
                        properties.name,
                        properties.format ?? null,
                        properties.variant ?? null,
                        properties.faction?.value ?? properties.faction,
                        cardCode(properties.agenda) ?? null,
                        properties.eventId ? String(properties.eventId) : null,
                        properties.lastUpdated || new Date()
                    ]
                );

                await this.replaceCards(tx, id, properties);

                return rowToDeck((await tx.query(`${SelectDeck} WHERE d.id = $1`, [id]))[0]);
            });
        } catch (err) {
            if (err.constraint === 'decks_user_id_event_id_key') {
                throw new Error(
                    `User ${properties.username} already has a deck configured for event ${properties.eventId}`
                );
            }

            throw err;
        }
    }

    async replaceCards(tx, deckId, deck) {
        await tx.query('DELETE FROM deck_cards WHERE deck_id = $1', [deckId]);
        await tx.query(
            `INSERT INTO deck_cards (deck_id, section, position, card_code, count)
            SELECT $1, c.section, c.position, c.card_code, c.count
            FROM jsonb_to_recordset($2::jsonb) AS c(section text, position integer, card_code text, count integer)`,
            [deckId, JSON.stringify(deckCardRows(deck))]
        );
    }

    async create(deck) {
        if (deck.eventId) {
            if (await this.userAlreadyHasDeckForEvent(deck.username, deck.eventId)) {
                throw new Error(
                    `User ${deck.username} already has a deck configured for event ${deck.eventId}`
                );
            }
        }

        return this.insertDeck({ ...deck, standaloneDeckId: undefined, lastUpdated: new Date() });
    }

    createStandalone(deck) {
        return this.insertDeck({ ...deck, username: undefined, eventId: undefined });
    }

    async update(deck) {
        let previousVersion = await this.getById(deck.id);
        if (previousVersion.locked) {
            throw new Error('Locked decks can not be updated');
        }

        if (deck.eventId) {
            if (await this.userAlreadyHasDeckForEvent(previousVersion.username, deck.eventId)) {
                throw new Error(
                    `User ${previousVersion.username} already has a deck configured for event ${deck.eventId}`
                );
            }
        }

        return this.db.transaction(async (tx) => {
            await tx.query(
                `UPDATE decks SET name = $1, format = $2, variant = $3, faction_code = $4, agenda_code = $5,
                    event_id = ${eventIdExpression(6, deck.eventId)},
                    is_favourite = COALESCE($7, is_favourite), last_updated = now()
                WHERE id = $8`,
                [
                    deck.name,
                    deck.format ?? null,
                    deck.variant ?? null,
                    deck.faction?.value ?? deck.faction,
                    cardCode(deck.agenda) ?? null,
                    deck.eventId ? String(deck.eventId) : null,
                    deck.isFavourite === undefined ? null : !!deck.isFavourite,
                    previousVersion._id
                ]
            );

            await this.replaceCards(tx, previousVersion._id, deck);
        });
    }

    async delete(id) {
        let previousVersion = await this.getById(id);
        if (previousVersion.locked) {
            throw new Error('Can not delete a locked deck');
        }

        return this.db.query('DELETE FROM decks WHERE id = $1', [previousVersion._id]);
    }

    async userAlreadyHasDeckForEvent(username, eventId) {
        return !!(await this.getDeckForEvent(username, eventId));
    }

    async getDeckForEvent(username, eventId) {
        try {
            const deck = await this.findDeck(
                `lower(u.username) = lower($1) AND d.event_id = ${eventIdExpression(2, eventId)}`,
                [username, String(eventId)]
            );

            if (!deck) {
                return null;
            }

            deck.locked = true;

            return await this.processDeck(deck, { eventId });
        } catch (err) {
            throw new Error(`Unable to fetch deck with parameters ${username} and ${eventId}`);
        }
    }

    async useDeckForEvent(deckId, eventId) {
        const deck = await this.getById(deckId);

        if (await this.userAlreadyHasDeckForEvent(deck.username, eventId)) {
            throw new Error(
                `User ${deck.username} already has a deck configured for event ${eventId}`
            );
        }

        return this.db.query(
            `UPDATE decks SET event_id = ${eventIdExpression(1, eventId)} WHERE id = $2`,
            [String(eventId), deck._id]
        );
    }
}

export default DeckService;
