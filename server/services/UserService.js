import crypto from 'crypto';
import EventEmitter from 'events';
import moment from 'moment';
import defaultDb from '../db/index.js';
import logger from '../log.js';
import User from '../models/User.js';
import { idColumn } from '../db/ids.js';
import { toCidr, toInet } from '../db/network.js';

export const Permissions = [
    'isAdmin',
    'isContributor',
    'isSupporter',
    'canEditNews',
    'canManageUsers',
    'canManagePermissions',
    'canManageGames',
    'canManageNodes',
    'canModerateChat',
    'canManageMotd',
    'canManageEvents',
    'canManageBanlist'
];

const DuplicateConstraints = { users_username_key: 'username', users_email_key: 'email' };

export const UserFields = [
    { property: 'username', column: 'username' },
    { property: 'email', column: 'email' },
    { property: 'emailDomain', column: 'email_domain' },
    { property: 'password', column: 'password' },
    { property: 'registered', column: 'registered_at' },
    { property: 'verified', column: 'verified' },
    { property: 'disabled', column: 'disabled' },
    { property: 'enableGravatar', column: 'enable_gravatar' },
    { property: 'settings', column: 'settings', type: 'json' },
    { property: 'promptedActionWindows', column: 'prompted_action_windows', type: 'json' },
    { property: 'patreon', column: 'patreon', type: 'json' },
    { property: 'activationTokenHash', column: 'activation_token_hash' },
    { property: 'activationTokenExpiry', column: 'activation_token_expires_at' },
    { property: 'activationTokenIssuedAt', column: 'activation_token_issued_at' },
    { property: 'resetTokenHash', column: 'reset_token_hash' },
    { property: 'tokenExpires', column: 'reset_token_expires_at' },
    { property: 'resetTokenIssuedAt', column: 'reset_token_issued_at' },
    { property: 'registerIp', column: 'register_ip', type: 'inet' },
    { property: 'registerIpNormalized', column: 'register_ip_normalized', type: 'inet' },
    { property: 'registerSubnet', column: 'register_subnet', type: 'cidr' },
    { property: 'lastLoginIp', column: 'last_login_ip', type: 'inet' },
    { property: 'lastLoginSubnet', column: 'last_login_subnet', type: 'cidr' },
    { property: 'signupFingerprintHash', column: 'signup_fingerprint_hash' },
    { property: 'riskScore', column: 'risk_score' },
    { property: 'riskFlags', column: 'risk_flags' },
    { property: 'trustState', column: 'trust_state' },
    { property: 'restrictedUntil', column: 'restricted_until' },
    { property: 'evasionReviewRequired', column: 'evasion_review_required' },
    { property: 'banReason', column: 'ban_reason' },
    { property: 'modNotes', column: 'mod_notes' }
];

const FieldsByProperty = new Map(UserFields.map((field) => [field.property, field]));

const NotNullDefaults = {
    settings: {},
    promptedActionWindows: {},
    riskFlags: [],
    riskScore: 0,
    trustState: 'trusted',
    verified: false,
    disabled: false,
    enableGravatar: false,
    evasionReviewRequired: false
};

function selectExpression(field) {
    if (field.type === 'inet') {
        return `host(u.${field.column}) AS ${field.column}`;
    }

    if (field.type === 'cidr') {
        return `u.${field.column}::text AS ${field.column}`;
    }

    return `u.${field.column}`;
}

function selectUserData({ columns = '', join = '' } = {}) {
    return `
    SELECT u.id, u.legacy, ${UserFields.map(selectExpression).join(', ')},${columns ? ` ${columns},` : ''}
        ARRAY(SELECT p.permission FROM user_permissions p WHERE p.user_id = u.id) AS permissions,
        ARRAY(SELECT b.blocked_username FROM user_blocks b WHERE b.user_id = u.id ORDER BY b.blocked_username) AS block_list,
        COALESCE((
            SELECT json_agg(json_build_object(
                '_id', t.token_id, 'token', t.token, 'exp', t.expires_at, 'ip', host(t.ip), 'lastUsed', t.last_used_at
            ) ORDER BY t.id)
            FROM refresh_tokens t WHERE t.user_id = u.id
        ), '[]') AS tokens
    FROM users u ${join}`;
}

const SelectUserData = selectUserData();

// network() clears host bits, which would otherwise make the cidr cast fail
function paramExpression(field, index) {
    if (field.type === 'cidr') {
        return `network($${index}::inet)`;
    }

    return `$${index}`;
}

function toColumnValue(field, value) {
    if (value === undefined || value === null) {
        return NotNullDefaults[field.property] ?? null;
    }

    switch (field.type) {
        case 'json':
            return JSON.stringify(value);
        case 'inet':
            return toInet(value);
        case 'cidr':
            return toCidr(value);
        default:
            return value;
    }
}

function permissionsToRows(permissions) {
    if (!permissions || typeof permissions !== 'object' || Array.isArray(permissions)) {
        return [];
    }

    const granted = Object.keys(permissions).filter((permission) => permissions[permission]);
    const unknown = granted.filter((permission) => !Permissions.includes(permission));

    if (unknown.length > 0) {
        logger.warn('Ignoring unknown permissions %s', unknown.join(', '));
    }

    return granted.filter((permission) => Permissions.includes(permission));
}

export function rowToUserData(row) {
    const userData = { ...(row.legacy || {}), _id: String(row.id) };

    for (const field of UserFields) {
        const value = row[field.column];

        if (value !== null && value !== undefined) {
            userData[field.property] = value;
        }
    }

    userData.permissions = Object.fromEntries(
        row.permissions.map((permission) => [permission, true])
    );
    userData.blockList = row.block_list;
    userData.tokens = row.tokens.map((token) => ({
        ...token,
        exp: new Date(token.exp),
        lastUsed: new Date(token.lastUsed),
        ip: token.ip || undefined
    }));

    return userData;
}

class UserService extends EventEmitter {
    constructor(configService, db = defaultDb) {
        super();

        this.configService = configService;
        this.db = db;
    }

    async findUserData(where, params) {
        const rows = await this.db.query(`${SelectUserData} WHERE ${where}`, params);

        return rows[0] && rowToUserData(rows[0]);
    }

    async getUserByUsername(username) {
        try {
            const userData = await this.findUserData('lower(u.username) = lower($1)', [username]);

            return userData && new User(userData);
        } catch (err) {
            logger.error('Error fetching users %s', err);

            throw new Error('Error occured fetching users');
        }
    }

    async getUserByEmail(email) {
        try {
            const userData = await this.findUserData('lower(u.email) = lower($1)', [email]);

            return userData && new User(userData);
        } catch (err) {
            logger.error('Error fetching users %s', err);

            throw new Error('Error occured fetching users');
        }
    }

    async getUserById(id) {
        try {
            const userData = await this.findUserData(`u.${idColumn(id)} = $1`, [String(id)]);

            return userData && new User(userData);
        } catch (err) {
            logger.error('Error fetching users %s', err);

            throw new Error('Error occured fetching users');
        }
    }

    async addUser(user) {
        const fields = UserFields.filter((field) => user[field.property] !== undefined);

        try {
            const userData = await this.db.transaction(async (tx) => {
                const [{ id }] = await tx.query(
                    `INSERT INTO users (${fields.map((field) => field.column).join(', ')}) ` +
                        `VALUES (${fields.map((field, index) => paramExpression(field, index + 1)).join(', ')}) RETURNING id`,
                    fields.map((field) => toColumnValue(field, user[field.property]))
                );

                await this.replacePermissions(tx, id, user.permissions);
                await this.replaceBlockList(tx, id, user.blockList);

                const rows = await tx.query(`${SelectUserData} WHERE u.id = $1`, [id]);

                return rowToUserData(rows[0]);
            });

            return userData;
        } catch (err) {
            logger.error('Error adding user %s %s', err, user.username);

            const error = new Error('Error occured adding user');
            error.duplicateField =
                err.code === '23505' ? DuplicateConstraints[err.constraint] : undefined;

            throw error;
        }
    }

    update(user) {
        const emailDomain =
            user.emailDomain ||
            (user.email && user.email.includes('@')
                ? user.email.substring(user.email.lastIndexOf('@') + 1).toLowerCase()
                : undefined);
        const toSet = {
            email: user.email,
            emailDomain: emailDomain,
            enableGravatar: user.enableGravatar,
            settings: user.settings,
            promptedActionWindows: user.promptedActionWindows,
            verified: user.verified,
            disabled: user.disabled,
            patreon: user.patreon,
            riskFlags: user.riskFlags || [],
            riskScore: user.riskScore || 0,
            trustState: user.trustState || 'trusted',
            restrictedUntil: user.restrictedUntil,
            evasionReviewRequired: !!user.evasionReviewRequired,
            modNotes: user.modNotes || null
        };

        if (user.password && user.password !== '') {
            toSet.password = user.password;
        }

        return this.db
            .transaction(async (tx) => {
                const id = await this.setFields(tx, { username: user.username }, toSet);

                if (id && user.permissions !== undefined) {
                    await this.replacePermissions(tx, id, user.permissions);
                }
            })
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting user details');
            });
    }

    async setFields(tx, match, fields) {
        const entries = Object.entries(fields).map(([property, value]) => {
            const field = FieldsByProperty.get(property);
            if (!field) {
                throw new Error(`Unknown user field '${property}'`);
            }

            return [field, value];
        });

        if (entries.length === 0) {
            return undefined;
        }

        const params = entries.map(([field, value]) => toColumnValue(field, value));
        const assignments = entries.map(
            ([field], index) => `${field.column} = ${paramExpression(field, index + 1)}`
        );
        const where =
            match.id !== undefined
                ? `id = $${params.length + 1}`
                : `lower(username) = lower($${params.length + 1})`;
        params.push(match.id !== undefined ? match.id : match.username);

        const rows = await tx.query(
            `UPDATE users SET ${assignments.join(', ')} WHERE ${where} RETURNING id`,
            params
        );

        return rows[0]?.id;
    }

    async updateUserFields(match, fields) {
        await this.db.transaction((tx) => this.setFields(tx, match, fields));
    }

    async replacePermissions(tx, userId, permissions) {
        await tx.query('DELETE FROM user_permissions WHERE user_id = $1', [userId]);

        const granted = permissionsToRows(permissions);
        if (granted.length > 0) {
            await tx.query(
                'INSERT INTO user_permissions (user_id, permission) SELECT $1, unnest($2::text[])',
                [userId, granted]
            );
        }
    }

    async replaceBlockList(tx, userId, blockList) {
        await tx.query('DELETE FROM user_blocks WHERE user_id = $1', [userId]);

        const entries = [
            ...new Set((blockList || []).map((username) => String(username).toLowerCase()))
        ];
        if (entries.length > 0) {
            await tx.query(
                'INSERT INTO user_blocks (user_id, blocked_username) SELECT $1, unnest($2::text[])',
                [userId, entries]
            );
        }
    }

    updateBlockList(user) {
        return this.db
            .transaction(async (tx) => {
                const rows = await tx.query(
                    'SELECT id FROM users WHERE lower(username) = lower($1)',
                    [user.username]
                );

                if (rows[0]) {
                    await this.replaceBlockList(tx, rows[0].id, user.blockList);
                }
            })
            .then(() => {
                this.emit('onBlocklistChanged', user);
            })
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting user details');
            });
    }

    setResetToken(user, tokenHash, tokenExpiration) {
        return this.db
            .query(
                'UPDATE users SET reset_token_hash = $1, reset_token_expires_at = $2, reset_token_issued_at = now() ' +
                    'WHERE lower(username) = lower($3)',
                [tokenHash, tokenExpiration, user.username]
            )
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting reset token');
            });
    }

    setPassword(user, password) {
        return this.db
            .query('UPDATE users SET password = $1 WHERE lower(username) = lower($2)', [
                password,
                user.username
            ])
            .catch((err) => {
                logger.error(err);

                throw new Error('Error setting password');
            });
    }

    clearResetToken(user) {
        return this.db
            .query(
                'UPDATE users SET reset_token_hash = NULL, reset_token_expires_at = NULL, reset_token_issued_at = NULL ' +
                    'WHERE lower(username) = lower($1)',
                [user.username]
            )
            .catch((err) => {
                logger.error(err);

                throw new Error('Error clearing reset token');
            });
    }

    async deleteExpiredUnverifiedAccounts({ email, username } = {}) {
        const conditions = [];
        const params = [];

        if (email) {
            params.push(email);
            conditions.push(`lower(email) = lower($${params.length})`);
        }

        if (username) {
            params.push(username);
            conditions.push(`lower(username) = lower($${params.length})`);
        }

        try {
            const rows = await this.db.query(
                'WITH deleted AS (DELETE FROM users WHERE NOT verified AND activation_token_expires_at <= now()' +
                    (conditions.length > 0 ? ` AND (${conditions.join(' OR ')})` : '') +
                    ' RETURNING 1) SELECT count(*) AS count FROM deleted',
                params
            );

            return rows[0].count;
        } catch (err) {
            logger.error('Error deleting expired unverified accounts %s', err);
            return 0;
        }
    }

    activateUser(user) {
        return this.db
            .query(
                'UPDATE users SET verified = true, activation_token_hash = NULL, activation_token_expires_at = NULL, ' +
                    'activation_token_issued_at = NULL WHERE lower(username) = lower($1)',
                [user.username]
            )
            .catch((err) => {
                logger.error(err);

                throw new Error('Error activating user');
            });
    }

    async cleanupRefreshTokens() {
        const refreshTokenRetentionDays =
            this.configService.getValue('refreshTokenRetentionDays') || 30;

        try {
            const rows = await this.db.query(
                'WITH deleted AS (DELETE FROM refresh_tokens WHERE expires_at <= now() ' +
                    'OR last_used_at < now() - make_interval(days => $1) RETURNING 1) ' +
                    'SELECT count(*) AS count FROM deleted',
                [refreshTokenRetentionDays]
            );

            return rows[0].count;
        } catch (err) {
            logger.error('Error cleaning up refresh tokens %s', err);
            return 0;
        }
    }

    async clearUserSessions(username) {
        const rows = await this.db.query(
            'WITH matched AS (SELECT id FROM users WHERE lower(username) = lower($1)), ' +
                'deleted AS (DELETE FROM refresh_tokens WHERE user_id IN (SELECT id FROM matched)) ' +
                'SELECT count(*) AS count FROM matched',
            [username]
        );

        return rows[0].count > 0;
    }

    async addRefreshToken(username, token, ip) {
        const expiration = moment().add(1, 'months');
        const hmac = crypto.createHmac('sha512', this.configService.getValue('hmacSecret'));

        const newId = crypto.randomUUID();
        const encodedToken = hmac.update(`REFRESH ${username} ${newId}`).digest('hex');

        try {
            const rows = await this.db.query(
                'INSERT INTO refresh_tokens (user_id, token_id, token, expires_at, ip, last_used_at) ' +
                    'SELECT id, $2, $3, $4, $5, now() FROM users WHERE lower(username) = lower($1) RETURNING id',
                [username, newId, encodedToken, expiration.toDate(), toInet(ip)]
            );

            if (rows.length === 0) {
                logger.error('Unable to add a refresh token for unknown user %s', username);

                return undefined;
            }

            return {
                id: newId,
                username: username,
                token: encodedToken
            };
        } catch (err) {
            logger.error(err);

            return undefined;
        }
    }

    verifyRefreshToken(username, refreshToken, providedToken) {
        if (typeof providedToken !== 'string' || typeof refreshToken.token !== 'string') {
            return false;
        }

        let hmac = crypto.createHmac('sha512', this.configService.getValue('hmacSecret'));
        let encodedToken = hmac.update(`REFRESH ${username} ${refreshToken._id}`).digest('hex');

        if (encodedToken !== refreshToken.token) {
            return false;
        }

        let providedBuffer = Buffer.from(providedToken);
        let storedBuffer = Buffer.from(refreshToken.token);
        if (
            providedBuffer.length !== storedBuffer.length ||
            !crypto.timingSafeEqual(providedBuffer, storedBuffer)
        ) {
            return false;
        }

        let now = moment();
        if (refreshToken.exp < now) {
            return false;
        }

        return true;
    }

    updateRefreshTokenUsage(tokenId, ip) {
        return this.db
            .query('UPDATE refresh_tokens SET ip = $1, last_used_at = now() WHERE token_id = $2', [
                toInet(ip),
                String(tokenId)
            ])
            .catch((err) => {
                logger.error(err);
            });
    }

    // Returns the user that holds the token, as the MongoDB version did
    getRefreshTokenById(username, tokenId) {
        return this.findUserData(
            'lower(u.username) = lower($1) AND EXISTS ' +
                '(SELECT 1 FROM refresh_tokens t WHERE t.user_id = u.id AND t.token_id = $2)',
            [username, String(tokenId)]
        ).catch((err) => {
            logger.error(err);
        });
    }

    removeRefreshToken(username, tokenId) {
        return this.db
            .query(
                'DELETE FROM refresh_tokens t USING users u WHERE u.id = t.user_id ' +
                    'AND lower(u.username) = lower($1) AND t.token_id = $2',
                [username, String(tokenId)]
            )
            .catch((err) => {
                logger.error(err);
            });
    }

    setSupporterStatus(username, isSupporter) {
        return this.db.query(
            isSupporter
                ? "INSERT INTO user_permissions (user_id, permission) SELECT id, 'isSupporter' FROM users " +
                      'WHERE lower(username) = lower($1) ON CONFLICT DO NOTHING'
                : 'DELETE FROM user_permissions p USING users u WHERE u.id = p.user_id ' +
                      "AND lower(u.username) = lower($1) AND p.permission = 'isSupporter'",
            [username]
        );
    }

    async getPossiblyLinkedAccounts(user) {
        if (!user.tokens) {
            return [];
        }

        try {
            return await this.db.query(
                'SELECT DISTINCT u.id::text AS "_id", u.username FROM refresh_tokens t ' +
                    'JOIN refresh_tokens shared ON shared.ip = t.ip ' +
                    'JOIN users u ON u.id = shared.user_id ' +
                    'WHERE t.user_id = $1 ORDER BY u.username',
                [user._id]
            );
        } catch (err) {
            logger.error('Error finding related ips %s %s', err, user.username);
        }
    }

    async findLinkedUsers({ ip, subnet, fingerprintHash, excludeUserId }) {
        const params = [toInet(ip), toCidr(subnet), fingerprintHash || null, excludeUserId ?? null];

        if (!params[0] && !params[1] && !params[2]) {
            return [];
        }

        const rows = await this.db.query(
            `WITH matches AS (
                SELECT id,
                    COALESCE($1::inet IN (register_ip, register_ip_normalized, last_login_ip), false) AS shared_ip,
                    COALESCE(network($2::inet) IN (register_subnet, last_login_subnet), false) AS shared_subnet,
                    COALESCE(signup_fingerprint_hash = $3::text, false) AS shared_fingerprint
                FROM users
                WHERE ($1::inet IN (register_ip, register_ip_normalized, last_login_ip)
                    OR network($2::inet) IN (register_subnet, last_login_subnet)
                    OR signup_fingerprint_hash = $3::text)
                    AND ($4::bigint IS NULL OR id <> $4::bigint)
            )
            ${selectUserData({
                columns: 'm.shared_ip, m.shared_subnet, m.shared_fingerprint',
                join: 'JOIN matches m ON m.id = u.id'
            })}
            ORDER BY u.id`,
            params
        );

        return rows.map((row) => ({
            user: rowToUserData(row),
            evidence: [
                row.shared_ip && 'shared exact ip',
                row.shared_subnet && 'shared subnet',
                row.shared_fingerprint && 'shared fingerprint'
            ].filter(Boolean)
        }));
    }
}

export default UserService;
