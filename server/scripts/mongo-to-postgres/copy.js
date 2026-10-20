import {
    mongoId,
    transformAbuseBlock,
    transformAbuseEvent,
    transformBanlistEntry,
    transformDeck,
    transformDraftCube,
    transformEvent,
    transformGame,
    transformMessage,
    transformNews,
    transformUser
} from './transforms.js';

const MaxExamples = 5;

function column(name, type = 'text') {
    if (type === 'inet') {
        return { name, type: 'text', expression: `r.${name}::inet` };
    }

    if (type === 'cidr') {
        return { name, type: 'text', expression: `network(r.${name}::inet)` };
    }

    return { name, type, expression: `r.${name}` };
}

const Tables = {
    users: [
        column('mongo_id'),
        column('username'),
        column('email'),
        column('email_domain'),
        column('password'),
        column('registered_at', 'timestamptz'),
        column('verified', 'boolean'),
        column('disabled', 'boolean'),
        column('enable_gravatar', 'boolean'),
        column('settings', 'jsonb'),
        column('prompted_action_windows', 'jsonb'),
        column('patreon', 'jsonb'),
        column('activation_token_hash'),
        column('activation_token_expires_at', 'timestamptz'),
        column('activation_token_issued_at', 'timestamptz'),
        column('reset_token_hash'),
        column('reset_token_expires_at', 'timestamptz'),
        column('reset_token_issued_at', 'timestamptz'),
        column('register_ip', 'inet'),
        column('register_ip_normalized', 'inet'),
        column('register_subnet', 'cidr'),
        column('last_login_ip', 'inet'),
        column('last_login_subnet', 'cidr'),
        column('signup_fingerprint_hash'),
        column('risk_score', 'integer'),
        column('risk_flags', 'text[]'),
        column('trust_state'),
        column('restricted_until', 'timestamptz'),
        column('evasion_review_required', 'boolean'),
        column('ban_reason'),
        column('mod_notes'),
        column('legacy', 'jsonb')
    ],
    banlist: [
        column('mongo_id'),
        column('ip'),
        column('created_by'),
        column('created_at', 'timestamptz')
    ],
    abuse_blocks: [
        column('mongo_id'),
        column('scope'),
        {
            name: 'value',
            type: 'text',
            expression:
                "CASE r.value_kind WHEN 'ip' THEN host(r.value::inet) WHEN 'subnet' THEN network(r.value::inet)::text ELSE r.value END"
        },
        { name: 'value_kind', type: 'text', recordOnly: true },
        column('reason'),
        column('source_user_id', 'bigint'),
        column('created_by'),
        column('created_at', 'timestamptz'),
        column('expires_at', 'timestamptz'),
        column('active', 'boolean'),
        column('deactivated_at', 'timestamptz')
    ],
    abuse_events: [
        column('mongo_id'),
        column('type'),
        column('username'),
        column('user_id', 'bigint'),
        column('ip', 'inet'),
        column('subnet', 'cidr'),
        column('fingerprint_hash'),
        column('email_domain'),
        column('outcome'),
        column('signals', 'text[]'),
        column('score_delta', 'integer'),
        column('created_at', 'timestamptz'),
        column('created_by')
    ],
    events: [
        column('mongo_id'),
        column('name'),
        column('format'),
        column('variant'),
        column('legality', 'jsonb'),
        column('custom_legality', 'jsonb'),
        column('game_type'),
        column('lock_decks', 'boolean'),
        column('use_event_game_options', 'boolean'),
        column('event_game_options', 'jsonb'),
        column('valid_table_creators', 'text[]'),
        column('valid_spectators', 'text[]'),
        column('legacy', 'jsonb')
    ],
    draft_cubes: [
        column('mongo_id'),
        column('name'),
        column('pack_definitions', 'jsonb'),
        column('starter_deck', 'jsonb'),
        column('last_updated', 'timestamptz')
    ],
    decks: [
        column('mongo_id'),
        column('user_id', 'bigint'),
        column('standalone_deck_id'),
        column('name'),
        column('format'),
        column('variant'),
        column('faction_code'),
        column('agenda_code'),
        column('event_id', 'bigint'),
        column('is_favourite', 'boolean'),
        column('last_updated', 'timestamptz')
    ],
    games: [
        column('mongo_id'),
        column('game_id'),
        column('event_name'),
        column('started_at', 'timestamptz'),
        column('finished_at', 'timestamptz'),
        column('winners', 'text[]'),
        column('win_reason'),
        column('game_type'),
        column('legacy', 'jsonb')
    ],
    messages: [
        column('mongo_id'),
        column('user_id', 'bigint'),
        column('poster', 'jsonb'),
        column('message'),
        column('posted_at', 'timestamptz'),
        column('deleted', 'boolean'),
        column('deleted_by')
    ],
    news: [
        column('mongo_id'),
        column('poster'),
        column('text'),
        column('published_at', 'timestamptz')
    ]
};

function recordsetQuery(table, columns, { conflict } = {}) {
    const stored = columns.filter((col) => !col.recordOnly);
    const update = stored
        .filter((col) => col.name !== 'mongo_id')
        .map((col) => `${col.name} = EXCLUDED.${col.name}`)
        .join(', ');

    return `INSERT INTO ${table} (${stored.map((col) => col.name).join(', ')})
        SELECT ${stored.map((col) => col.expression).join(', ')}
        FROM jsonb_to_recordset($1::jsonb) AS r(${columns.map((col) => `${col.name} ${col.type}`).join(', ')})
        ${conflict === false ? '' : `ON CONFLICT (mongo_id) DO UPDATE SET ${update}`}
        RETURNING mongo_id, id`;
}

const Collections = [
    {
        collection: 'users',
        table: 'users',
        transform: transformUser,
        uniqueKeys: [
            {
                expression: 'lower(username)',
                key: (row) => row.username.toLowerCase(),
                reason: 'username clashes with an earlier user once case is ignored'
            },
            {
                expression: 'lower(email)',
                key: (row) => (row.email ? row.email.toLowerCase() : null),
                reason: 'email clashes with an earlier user once case is ignored'
            }
        ],
        copyChildren: async (tx, copied) => {
            const ids = copied.map(({ id }) => id);
            await tx.query('DELETE FROM user_permissions WHERE user_id = ANY($1::bigint[])', [ids]);
            await tx.query('DELETE FROM user_blocks WHERE user_id = ANY($1::bigint[])', [ids]);
            await tx.query('DELETE FROM refresh_tokens WHERE user_id = ANY($1::bigint[])', [ids]);

            const permissions = copied.flatMap(({ id, children }) =>
                children.permissions.map((permission) => ({ user_id: id, permission }))
            );
            const blocks = copied.flatMap(({ id, children }) =>
                children.blocks.map((blocked_username) => ({ user_id: id, blocked_username }))
            );
            const tokens = copied.flatMap(({ id, children }) =>
                children.tokens.map((token) => ({ ...token, user_id: id }))
            );

            await tx.query(
                `INSERT INTO user_permissions (user_id, permission)
                SELECT r.user_id, r.permission FROM jsonb_to_recordset($1::jsonb) AS r(user_id bigint, permission text)
                ON CONFLICT DO NOTHING`,
                [JSON.stringify(permissions)]
            );
            await tx.query(
                `INSERT INTO user_blocks (user_id, blocked_username)
                SELECT r.user_id, r.blocked_username FROM jsonb_to_recordset($1::jsonb) AS r(user_id bigint, blocked_username text)
                ON CONFLICT DO NOTHING`,
                [JSON.stringify(blocks)]
            );
            await tx.query(
                `INSERT INTO refresh_tokens (user_id, token_id, token, expires_at, ip, last_used_at)
                SELECT r.user_id, r.token_id, r.token, r.expires_at, r.ip::inet, COALESCE(r.last_used_at, now())
                FROM jsonb_to_recordset($1::jsonb)
                    AS r(user_id bigint, token_id text, token text, expires_at timestamptz, ip text, last_used_at timestamptz)
                ON CONFLICT (token_id) DO NOTHING`,
                [JSON.stringify(tokens)]
            );
        }
    },
    {
        collection: 'banlist',
        table: 'banlist',
        transform: transformBanlistEntry,
        uniqueKeys: [
            {
                expression: 'ip',
                key: (row) => row.ip,
                reason: 'ip is already banned by an earlier entry'
            }
        ]
    },
    { collection: 'abuse_blocks', table: 'abuse_blocks', transform: transformAbuseBlock },
    {
        collection: 'abuse_events',
        table: 'abuse_events',
        transform: transformAbuseEvent,
        sinceField: 'createdAt'
    },
    { collection: 'events', table: 'events', transform: transformEvent },
    { collection: 'draftCubes', table: 'draft_cubes', transform: transformDraftCube },
    {
        collection: 'decks',
        table: 'decks',
        transform: transformDeck,
        uniqueKeys: [
            {
                expression: 'standalone_deck_id',
                key: (row) => row.standalone_deck_id,
                reason: 'standalone deck id is already used by an earlier deck'
            }
        ],
        copyChildren: async (tx, copied) => {
            await tx.query('DELETE FROM deck_cards WHERE deck_id = ANY($1::bigint[])', [
                copied.map(({ id }) => id)
            ]);
            await tx.query(
                `INSERT INTO deck_cards (deck_id, section, position, card_code, count)
                SELECT r.deck_id, r.section, r.position, r.card_code, r.count
                FROM jsonb_to_recordset($1::jsonb)
                    AS r(deck_id bigint, section text, position integer, card_code text, count integer)`,
                [
                    JSON.stringify(
                        copied.flatMap(({ id, children }) =>
                            children.cards.map((card) => ({ ...card, deck_id: id }))
                        )
                    )
                ]
            );
        }
    },
    {
        collection: 'games',
        table: 'games',
        transform: transformGame,
        sinceField: 'startedAt',
        uniqueKeys: [
            {
                expression: 'game_id',
                key: (row) => row.game_id,
                reason: 'game id is already used by an earlier game'
            }
        ],
        copyChildren: async (tx, copied) => {
            await tx.query('DELETE FROM game_players WHERE game_id = ANY($1::bigint[])', [
                copied.map(({ id }) => id)
            ]);
            await tx.query(
                `INSERT INTO game_players (game_id, position, name, user_id, faction, agendas, power, eliminated, details)
                SELECT r.game_id, r.position, r.name, (SELECT id FROM users WHERE lower(username) = lower(r.name)),
                    r.faction, r.agendas, r.power, r.eliminated, r.details
                FROM jsonb_to_recordset($1::jsonb)
                    AS r(game_id bigint, position integer, name text, faction text, agendas text[], power integer,
                        eliminated boolean, details jsonb)`,
                [
                    JSON.stringify(
                        copied.flatMap(({ id, children }) =>
                            children.players.map((player) => ({ ...player, game_id: id }))
                        )
                    )
                ]
            );
        }
    },
    { collection: 'messages', table: 'messages', transform: transformMessage },
    { collection: 'news', table: 'news', transform: transformNews }
];

export const CollectionNames = Collections.map(({ collection }) => collection);

class Report {
    constructor() {
        this.collections = {};
    }

    for(collection) {
        if (!this.collections[collection]) {
            this.collections[collection] = { read: 0, copied: 0, skipped: {}, issues: {} };
        }

        return this.collections[collection];
    }

    note(collection, kind, reason, id) {
        const entries = this.for(collection)[kind];
        const entry = entries[reason] || (entries[reason] = { count: 0, examples: [] });

        entry.count++;
        if (entry.examples.length < MaxExamples) {
            entry.examples.push(id);
        }
    }
}

const RecentlyUsedMs = 5 * 365 * 24 * 60 * 60 * 1000;

function groupsOf(accounts, key) {
    const groups = new Map();

    for (const account of accounts) {
        const value = key(account);
        if (value) {
            groups.set(value, [...(groups.get(value) || []), account]);
        }
    }

    return [...groups.values()].filter((group) => group.length > 1);
}

function byMostLikelyUsed(a, b) {
    return (
        b.lastActive - a.lastActive ||
        b.uses - a.uses ||
        a.registered - b.registered ||
        a.id.localeCompare(b.id)
    );
}

async function analyseUsers(source, now = Date.now()) {
    const accounts = [];

    for await (const docs of source.batches('users', {}, 5000)) {
        for (const doc of docs) {
            if (typeof doc.username !== 'string') {
                continue;
            }

            accounts.push({
                id: mongoId(doc._id),
                username: doc.username,
                email: typeof doc.email === 'string' && doc.email ? doc.email.toLowerCase() : null,
                registered: new Date(doc.registered).getTime() || 0,
                lastActive: Math.max(
                    0,
                    ...(Array.isArray(doc.tokens) ? doc.tokens : []).map(
                        (token) => new Date(token?.lastUsed).getTime() || 0
                    )
                ),
                uses: 0
            });
        }
    }

    const nameGroups = groupsOf(accounts, (account) => account.username.toLowerCase());
    const emailGroups = groupsOf(accounts, (account) => account.email);
    const contested = new Map();
    for (const account of [...nameGroups, ...emailGroups].flat()) {
        contested.set(account.username, [
            ...new Set([...(contested.get(account.username) || []), account])
        ]);
    }

    const record = (name, time) => {
        for (const account of contested.get(name) || []) {
            account.uses++;
            account.lastActive = Math.max(account.lastActive, new Date(time).getTime() || 0);
        }
    };
    const names = [...contested.keys()];

    if (names.length > 0) {
        for await (const docs of source.batches('decks', { username: { $in: names } }, 5000)) {
            docs.forEach((deck) => record(deck.username, deck.lastUpdated));
        }

        for await (const docs of source.batches(
            'messages',
            { 'user.username': { $in: names } },
            5000
        )) {
            docs.forEach((message) => record(message.user?.username, message.time));
        }

        for await (const docs of source.batches(
            'games',
            { 'players.name': { $in: names } },
            5000
        )) {
            for (const game of docs) {
                for (const player of Array.isArray(game.players) ? game.players : []) {
                    record(player?.name, game.startedAt);
                }
            }
        }
    }

    const skipped = new Map();
    const clearedEmails = new Set();

    for (const group of nameGroups) {
        const [, ...others] = [...group].sort(byMostLikelyUsed);
        for (const account of others) {
            skipped.set(
                account.id,
                'username clashes, once case is ignored, with an account that was used more recently'
            );
        }
    }

    for (const group of emailGroups) {
        const [, ...others] = group
            .filter((account) => !skipped.has(account.id))
            .sort(byMostLikelyUsed);
        for (const account of others) {
            if (now - account.lastActive < RecentlyUsedMs) {
                clearedEmails.add(account.id);
            } else {
                skipped.set(
                    account.id,
                    'email shared with an account that was used more recently, and not used in five years'
                );
            }
        }
    }

    const keptNames = new Set(
        accounts.filter((account) => !skipped.has(account.id)).map((account) => account.username)
    );
    const usernames = new Set(
        accounts
            .filter((account) => skipped.has(account.id) && !keptNames.has(account.username))
            .map((account) => account.username)
    );

    return { skipped, clearedEmails, usernames };
}

async function loadContext(db, duplicates) {
    const users = await db.query('SELECT mongo_id, id, lower(username) AS username FROM users');
    const events = await db.query('SELECT mongo_id, id FROM events WHERE mongo_id IS NOT NULL');
    const byMongoId = new Map(
        users.filter((user) => user.mongo_id).map((user) => [user.mongo_id, user.id])
    );
    const byName = new Map(users.map((user) => [user.username, user.id]));
    const eventsByMongoId = new Map(events.map((event) => [event.mongo_id, event.id]));
    const eventDecks = new Set();

    return {
        duplicateUserReason: (doc) => duplicates.skipped.get(mongoId(doc._id)),
        isClearedEmail: (doc) => duplicates.clearedEmails.has(mongoId(doc._id)),
        isDuplicateUsername: (name) => duplicates.usernames.has(name),
        userIdByMongoId: (id) => byMongoId.get(mongoId(id)) ?? null,
        userIdByName: (name) =>
            typeof name === 'string' ? (byName.get(name.toLowerCase()) ?? null) : null,
        eventIdByMongoId: (id) => eventsByMongoId.get(mongoId(id)) ?? null,
        claimEventDeck: (userId, eventId) => {
            const key = `${userId}:${eventId}`;
            if (eventDecks.has(key)) {
                return false;
            }

            eventDecks.add(key);

            return true;
        }
    };
}

async function removeUniqueClashes(db, spec, candidates, report) {
    let remaining = candidates;

    for (const uniqueKey of spec.uniqueKeys || []) {
        const keyed = remaining.filter((candidate) => uniqueKey.key(candidate.row) !== null);
        const existing = await db.query(
            `SELECT mongo_id, ${uniqueKey.expression} AS key FROM ${spec.table} WHERE ${uniqueKey.expression} = ANY($1)`,
            [keyed.map((candidate) => uniqueKey.key(candidate.row))]
        );
        const owners = new Map(existing.map((row) => [row.key, row.mongo_id]));

        remaining = remaining.filter((candidate) => {
            const key = uniqueKey.key(candidate.row);
            if (key === null) {
                return true;
            }

            const owner = owners.get(key);
            if (owner !== undefined && owner !== candidate.row.mongo_id) {
                report.note(spec.collection, 'skipped', uniqueKey.reason, candidate.row.mongo_id);

                return false;
            }

            owners.set(key, candidate.row.mongo_id);

            return true;
        });
    }

    return remaining;
}

async function copyBatch(db, spec, docs, context, report) {
    const stats = report.for(spec.collection);
    let candidates = [];

    for (const doc of docs) {
        stats.read++;

        const transformed = spec.transform(doc, context);
        for (const issue of transformed.issues) {
            report.note(spec.collection, 'issues', issue, mongoId(doc._id));
        }

        if (transformed.skip) {
            report.note(spec.collection, 'skipped', transformed.skip, mongoId(doc._id));
            continue;
        }

        candidates.push(transformed);
    }

    candidates = await removeUniqueClashes(db, spec, candidates, report);
    if (candidates.length === 0) {
        return;
    }

    await db.transaction(async (tx) => {
        const rows = await tx.query(recordsetQuery(spec.table, Tables[spec.table]), [
            JSON.stringify(candidates.map((candidate) => candidate.row))
        ]);
        const ids = new Map(rows.map((row) => [row.mongo_id, row.id]));

        if (spec.copyChildren) {
            await spec.copyChildren(
                tx,
                candidates.map((candidate) => ({
                    id: ids.get(candidate.row.mongo_id),
                    children: candidate.children
                }))
            );
        }

        stats.copied += rows.length;
    });
}

async function copyMessageOfTheDay(source, db, report) {
    for await (const docs of source.batches('messages', { type: 'motd' }, 10)) {
        for (const doc of docs) {
            await db.query(
                `INSERT INTO motd (id, poster, message, motd_type, posted_at) VALUES (true, $1, $2, $3, $4)
                ON CONFLICT (id) DO UPDATE SET poster = $1, message = $2, motd_type = $3, posted_at = $4`,
                [
                    doc.user ? JSON.stringify(doc.user) : null,
                    doc.message ?? null,
                    doc.motdType ?? null,
                    doc.time ? new Date(doc.time) : null
                ]
            );
            report.for('motd').copied = 1;
        }
    }
}

export async function copyFromMongo({
    source,
    db,
    collections = CollectionNames,
    since,
    batchSize = 1000,
    log = () => {}
}) {
    const report = new Report();
    const duplicates = await analyseUsers(source);

    for (const spec of Collections.filter((item) => collections.includes(item.collection))) {
        const query = since && spec.sinceField ? { [spec.sinceField]: { $gte: since } } : {};
        const context = await loadContext(db, duplicates);
        const started = Date.now();

        log(`Copying ${spec.collection}`);
        for await (const docs of source.batches(spec.collection, query, batchSize)) {
            await copyBatch(db, spec, docs, context, report);
            log(`  ${spec.collection}: ${report.for(spec.collection).read} read`);
        }

        const stats = report.for(spec.collection);
        stats.seconds = Math.round((Date.now() - started) / 1000);
        stats.mongoCount = await source.count(spec.collection, query);
        stats.postgresCount = (
            await db.query(`SELECT count(*) AS count FROM ${spec.table} WHERE mongo_id IS NOT NULL`)
        )[0].count;
    }

    if (collections.includes('messages')) {
        await copyMessageOfTheDay(source, db, report);
    }

    return report.collections;
}
