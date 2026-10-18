import db, { resetDatabase } from '../helpers/database.js';
import AbuseService from '../../../../server/services/AbuseService.js';
import UserService from '../../../../server/services/UserService.js';

const config = { hmacSecret: 'test-secret', registrationEventRetentionDays: 30 };

describe('Postgres AbuseService', function () {
    beforeEach(async function () {
        await resetDatabase();

        const configService = { getValue: (key) => config[key] };
        this.userService = new UserService(configService);
        this.service = new AbuseService(configService, this.userService);

        this.addUser = (overrides) =>
            this.userService.addUser({
                username: 'Stark',
                email: 'ned@winterfell.example',
                emailDomain: 'winterfell.example',
                password: 'hash',
                verified: true,
                registerIp: '203.0.113.10',
                registerIpNormalized: '203.0.113.10',
                registerSubnet: '203.0.113.0/24',
                lastLoginIp: '203.0.113.10',
                lastLoginSubnet: '203.0.113.0/24',
                signupFingerprintHash: 'fingerprint-1',
                ...overrides
            });
    });

    describe('blocks', function () {
        it('should match active blocks on each scope', async function () {
            await this.service.createBlock({ scope: 'ip', value: '203.0.113.10' });
            await this.service.createBlock({ scope: 'subnet', value: '198.51.100.0/24' });
            await this.service.createBlock({ scope: 'fingerprint', value: 'fingerprint-1' });
            await this.service.createBlock({ scope: 'email_domain', value: 'spam.example' });

            const blocks = await this.service.getMatchingBlocks({
                ip: '203.0.113.10',
                subnet: '198.51.100.0/24',
                fingerprintHash: 'fingerprint-1',
                emailDomain: 'spam.example'
            });

            expect(blocks.map((block) => block.scope)).toEqual([
                'ip',
                'subnet',
                'fingerprint',
                'email_domain'
            ]);
        });

        it('should match ipv6 blocks however the address is written', async function () {
            await this.service.createBlock({
                scope: 'ip',
                value: '2001:0db8:0000:0000:0000:0000:0000:0001'
            });
            await this.service.createBlock({ scope: 'subnet', value: '2001:0db8:0000:0000::/64' });

            const blocks = await this.service.getMatchingBlocks({
                ip: '2001:db8::1',
                subnet: '2001:db8::/64'
            });

            expect(blocks.map((block) => [block.scope, block.value])).toEqual([
                ['ip', '2001:db8::1'],
                ['subnet', '2001:db8::/64']
            ]);
        });

        it('should not match blocks that are deactivated or have expired', async function () {
            const deactivated = await this.service.createBlock({
                scope: 'ip',
                value: '203.0.113.10'
            });
            await this.service.createBlock({
                scope: 'fingerprint',
                value: 'fingerprint-1',
                expiresAt: new Date(Date.now() - 60000)
            });
            await this.service.deactivateBlock(deactivated._id);

            const blocks = await this.service.getMatchingBlocks({
                ip: '203.0.113.10',
                fingerprintHash: 'fingerprint-1'
            });

            expect(blocks).toEqual([]);
        });

        it('should include a matching legacy banlist entry', async function () {
            await db.query("INSERT INTO banlist (ip, created_by) VALUES ('203.0.113.10', 'Admin')");

            const blocks = await this.service.getMatchingBlocks({ ip: '203.0.113.10' });

            expect(blocks).toEqual([
                jasmine.objectContaining({
                    scope: 'ip',
                    value: '203.0.113.10',
                    reason: 'Legacy banlist',
                    createdBy: 'Admin',
                    legacy: true
                })
            ]);
        });

        it('should list every block, newest first, in the MongoDB document shape', async function () {
            const user = await this.addUser();
            await this.service.createBlock({
                scope: 'ip',
                value: '203.0.113.10',
                createdAt: new Date('2026-01-01T00:00:00Z')
            });
            await this.service.createBlock({
                scope: 'email_domain',
                value: 'spam.example',
                createdBy: 'Admin',
                sourceUserId: user._id,
                createdAt: new Date('2026-02-01T00:00:00Z')
            });

            const blocks = await this.service.listBlocks();

            expect(blocks[0]).toEqual({
                _id: jasmine.any(String),
                scope: 'email_domain',
                value: 'spam.example',
                reason: 'Manual moderation action',
                sourceUserId: user._id,
                createdAt: new Date('2026-02-01T00:00:00Z'),
                createdBy: 'Admin',
                expiresAt: null,
                active: true,
                deactivatedAt: null
            });
            expect(blocks[1].scope).toBe('ip');
        });

        it('should ignore a source user that does not exist', async function () {
            const block = await this.service.createBlock({
                scope: 'ip',
                value: '203.0.113.10',
                sourceUserId: 'not-a-user'
            });

            expect(block.sourceUserId).toBeNull();
        });
    });

    describe('events', function () {
        it('should log an event and find it among the user’s recent events', async function () {
            const user = await this.addUser();

            await this.service.logEvent({
                type: 'login_attempt',
                username: 'Stark',
                userId: user._id,
                ip: '::ffff:203.0.113.10',
                signals: ['shared exact ip']
            });

            const [event] = await this.service.getRecentEventsForUser(user);

            expect(event).toEqual(
                jasmine.objectContaining({
                    type: 'login_attempt',
                    username: 'Stark',
                    userId: user._id,
                    ip: '203.0.113.10',
                    subnet: '203.0.113.0/24',
                    signals: ['shared exact ip'],
                    outcome: 'allowed'
                })
            );
        });

        it('should find recent registration attempts by ip, subnet or signals', async function () {
            const ip = '203.0.113.10';
            const subnet = this.service.getSubnet(ip);

            await this.service.logEvent({ type: 'registration_attempt', ip });
            await this.service.logEvent({ type: 'registration_attempt', ip: '203.0.113.99' });
            await this.service.logEvent({
                type: 'registration_attempt',
                ip: '192.0.2.1',
                signals: [`ip:${ip}`]
            });
            await this.service.logEvent({ type: 'registration_attempt', ip: '192.0.2.50' });
            await this.service.logEvent({
                type: 'registration_attempt',
                ip,
                createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
            });
            await this.service.logEvent({ type: 'login_attempt', ip });

            const attempts = await this.service.findRegistrationAttempts({ ip, subnet });

            expect(attempts.map((attempt) => attempt.ip)).toEqual([
                '203.0.113.10',
                '203.0.113.99',
                '192.0.2.1'
            ]);
        });

        it('should only clean up old registration events', async function () {
            const old = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);

            await this.service.logEvent({ type: 'registration_attempt', createdAt: old });
            await this.service.logEvent({ type: 'registration_preflight', createdAt: old });
            await this.service.logEvent({ type: 'login_attempt', createdAt: old });
            await this.service.logEvent({ type: 'registration_attempt' });

            expect(await this.service.cleanupOldRegistrationEvents()).toBe(2);
            expect((await db.query('SELECT count(*) AS count FROM abuse_events'))[0].count).toBe(2);
        });
    });

    describe('assessRegistrationAttempt()', function () {
        it('should hard block a registration from a blocked ip', async function () {
            await this.service.createBlock({ scope: 'ip', value: '203.0.113.10' });

            const assessment = await this.service.assessRegistrationAttempt({
                ip: '::ffff:203.0.113.10',
                email: 'new@example.com',
                username: 'Newcomer'
            });

            expect(assessment.blocked).toBe(true);
            expect(assessment.trustState).toBe('banned_evasion_review');
            expect(assessment.riskFlags).toContain('blocked_exact_ip');
        });

        it('should score a registration that shares an ip with a disabled account', async function () {
            await this.addUser({ disabled: true });

            const assessment = await this.service.assessRegistrationAttempt({
                ip: '203.0.113.10',
                email: 'new@example.com',
                username: 'Newcomer'
            });

            expect(assessment.riskFlags).toContain('disabled_exact_ip_match');
            expect(assessment.linkedUsers.map((link) => link.user.username)).toEqual(['Stark']);
            expect(assessment.trustState).toBe('new');
        });

        it('should flag a registration from a subnet shared by disabled accounts', async function () {
            for (const [username, email] of [
                ['Greyjoy', 'balon@pyke.example'],
                ['Bolton', 'roose@dreadfort.example']
            ]) {
                await this.addUser({
                    username,
                    email,
                    disabled: true,
                    registerIp: null,
                    registerIpNormalized: null,
                    lastLoginIp: null,
                    lastLoginSubnet: null,
                    signupFingerprintHash: null,
                    registerSubnet: '10.0.0.0/24'
                });
            }

            const assessment = await this.service.assessRegistrationAttempt({
                ip: '10.0.0.33',
                email: 'new@example.com',
                username: 'Newcomer'
            });

            expect(assessment.blocked).toBe(false);
            expect(assessment.trustState).toBe('new');
            expect(assessment.riskFlags).toContain('repeated_disabled_subnet_match');
        });

        it('should not trigger the registration cooldown until the fifth recent attempt', async function () {
            const now = Date.now();
            const attempt = (minutesAgo) =>
                this.service.logEvent({
                    type: 'registration_attempt',
                    ip: '10.0.0.33',
                    createdAt: new Date(now - minutesAgo * 60 * 1000)
                });
            const assess = () =>
                this.service.assessRegistrationAttempt({
                    ip: '10.0.0.33',
                    email: 'new@example.com',
                    username: 'Newcomer'
                });

            for (const minutesAgo of [12, 9, 6, 3]) {
                await attempt(minutesAgo);
            }

            const fourth = await assess();
            expect(fourth.cooldownRemainingMs).toBe(0);
            expect(fourth.riskFlags).not.toContain('registration_cooldown');

            await attempt(1);

            const fifth = await assess();
            expect(fifth.cooldownRemainingMs).toBeGreaterThan(0);
            expect(fifth.riskFlags).toContain('registration_cooldown');
        });
    });

    describe('moderation actions', function () {
        it('should restrict and unrestrict a user', async function () {
            await this.addUser();
            let user = (await this.userService.getUserByUsername('Stark')).getDetails();

            await this.service.restrictUser(user, { actor: 'Admin', reason: 'Spam' });
            user = (await this.userService.getUserByUsername('Stark')).getDetails();
            expect(user.trustState).toBe('restricted');
            expect(user.restrictedUntil).toEqual(jasmine.any(Date));
            expect(user.riskFlags).toContain('manual_restriction');

            await this.service.unrestrictUser(user, { actor: 'Admin' });
            user = (await this.userService.getUserByUsername('Stark')).getDetails();
            expect(user.trustState).toBe('trusted');
            expect(user.restrictedUntil).toBeUndefined();
            expect(user.riskFlags).not.toContain('manual_restriction');
        });

        it('should block a cluster, disable the user and sign them out', async function () {
            await this.addUser();
            await this.userService.addRefreshToken('Stark', 'token', '203.0.113.10');
            const user = (await this.userService.getUserByUsername('Stark')).getDetails();

            await this.service.blockCluster(user, { actor: 'Admin', reason: 'Ban evasion' });
            await this.service.blockCluster(user, { actor: 'Admin', reason: 'Ban evasion' });

            const banned = await this.userService.getUserByUsername('Stark');
            expect(banned.disabled).toBe(true);
            expect(banned.trustState).toBe('banned_evasion_review');
            expect(banned.tokens).toEqual([]);

            const blocks = await this.service.listBlocks();
            expect(blocks.map((block) => block.scope).sort()).toEqual([
                'email_domain',
                'fingerprint',
                'ip',
                'subnet'
            ]);
        });

        it('should record where a user last logged in', async function () {
            await this.addUser();

            await this.service.updateUserSessionMetadata('Stark', { ip: '::ffff:198.51.100.7' });

            const user = (await this.userService.getUserByUsername('Stark')).getDetails();
            expect(user.lastLoginIp).toBe('198.51.100.7');
            expect(user.lastLoginSubnet).toBe('198.51.100.0/24');
        });
    });
});
