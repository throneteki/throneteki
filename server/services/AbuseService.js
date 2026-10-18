import crypto from 'crypto';
import defaultDb from '../db/index.js';
import logger from '../log.js';
import { idColumn } from '../db/ids.js';
import { toCidr, toInet } from '../db/network.js';

const RegistrationAttemptWindowMs = 60 * 60 * 1000;
const RegistrationCooldownMs = 15 * 60 * 1000;
const RegistrationCooldownThreshold = 5;
const RestrictionWindowMs = 7 * 24 * 60 * 60 * 1000;
const DefaultRegistrationEventRetentionDays = 30;

const SelectBlock = `
    SELECT id::text AS "_id", scope, value, reason, source_user_id::text AS "sourceUserId", created_at AS "createdAt",
        created_by AS "createdBy", expires_at AS "expiresAt", active, deactivated_at AS "deactivatedAt"
    FROM abuse_blocks`;

const SelectEvent = `
    SELECT id::text AS "_id", type, username, user_id::text AS "userId", host(ip) AS ip, subnet::text AS subnet,
        fingerprint_hash AS "fingerprintHash", email_domain AS "emailDomain", outcome, signals,
        score_delta AS "scoreDelta", created_at AS "createdAt", created_by AS "createdBy"
    FROM abuse_events`;

function blockValueExpression(scope, value, index) {
    if (scope === 'ip' && toInet(value)) {
        return `host($${index}::inet)`;
    }

    if (scope === 'subnet' && toCidr(value)) {
        return `network($${index}::inet)::text`;
    }

    return `$${index}`;
}

class AbuseService {
    constructor(configService, userService, db = defaultDb) {
        this.configService = configService;

        this.userService = userService;
        this.db = db;
    }

    normalizeIp(ip) {
        if (!ip) {
            return undefined;
        }

        let normalized = String(ip).trim().toLowerCase();

        if (normalized.startsWith('::ffff:') && normalized.includes('.')) {
            normalized = normalized.substring(7);
        }

        let zoneIndex = normalized.indexOf('%');
        if (zoneIndex !== -1) {
            normalized = normalized.substring(0, zoneIndex);
        }

        return normalized;
    }

    expandIpv6(ip) {
        const address = this.normalizeIp(ip);
        if (!address || !address.includes(':')) {
            return undefined;
        }

        const [leftRaw, rightRaw] = address.split('::');
        const left = leftRaw ? leftRaw.split(':').filter(Boolean) : [];
        const right = rightRaw ? rightRaw.split(':').filter(Boolean) : [];

        if (!address.includes('::') && left.length !== 8) {
            return undefined;
        }

        const missingSegments = 8 - (left.length + right.length);
        const middle = new Array(Math.max(missingSegments, 0)).fill('0');
        const expanded = [...left, ...middle, ...right].slice(0, 8);

        if (expanded.length !== 8) {
            return undefined;
        }

        return expanded.map((segment) => segment.padStart(4, '0'));
    }

    getSubnet(ip) {
        const normalized = this.normalizeIp(ip);
        if (!normalized) {
            return undefined;
        }

        if (normalized.includes('.')) {
            const octets = normalized.split('.');
            if (octets.length !== 4) {
                return undefined;
            }

            return `${octets.slice(0, 3).join('.')}.0/24`;
        }

        if (normalized.includes(':')) {
            const expanded = this.expandIpv6(normalized);
            if (!expanded) {
                return undefined;
            }

            return `${expanded.slice(0, 4).join(':')}::/64`;
        }

        return undefined;
    }

    getEmailDomain(email) {
        if (!email || !email.includes('@')) {
            return undefined;
        }

        return email
            .substring(email.lastIndexOf('@') + 1)
            .trim()
            .toLowerCase();
    }

    hashFingerprint(fingerprint) {
        if (!fingerprint) {
            return undefined;
        }

        const payload =
            typeof fingerprint === 'string' ? fingerprint : JSON.stringify(fingerprint || {});

        if (!payload || payload === '{}') {
            return undefined;
        }

        return crypto
            .createHmac('sha256', this.configService.getValue('hmacSecret'))
            .update(payload)
            .digest('hex');
    }

    getRestrictionExpiry() {
        return new Date(Date.now() + RestrictionWindowMs);
    }

    getRecentCooldownAttempts(attempts) {
        let sortedAttempts = [...attempts].sort(
            (left, right) =>
                new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        );
        let recentAttempts = [];

        for (let attempt of sortedAttempts) {
            let attemptTime = new Date(attempt.createdAt).getTime();
            recentAttempts = recentAttempts.filter(
                (recentAttempt) =>
                    attemptTime - new Date(recentAttempt.createdAt).getTime() <
                    RegistrationCooldownMs
            );
            recentAttempts.push(attempt);
        }

        return recentAttempts;
    }

    determineTrustState(riskScore) {
        if (riskScore >= 90) {
            return 'banned_evasion_review';
        }

        if (riskScore >= 60) {
            return 'restricted';
        }

        if (riskScore >= 30) {
            return 'new';
        }

        return 'trusted';
    }

    async assessRegistrationAttempt({ ip, email, fingerprint, username, externalRisk }) {
        const normalizedIp = this.normalizeIp(ip);
        const subnet = this.getSubnet(normalizedIp);
        const emailDomain = this.getEmailDomain(email);
        const fingerprintHash = this.hashFingerprint(fingerprint);
        const riskFlags = [];
        let riskScore = 0;

        const matchingBlocks = await this.getMatchingBlocks({
            ip: normalizedIp,
            subnet,
            fingerprintHash,
            emailDomain
        });

        for (const block of matchingBlocks) {
            if (block.scope === 'ip') {
                riskFlags.push('blocked_exact_ip');
                riskScore += 70;
            } else if (block.scope === 'subnet') {
                riskFlags.push('blocked_subnet');
                riskScore += 30;
            } else if (block.scope === 'fingerprint') {
                riskFlags.push('blocked_fingerprint');
                riskScore += 60;
            } else if (block.scope === 'email_domain') {
                riskFlags.push('blocked_email_domain');
                riskScore += 15;
            }
        }

        const linkedUsers = await this.findLinkedUsers({
            ip: normalizedIp,
            subnet,
            fingerprintHash
        });

        const disabledExactMatches = linkedUsers.filter(
            (linkedUser) =>
                linkedUser.user.disabled && linkedUser.evidence.includes('shared exact ip')
        );
        if (disabledExactMatches.length > 0) {
            riskFlags.push('disabled_exact_ip_match');
            riskScore += 45;
        }

        const disabledFingerprintMatches = linkedUsers.filter(
            (linkedUser) =>
                linkedUser.user.disabled && linkedUser.evidence.includes('shared fingerprint')
        );
        if (disabledFingerprintMatches.length > 0) {
            riskFlags.push('disabled_fingerprint_match');
            riskScore += 30;
        }

        const disabledSubnetMatches = linkedUsers.filter(
            (linkedUser) =>
                linkedUser.user.disabled && linkedUser.evidence.includes('shared subnet')
        );
        if (disabledSubnetMatches.length >= 2) {
            riskFlags.push('repeated_disabled_subnet_match');
            riskScore += 30;
        }

        const recentAttempts = await this.findRegistrationAttempts({ ip: normalizedIp, subnet });
        const cooldownAttempts = this.getRecentCooldownAttempts(recentAttempts);
        const cooldownTriggered = cooldownAttempts.length >= RegistrationCooldownThreshold;
        let cooldownRemainingMs = 0;

        if (cooldownTriggered) {
            riskFlags.push('registration_cooldown');
            riskScore += 20;

            const latestAttempt = cooldownAttempts[cooldownAttempts.length - 1];

            cooldownRemainingMs = Math.max(
                0,
                new Date(latestAttempt.createdAt).getTime() + RegistrationCooldownMs - Date.now()
            );
        }

        if (externalRisk) {
            riskFlags.push(...(externalRisk.riskFlags || []));
            riskScore += externalRisk.riskScoreDelta || 0;

            if (externalRisk.denyRegistration) {
                riskFlags.push('external_registration_deny');
            }
        }

        const hasHardBlock = matchingBlocks.some(
            (block) => block.scope === 'ip' || block.scope === 'fingerprint'
        );
        const hasExternalHardBlock = !!externalRisk?.denyRegistration;
        const trustState =
            hasHardBlock || hasExternalHardBlock
                ? 'banned_evasion_review'
                : this.determineTrustState(riskScore);
        const challengeRequired = riskScore >= 30 && riskScore < 60;
        const restrictedUntil = trustState === 'restricted' ? this.getRestrictionExpiry() : null;
        const blocked = hasHardBlock || hasExternalHardBlock || riskScore >= 90;

        return {
            username,
            ip: normalizedIp,
            subnet,
            emailDomain,
            fingerprintHash,
            riskFlags: [...new Set(riskFlags)],
            riskScore,
            trustState,
            challengeRequired,
            cooldownRemainingMs,
            restrictedUntil,
            blocked,
            linkedUsers,
            matchingBlocks
        };
    }

    async assessLoginAttempt(user, { ip, fingerprint }) {
        const normalizedIp = this.normalizeIp(ip);
        const subnet = this.getSubnet(normalizedIp);
        const fingerprintHash = this.hashFingerprint(fingerprint);
        const matchingBlocks = await this.getMatchingBlocks({
            ip: normalizedIp,
            subnet,
            fingerprintHash,
            emailDomain: user.emailDomain
        });

        const linkedUsers = await this.findLinkedUsers({
            ip: normalizedIp,
            subnet,
            fingerprintHash,
            excludeUserId: user._id
        });

        const blocked =
            matchingBlocks.some((block) => block.scope === 'ip' || block.scope === 'fingerprint') ||
            user.trustState === 'banned_evasion_review';

        return {
            blocked,
            ip: normalizedIp,
            subnet,
            fingerprintHash,
            linkedUsers
        };
    }

    async getAbuseProfile(user) {
        const linkedUsers = await this.findLinkedUsers({
            ip: user.lastLoginIp || user.registerIpNormalized || user.registerIp,
            subnet: user.lastLoginSubnet || user.registerSubnet,
            fingerprintHash: user.signupFingerprintHash,
            excludeUserId: user._id
        });
        const matchingBlocks = await this.getMatchingBlocks({
            ip: user.lastLoginIp || user.registerIpNormalized || user.registerIp,
            subnet: user.lastLoginSubnet || user.registerSubnet,
            fingerprintHash: user.signupFingerprintHash,
            emailDomain: user.emailDomain
        });
        const recentEvents = await this.getRecentEventsForUser(user);

        return {
            riskScore: user.riskScore || 0,
            trustState: user.trustState || 'trusted',
            riskFlags: user.riskFlags || [],
            restrictedUntil: user.restrictedUntil || null,
            linkedAccounts: linkedUsers.map((linkedUser) => ({
                username: linkedUser.user.username,
                disabled: !!linkedUser.user.disabled,
                trustState: linkedUser.user.trustState || 'trusted',
                evidence: linkedUser.evidence
            })),
            matchingBlocks,
            recentEvents
        };
    }

    async restrictUser(user, { actor, days = 7, reason }) {
        const restrictedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        const nextFlags = [...new Set([...(user.riskFlags || []), 'manual_restriction'])];

        await this.updateUserState(user.username, {
            trustState: 'restricted',
            restrictedUntil,
            evasionReviewRequired: true,
            riskFlags: nextFlags,
            modNotes: reason || user.modNotes || null
        });

        await this.logEvent({
            type: 'restriction_applied',
            username: user.username,
            userId: user._id,
            ip: user.lastLoginIp || user.registerIpNormalized || user.registerIp,
            outcome: 'restricted',
            signals: nextFlags,
            scoreDelta: 0,
            createdBy: actor
        });

        return restrictedUntil;
    }

    async unrestrictUser(user, { actor, reason }) {
        const nextFlags = (user.riskFlags || []).filter(
            (flag) => flag !== 'manual_restriction' && flag !== 'restricted'
        );

        await this.updateUserState(user.username, {
            trustState: 'trusted',
            restrictedUntil: null,
            evasionReviewRequired: false,
            riskFlags: nextFlags,
            modNotes: reason || user.modNotes || null
        });

        await this.logEvent({
            type: 'restriction_applied',
            username: user.username,
            userId: user._id,
            ip: user.lastLoginIp || user.registerIpNormalized || user.registerIp,
            outcome: 'allowed',
            signals: ['manual_unrestriction'],
            scoreDelta: 0,
            createdBy: actor
        });
    }

    async blockCluster(user, { actor, reason }) {
        const blocksToCreate = [
            {
                scope: 'ip',
                value: user.lastLoginIp || user.registerIpNormalized || user.registerIp
            },
            { scope: 'subnet', value: user.lastLoginSubnet || user.registerSubnet },
            { scope: 'fingerprint', value: user.signupFingerprintHash },
            { scope: 'email_domain', value: user.emailDomain }
        ].filter((block) => !!block.value);

        for (const block of blocksToCreate) {
            const existingBlocks = await this.getMatchingBlocks({
                ip: block.scope === 'ip' ? block.value : undefined,
                subnet: block.scope === 'subnet' ? block.value : undefined,
                fingerprintHash: block.scope === 'fingerprint' ? block.value : undefined,
                emailDomain: block.scope === 'email_domain' ? block.value : undefined
            });

            if (
                existingBlocks.some(
                    (existingBlock) =>
                        existingBlock.scope === block.scope && existingBlock.value === block.value
                )
            ) {
                continue;
            }

            await this.createBlock({
                ...block,
                createdBy: actor,
                reason: reason || 'Blocked from linked abuse cluster',
                sourceUserId: user._id
            });
        }

        const nextFlags = [...new Set([...(user.riskFlags || []), 'blocked_cluster'])];
        await this.applyClusterBan(user, {
            disabled: true,
            trustState: 'banned_evasion_review',
            banReason: reason || 'Blocked for repeated ban evasion',
            evasionReviewRequired: true,
            riskFlags: nextFlags
        });

        await this.logEvent({
            type: 'ban_applied',
            username: user.username,
            userId: user._id,
            ip: user.lastLoginIp || user.registerIpNormalized || user.registerIp,
            outcome: 'blocked',
            signals: nextFlags,
            createdBy: actor
        });
    }

    async getMatchingBlocks({ ip, subnet, fingerprintHash, emailDomain }) {
        let matchingBlocks = [];

        try {
            matchingBlocks = await this.db.query(
                `${SelectBlock}
                WHERE active AND (expires_at IS NULL OR expires_at > now())
                    AND ((scope = 'ip' AND value = host($1::inet))
                        OR (scope = 'subnet' AND value = network($2::inet)::text)
                        OR (scope = 'fingerprint' AND value = $3)
                        OR (scope = 'email_domain' AND value = $4))
                ORDER BY id`,
                [toInet(ip), toCidr(subnet), fingerprintHash || null, emailDomain || null]
            );
        } catch (err) {
            logger.error('Error fetching abuse blocks %s', err);
        }

        if (ip) {
            try {
                const legacyEntries = await this.db.query(
                    'SELECT created_at, created_by FROM banlist WHERE ip = $1',
                    [ip]
                );

                if (legacyEntries[0]) {
                    matchingBlocks.push({
                        scope: 'ip',
                        value: ip,
                        reason: 'Legacy banlist',
                        createdAt: legacyEntries[0].created_at,
                        createdBy: legacyEntries[0].created_by,
                        active: true,
                        legacy: true
                    });
                }
            } catch (err) {
                logger.error('Error checking legacy banlist %s', err);
            }
        }

        return matchingBlocks;
    }

    async listBlocks() {
        try {
            return await this.db.query(`${SelectBlock} ORDER BY created_at DESC`);
        } catch (err) {
            logger.error('Error fetching abuse blocks %s', err);

            return [];
        }
    }

    async createBlock(block) {
        const scope = block.scope || 'ip';
        const rows = await this.db.query(
            `INSERT INTO abuse_blocks (scope, value, reason, source_user_id, created_at, created_by, expires_at, active)
            VALUES ($1, ${blockValueExpression(scope, block.value, 2)}, $3,
                (SELECT id FROM users WHERE id::text = $4::text), $5, $6, $7, $8)
            RETURNING id`,
            [
                scope,
                block.value,
                block.reason || 'Manual moderation action',
                block.sourceUserId ?? null,
                block.createdAt || new Date(),
                block.createdBy || null,
                block.expiresAt || null,
                block.active !== false
            ]
        );

        return (await this.db.query(`${SelectBlock} WHERE id = $1`, [rows[0].id]))[0];
    }

    async deactivateBlock(id) {
        return this.db.query(
            `UPDATE abuse_blocks SET active = false, deactivated_at = now() WHERE ${idColumn(id)} = $1`,
            [String(id)]
        );
    }

    async logEvent(event) {
        const ip = this.normalizeIp(event.ip);
        const entry = {
            type: event.type,
            username: event.username || null,
            userId: event.userId || null,
            ip: toInet(ip),
            subnet: toCidr(event.subnet || this.getSubnet(event.ip)),
            fingerprintHash: event.fingerprintHash || null,
            emailDomain: event.emailDomain || null,
            outcome: event.outcome || 'allowed',
            signals: event.signals || [],
            scoreDelta: event.scoreDelta || 0,
            createdAt: event.createdAt || new Date(),
            createdBy: event.createdBy || null
        };

        try {
            const rows = await this.db.query(
                `INSERT INTO abuse_events (type, username, user_id, ip, subnet, fingerprint_hash, email_domain,
                    outcome, signals, score_delta, created_at, created_by)
                VALUES ($1, $2, (SELECT id FROM users WHERE id::text = $3::text), $4, network($5::inet),
                    $6, $7, $8, $9, $10, $11, $12)
                RETURNING id`,
                [
                    entry.type,
                    entry.username,
                    entry.userId,
                    entry.ip,
                    entry.subnet,
                    entry.fingerprintHash,
                    entry.emailDomain,
                    entry.outcome,
                    entry.signals,
                    entry.scoreDelta,
                    entry.createdAt,
                    entry.createdBy
                ]
            );

            return { ...entry, _id: String(rows[0].id) };
        } catch (err) {
            logger.error('Error adding abuse event %s %s', err, entry);
            return undefined;
        }
    }

    async cleanupOldRegistrationEvents() {
        const retentionDays =
            this.configService.getValue('registrationEventRetentionDays') ||
            DefaultRegistrationEventRetentionDays;

        try {
            const rows = await this.db.query(
                `WITH deleted AS (
                    DELETE FROM abuse_events
                    WHERE type IN ('registration_attempt', 'registration_preflight')
                        AND created_at < now() - make_interval(days => $1)
                    RETURNING 1
                ) SELECT count(*) AS count FROM deleted`,
                [retentionDays]
            );

            return rows[0].count;
        } catch (err) {
            logger.error('Error cleaning old registration events %s', err);
            return 0;
        }
    }

    async findRegistrationAttempts({ ip, subnet }) {
        const signals = [ip && `ip:${ip}`, subnet && `subnet:${subnet}`].filter(Boolean);

        if (signals.length === 0) {
            return [];
        }

        try {
            return await this.db.query(
                `${SelectEvent}
                WHERE type = 'registration_attempt' AND created_at >= $1
                    AND (ip = $2::inet OR subnet = network($3::inet) OR signals && $4::text[])
                ORDER BY created_at`,
                [
                    new Date(Date.now() - RegistrationAttemptWindowMs),
                    toInet(ip),
                    toCidr(subnet),
                    signals
                ]
            );
        } catch (err) {
            logger.error('Error fetching abuse events %s', err);

            return [];
        }
    }

    async getRecentEventsForUser(user) {
        try {
            return await this.db.query(
                `${SelectEvent} WHERE username = $1 OR user_id::text = $2::text ORDER BY created_at DESC LIMIT 20`,
                [user.username, user._id ?? null]
            );
        } catch (err) {
            logger.error('Error fetching abuse events for user %s %s', user.username, err);

            return [];
        }
    }

    async findLinkedUsers(criteria) {
        try {
            return await this.userService.findLinkedUsers(criteria);
        } catch (err) {
            logger.error('Error fetching users for abuse lookup %s', err);

            return [];
        }
    }

    async updateUserState(username, fields) {
        return this.userService.updateUserFields({ username }, fields);
    }

    async updateUserStateById(userId, fields) {
        return this.userService.updateUserFields({ id: userId }, fields);
    }

    async updateUserSessionMetadata(username, { ip, subnet }) {
        return this.userService.updateUserFields(
            { username },
            {
                lastLoginIp: this.normalizeIp(ip),
                lastLoginSubnet: subnet || this.getSubnet(ip)
            }
        );
    }

    async applyClusterBan(user, fields) {
        await this.userService.updateUserFields({ username: user.username }, fields);
        await this.userService.clearUserSessions(user.username);
    }
}

export default AbuseService;
