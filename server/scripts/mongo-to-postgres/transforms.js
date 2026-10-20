import moment from 'moment';
import AbuseService from '../../services/AbuseService.js';
import { cardCode, deckCardRows } from '../../services/DeckService.js';
import { EventFields } from '../../services/EventService.js';
import { playerRows, toWinners } from '../../services/GameService.js';
import { toCidr, toInet } from '../../db/network.js';
import { Permissions, UserFields } from '../../services/UserService.js';

const TrustStates = ['trusted', 'new', 'restricted', 'banned_evasion_review'];
const BlockScopes = ['ip', 'subnet', 'fingerprint', 'email_domain'];
const UserDateFields = [
    'registered',
    'activationTokenExpiry',
    'activationTokenIssuedAt',
    'tokenExpires',
    'resetTokenIssuedAt',
    'restrictedUntil'
];
const DroppedUserFields = [
    '_id',
    'tokens',
    'permissions',
    'blockList',
    'activationToken',
    'activationTokenVersion',
    'resetToken',
    'resetTokenVersion'
];

const abuseRules = new AbuseService({ getValue: () => undefined });

export function parseDate(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'number') {
        return parseDate(new Date(value));
    }

    const parsed = moment(String(value), [moment.ISO_8601, 'YYYYMMDD-HH:mm:ss'], true);

    return parsed.isValid() ? parsed.toDate() : null;
}

export function mongoId(value) {
    return value === undefined || value === null ? null : String(value);
}

function result() {
    const issues = [];

    return {
        issues,
        issue: (reason) => issues.push(reason),
        skip: (reason) => ({ skip: reason, issues })
    };
}

function stringArray(value) {
    return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
}

export function transformUser(doc, context) {
    const { issues, issue, skip } = result();

    if (!doc.username) {
        return skip('no username');
    }

    const duplicateReason = context.duplicateUserReason(doc);
    if (duplicateReason) {
        return skip(duplicateReason);
    }

    const row = { mongo_id: mongoId(doc._id) };

    for (const field of UserFields) {
        let value = doc[field.property];

        if (UserDateFields.includes(field.property)) {
            const date = parseDate(value);
            if (value && !date) {
                issue(`invalid ${field.property}`);
            }

            value = date;
        } else if (field.type === 'inet' && value) {
            value = toInet(value) ?? toInet(abuseRules.normalizeIp(value));
            if (!value) {
                issue(`invalid ${field.property}`);
            }
        } else if (field.type === 'cidr' && value) {
            value = toCidr(value);
            if (!value) {
                issue(`invalid ${field.property}`);
            }
        }

        row[field.column] = value ?? null;
    }

    if (!row.registered_at) {
        issue('no registered date');
        row.registered_at = new Date(0);
    }
    row.verified = !!doc.verified;
    row.disabled = !!doc.disabled;
    row.enable_gravatar = !!doc.enableGravatar;
    row.evasion_review_required = !!doc.evasionReviewRequired;
    row.settings = doc.settings && typeof doc.settings === 'object' ? doc.settings : {};
    row.prompted_action_windows =
        doc.promptedActionWindows && typeof doc.promptedActionWindows === 'object'
            ? doc.promptedActionWindows
            : {};
    row.risk_score = Number.isFinite(Number(doc.riskScore)) ? Math.round(Number(doc.riskScore)) : 0;
    row.risk_flags = stringArray(doc.riskFlags);

    if (!TrustStates.includes(row.trust_state)) {
        if (row.trust_state) {
            issue(`unknown trustState ${row.trust_state}`);
        }

        row.trust_state = 'trusted';
    }

    const mapped = new Set([...UserFields.map((field) => field.property), ...DroppedUserFields]);
    const legacy = Object.fromEntries(Object.entries(doc).filter(([key]) => !mapped.has(key)));

    if (context.isClearedEmail(doc)) {
        issue('email shared with an account that was used more recently, removed');
        legacy.removedDuplicateEmail = doc.email;
        row.email = null;
    }

    row.legacy = Object.keys(legacy).length > 0 ? legacy : null;

    if (doc.activationToken && !doc.activationTokenHash) {
        issue('dropped legacy activation token');
    }

    if (doc.resetToken && !doc.resetTokenHash) {
        issue('dropped legacy reset token');
    }

    const permissions = Object.keys(doc.permissions || {}).filter((key) => doc.permissions[key]);
    for (const permission of permissions.filter((key) => !Permissions.includes(key))) {
        issue(`unknown permission ${permission}`);
    }

    const tokens = [];
    for (const token of Array.isArray(doc.tokens) ? doc.tokens : []) {
        const expiresAt = parseDate(token?.exp);

        if (!token?._id || typeof token.token !== 'string' || !expiresAt) {
            issue('dropped invalid refresh token');
            continue;
        }

        tokens.push({
            token_id: String(token._id),
            token: token.token,
            expires_at: expiresAt,
            ip: toInet(token.ip),
            last_used_at: parseDate(token.lastUsed)
        });
    }

    return {
        row,
        issues,
        children: {
            permissions: permissions.filter((key) => Permissions.includes(key)),
            blocks: [
                ...new Set(stringArray(doc.blockList).map((username) => username.toLowerCase()))
            ],
            tokens
        }
    };
}

export function transformBanlistEntry(doc) {
    const { issues, skip } = result();

    if (!doc.ip) {
        return skip('no ip');
    }

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            ip: String(doc.ip),
            created_by: doc.user ?? null,
            created_at: parseDate(doc.added) || new Date(0)
        }
    };
}

export function transformAbuseBlock(doc, context) {
    const { issues, issue, skip } = result();
    const scope = doc.scope || 'ip';

    if (!BlockScopes.includes(scope)) {
        return skip(`unknown scope ${scope}`);
    }

    if (!doc.value) {
        return skip('no value');
    }

    const value = String(doc.value);
    let kind = 'text';
    if (scope === 'ip' && toInet(value)) {
        kind = 'ip';
    } else if (scope === 'subnet' && toCidr(value)) {
        kind = 'subnet';
    } else if (scope === 'ip' || scope === 'subnet') {
        issue(`${scope} block value is not an address`);
    }

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            scope,
            value,
            value_kind: kind,
            reason: doc.reason ?? null,
            source_user_id: context.userIdByMongoId(doc.sourceUserId),
            created_by: doc.createdBy ?? null,
            created_at: parseDate(doc.createdAt) || new Date(0),
            expires_at: parseDate(doc.expiresAt),
            active: doc.active !== false,
            deactivated_at: parseDate(doc.deactivatedAt)
        }
    };
}

export function transformAbuseEvent(doc, context) {
    const { issues, skip } = result();

    if (!doc.type) {
        return skip('no type');
    }

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            type: doc.type,
            username: doc.username ?? null,
            user_id: context.userIdByMongoId(doc.userId),
            ip: toInet(abuseRules.normalizeIp(doc.ip)),
            subnet: toCidr(doc.subnet),
            fingerprint_hash: doc.fingerprintHash ?? null,
            email_domain: doc.emailDomain ?? null,
            outcome: doc.outcome || 'allowed',
            signals: stringArray(doc.signals),
            score_delta: Number.isFinite(Number(doc.scoreDelta))
                ? Math.round(Number(doc.scoreDelta))
                : 0,
            created_at: parseDate(doc.createdAt) || new Date(0),
            created_by: doc.createdBy ?? null
        }
    };
}

export function transformEvent(doc) {
    const { issues, skip } = result();

    if (!doc.name) {
        return skip('no name');
    }

    const row = { mongo_id: mongoId(doc._id) };
    for (const field of EventFields) {
        row[field.column] = doc[field.property] ?? field.default ?? null;
    }

    row.valid_table_creators = Array.isArray(doc.validTableCreators)
        ? stringArray(doc.validTableCreators)
        : null;
    row.valid_spectators = Array.isArray(doc.validSpectators)
        ? stringArray(doc.validSpectators)
        : null;

    const mapped = new Set(['_id', ...EventFields.map((field) => field.property)]);
    const legacy = Object.fromEntries(Object.entries(doc).filter(([key]) => !mapped.has(key)));
    row.legacy = Object.keys(legacy).length > 0 ? legacy : null;

    return { row, issues };
}

export function transformDraftCube(doc) {
    const { issues, skip } = result();

    if (!doc.name) {
        return skip('no name');
    }

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            name: doc.name,
            pack_definitions: Array.isArray(doc.packDefinitions) ? doc.packDefinitions : [],
            starter_deck: doc.starterDeck ?? null,
            last_updated: parseDate(doc.lastUpdated) || new Date(0)
        }
    };
}

export function transformDeck(doc, context) {
    const { issues, issue, skip } = result();

    const factionCode =
        doc.faction?.value ?? (typeof doc.faction === 'string' ? doc.faction : undefined);
    if (!factionCode) {
        return skip('no faction');
    }

    let userId = null;
    if (!doc.standaloneDeckId) {
        if (context.isDuplicateUsername(doc.username)) {
            return skip('owner was a duplicate account that was not copied');
        }

        userId = context.userIdByName(doc.username);

        if (!userId) {
            return skip('owner not found');
        }
    }

    let eventId = null;
    if (doc.eventId) {
        eventId = context.eventIdByMongoId(doc.eventId);

        if (!eventId) {
            issue('event not found, deck unlocked');
        } else if (!context.claimEventDeck(userId, eventId)) {
            issue('second deck for the same event, deck unlocked');
            eventId = null;
        }
    }

    if (!doc.name) {
        issue('no name');
    }

    if (Array.isArray(doc.rookeryCards) && doc.rookeryCards.length > 0) {
        issue('dropped rookery cards');
    }

    const cards = deckCardRows(doc);
    const listed = ['plotCards', 'drawCards', 'bannerCards', 'pool'].reduce(
        (total, section) =>
            total +
            (Array.isArray(doc[section])
                ? doc[section].filter((card) => card?.count !== 0).length
                : 0),
        0
    );
    if (cards.length < listed) {
        issue('dropped cards with no code or an impossible count');
    }

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            user_id: userId,
            standalone_deck_id: doc.standaloneDeckId ? String(doc.standaloneDeckId) : null,
            name: String(doc.name ?? ''),
            format: doc.format ?? null,
            variant: doc.variant ?? null,
            faction_code: String(factionCode),
            agenda_code: cardCode(doc.agenda) ?? null,
            event_id: eventId,
            is_favourite: !!doc.isFavourite,
            last_updated: parseDate(doc.lastUpdated) || new Date(0)
        },
        children: { cards }
    };
}

const MappedGameFields = [
    '_id',
    'gameId',
    'eventName',
    'startedAt',
    'finishedAt',
    'winner',
    'winReason',
    'gameType',
    'players'
];

export function transformGame(doc) {
    const { issues } = result();
    const legacy = Object.fromEntries(
        Object.entries(doc).filter(
            ([key, value]) =>
                !MappedGameFields.includes(key) && value !== null && value !== undefined
        )
    );

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            game_id: doc.gameId ? String(doc.gameId) : null,
            event_name: doc.eventName ?? null,
            started_at: parseDate(doc.startedAt),
            finished_at: parseDate(doc.finishedAt),
            winners: toWinners(doc.winner).map(String),
            win_reason: doc.winReason ?? null,
            game_type: doc.gameType ?? null,
            legacy: Object.keys(legacy).length > 0 ? legacy : null
        },
        children: {
            players: playerRows(
                (Array.isArray(doc.players) ? doc.players : []).filter((player) => player?.name)
            ).map(({ agendas, ...player }) => ({
                ...player,
                agendas: stringArray(agendas)
            }))
        }
    };
}

export function transformMessage(doc, context) {
    const { issues, skip } = result();

    if (doc.type === 'motd') {
        return skip('message of the day');
    }

    const poster = doc.user && typeof doc.user === 'object' ? doc.user : {};

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            user_id: context.userIdByName(poster.username),
            poster,
            message: doc.message ?? null,
            posted_at: parseDate(doc.time) || new Date(0),
            deleted: !!doc.deleted,
            deleted_by: doc.deletedBy ?? null
        }
    };
}

export function transformNews(doc) {
    const { issues, skip } = result();

    if (!doc.text) {
        return skip('no text');
    }

    return {
        issues,
        row: {
            mongo_id: mongoId(doc._id),
            poster: doc.poster ?? null,
            text: doc.text,
            published_at: parseDate(doc.datePublished) || new Date(0)
        }
    };
}
