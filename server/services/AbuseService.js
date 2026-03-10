import crypto from 'crypto';
import logger from '../log.js';

const RegistrationAttemptWindowMs = 60 * 60 * 1000;
const RegistrationCooldownMs = 15 * 60 * 1000;
const RegistrationCooldownThreshold = 3;
const RestrictionWindowMs = 7 * 24 * 60 * 60 * 1000;
const DefaultRegistrationEventRetentionDays = 30;

class AbuseService {
    constructor(db, configService) {
        this.users = db.get('users');
        this.legacyBanlist = db.get('banlist');
        this.abuseBlocks = db.get('abuse_blocks');
        this.abuseEvents = db.get('abuse_events');
        this.configService = configService;
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

    isBlockActive(block) {
        if (!block || block.active === false) {
            return false;
        }

        if (!block.expiresAt) {
            return true;
        }

        return new Date(block.expiresAt).getTime() > Date.now();
    }

    async getActiveBlocks() {
        let blocks = [];
        try {
            blocks = await this.abuseBlocks.find({});
        } catch (err) {
            logger.error('Error fetching abuse blocks %s', err);
        }

        return blocks.filter((block) => this.isBlockActive(block));
    }

    async listBlocks() {
        let blocks = [];
        try {
            blocks = await this.abuseBlocks.find({});
        } catch (err) {
            logger.error('Error fetching abuse blocks %s', err);
        }

        return blocks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    async createBlock(block) {
        const entry = {
            scope: block.scope || 'ip',
            value: block.value,
            reason: block.reason || 'Manual moderation action',
            sourceUserId: block.sourceUserId,
            createdAt: block.createdAt || new Date(),
            createdBy: block.createdBy,
            expiresAt: block.expiresAt || null,
            active: block.active !== false
        };

        return this.abuseBlocks.insert(entry);
    }

    async deactivateBlock(id) {
        return this.abuseBlocks.update(
            { _id: id },
            { $set: { active: false, deactivatedAt: new Date() } }
        );
    }

    async logEvent(event) {
        const entry = {
            type: event.type,
            username: event.username || null,
            userId: event.userId || null,
            ip: this.normalizeIp(event.ip) || null,
            subnet: event.subnet || this.getSubnet(event.ip) || null,
            fingerprintHash: event.fingerprintHash || null,
            emailDomain: event.emailDomain || null,
            outcome: event.outcome || 'allowed',
            signals: event.signals || [],
            scoreDelta: event.scoreDelta || 0,
            createdAt: event.createdAt || new Date(),
            createdBy: event.createdBy || null
        };

        try {
            return await this.abuseEvents.insert(entry);
        } catch (err) {
            logger.error('Error adding abuse event %s %s', err, entry);
            return undefined;
        }
    }

    async cleanupOldRegistrationEvents() {
        const retentionDays =
            this.configService.getValue('registrationEventRetentionDays') ||
            DefaultRegistrationEventRetentionDays;
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);

        try {
            const result = await this.abuseEvents.remove({
                type: { $in: ['registration_attempt', 'registration_preflight'] },
                createdAt: { $lt: cutoff }
            });

            if (typeof result === 'number') {
                return result;
            }

            if (Array.isArray(result)) {
                return result.length;
            }

            return result?.deletedCount || 0;
        } catch (err) {
            logger.error('Error cleaning old registration events %s', err);
            return 0;
        }
    }

    async findRegistrationAttempts({ ip, subnet }) {
        const windowStart = new Date(Date.now() - RegistrationAttemptWindowMs);
        let attempts = [];

        try {
            attempts = await this.abuseEvents.find({
                type: 'registration_attempt',
                createdAt: { $gte: windowStart }
            });
        } catch (err) {
            logger.error('Error fetching abuse events %s', err);
        }

        return attempts.filter((attempt) => {
            return (
                (ip && attempt.ip === ip) ||
                (subnet && attempt.subnet === subnet) ||
                (ip && attempt.signals && attempt.signals.includes(`ip:${ip}`)) ||
                (subnet && attempt.signals && attempt.signals.includes(`subnet:${subnet}`))
            );
        });
    }

    getRecentCooldownAttempts(attempts) {
        let sortedAttempts = [...attempts].sort(
            (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
        );
        let recentAttempts = [];

        for (let attempt of sortedAttempts) {
            let attemptTime = new Date(attempt.createdAt).getTime();
            recentAttempts = recentAttempts.filter(
                (recentAttempt) =>
                    attemptTime - new Date(recentAttempt.createdAt).getTime() < RegistrationCooldownMs
            );
            recentAttempts.push(attempt);
        }

        return recentAttempts;
    }

    buildLinkedEvidence(users, predicate, label) {
        return users.filter(predicate).map((user) => ({
            user,
            evidence: [label]
        }));
    }

    mergeLinkedUsers(linkGroups) {
        const mergedUsers = new Map();

        for (const group of linkGroups) {
            for (const linkedUser of group) {
                const key = linkedUser.user._id.toString();
                if (!mergedUsers.has(key)) {
                    mergedUsers.set(key, {
                        user: linkedUser.user,
                        evidence: []
                    });
                }

                const current = mergedUsers.get(key);
                current.evidence = [...new Set(current.evidence.concat(linkedUser.evidence))];
            }
        }

        return Array.from(mergedUsers.values());
    }

    async findLinkedUsers({ ip, subnet, fingerprintHash, excludeUserId }) {
        let users = [];

        try {
            users = await this.users.find({});
        } catch (err) {
            logger.error('Error fetching users for abuse lookup %s', err);
            return [];
        }

        const filteredUsers = users.filter((user) => {
            return !excludeUserId || user._id.toString() !== excludeUserId.toString();
        });

        const linkGroups = [
            this.buildLinkedEvidence(
                filteredUsers,
                (user) =>
                    !!ip &&
                    [user.registerIp, user.registerIpNormalized, user.lastLoginIp]
                        .filter(Boolean)
                        .includes(ip),
                'shared exact ip'
            ),
            this.buildLinkedEvidence(
                filteredUsers,
                (user) => !!subnet && [user.registerSubnet, user.lastLoginSubnet].includes(subnet),
                'shared subnet'
            ),
            this.buildLinkedEvidence(
                filteredUsers,
                (user) => !!fingerprintHash && user.signupFingerprintHash === fingerprintHash,
                'shared fingerprint'
            )
        ];

        return this.mergeLinkedUsers(linkGroups);
    }

    async getMatchingBlocks({ ip, subnet, fingerprintHash, emailDomain }) {
        const activeBlocks = await this.getActiveBlocks();
        const matchingBlocks = activeBlocks.filter((block) => {
            if (block.scope === 'ip') {
                return block.value === ip;
            }

            if (block.scope === 'subnet') {
                return block.value === subnet;
            }

            if (block.scope === 'fingerprint') {
                return block.value === fingerprintHash;
            }

            if (block.scope === 'email_domain') {
                return block.value === emailDomain;
            }

            return false;
        });

        if (ip) {
            try {
                const legacyEntry = await this.legacyBanlist.find({ ip });
                if (legacyEntry[0]) {
                    matchingBlocks.push({
                        scope: 'ip',
                        value: ip,
                        reason: 'Legacy banlist',
                        createdAt: legacyEntry[0].added,
                        createdBy: legacyEntry[0].user,
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

    async updateUserState(username, fields) {
        return this.users.update({ username }, { $set: fields });
    }

    async updateUserStateById(userId, fields) {
        return this.users.update({ _id: userId }, { $set: fields });
    }

    async updateUserSessionMetadata(username, { ip, subnet }) {
        return this.users.update(
            { username },
            {
                $set: {
                    lastLoginIp: this.normalizeIp(ip),
                    lastLoginSubnet: subnet || this.getSubnet(ip)
                }
            }
        );
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

    async getRecentEventsForUser(user) {
        let events = [];

        try {
            events = await this.abuseEvents.find({
                $or: [{ username: user.username }, { userId: user._id }]
            });
        } catch (err) {
            logger.error('Error fetching abuse events for user %s %s', user.username, err);
        }

        return events.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);
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
        await this.users.update(
            { username: user.username },
            {
                $set: {
                    disabled: true,
                    tokens: [],
                    trustState: 'banned_evasion_review',
                    banReason: reason || 'Blocked for repeated ban evasion',
                    evasionReviewRequired: true,
                    riskFlags: nextFlags
                }
            }
        );

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
}

export default AbuseService;
