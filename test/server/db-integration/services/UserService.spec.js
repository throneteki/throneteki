import crypto from 'crypto';
import db, { resetDatabase } from '../helpers/database.js';
import UserService from '../../../../server/services/UserService.js';

const config = {
    hmacSecret: 'test-secret',
    refreshTokenRetentionDays: 30
};

function newUser(overrides = {}) {
    return {
        username: 'Stark',
        email: 'ned@winterfell.example',
        emailDomain: 'winterfell.example',
        password: 'hashed-password',
        registered: new Date('2026-01-02T03:04:05Z'),
        enableGravatar: true,
        verified: true,
        registerIp: '::ffff:192.168.1.25',
        registerIpNormalized: '192.168.1.25',
        registerSubnet: '192.168.1.0/24',
        lastLoginIp: '192.168.1.25',
        lastLoginSubnet: '192.168.1.0/24',
        signupFingerprintHash: 'fingerprint-1',
        riskFlags: ['new_account'],
        riskScore: 10,
        trustState: 'trusted',
        ...overrides
    };
}

describe('Postgres UserService', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.service = new UserService({ getValue: (key) => config[key] });
    });

    describe('addUser()', function () {
        it('should return the stored user in the same shape as the MongoDB documents', async function () {
            const user = await this.service.addUser(newUser());

            expect(user._id).toEqual(jasmine.any(String));
            expect(user).toEqual(
                jasmine.objectContaining({
                    username: 'Stark',
                    email: 'ned@winterfell.example',
                    registered: new Date('2026-01-02T03:04:05Z'),
                    registerIp: '::ffff:192.168.1.25',
                    registerSubnet: '192.168.1.0/24',
                    riskFlags: ['new_account'],
                    settings: {},
                    permissions: {},
                    blockList: [],
                    tokens: []
                })
            );
        });

        it('should leave off fields that were not set, as the MongoDB documents did', async function () {
            const user = await this.service.addUser(newUser());

            expect('resetTokenHash' in user).toBe(false);
            expect('patreon' in user).toBe(false);
            expect('restrictedUntil' in user).toBe(false);
        });

        it('should store invalid ip addresses as missing rather than failing', async function () {
            const user = await this.service.addUser(
                newUser({ registerIp: 'unknown', registerSubnet: 'not-a-subnet' })
            );

            expect('registerIp' in user).toBe(false);
            expect('registerSubnet' in user).toBe(false);
        });

        it('should store a subnet given with host bits set as its network', async function () {
            const user = await this.service.addUser(
                newUser({ registerSubnet: '192.168.1.25/24', lastLoginSubnet: '2001:db8::1/64' })
            );

            expect(user.registerSubnet).toBe('192.168.1.0/24');
            expect(user.lastLoginSubnet).toBe('2001:db8::/64');
        });

        it('should reject a username that differs from an existing one only by case', async function () {
            await this.service.addUser(newUser());

            await expectAsync(
                this.service.addUser(newUser({ username: 'STARK', email: 'other@example' }))
            ).toBeRejected(
                jasmine.objectContaining({
                    message: 'Error occured adding user',
                    duplicateField: 'username'
                })
            );
        });

        it('should reject an email that differs from an existing one only by case', async function () {
            await this.service.addUser(newUser());

            await expectAsync(
                this.service.addUser(newUser({ username: 'Snow', email: 'NED@winterfell.example' }))
            ).toBeRejected(jasmine.objectContaining({ duplicateField: 'email' }));
        });
    });

    describe('getUserByUsername() / getUserByEmail()', function () {
        beforeEach(async function () {
            await this.service.addUser(newUser());
        });

        it('should find the user whatever the case', async function () {
            const user = await this.service.getUserByUsername('sTaRk');

            expect(user.username).toBe('Stark');
            expect(user.getDetails().settings.windowTimer).toBe(10);
        });

        it('should find the user by email whatever the case', async function () {
            const user = await this.service.getUserByEmail('NED@Winterfell.example');

            expect(user.username).toBe('Stark');
        });

        it('should return undefined for an unknown user', async function () {
            expect(await this.service.getUserByUsername('Lannister')).toBeUndefined();
        });
    });

    describe('getUserById()', function () {
        it('should find a user by id', async function () {
            const added = await this.service.addUser(newUser());

            const user = await this.service.getUserById(added._id);

            expect(user.username).toBe('Stark');
        });

        it('should find a user carried over from MongoDB by their old id', async function () {
            const added = await this.service.addUser(newUser());
            await db.query('UPDATE users SET mongo_id = $1 WHERE id = $2', [
                '5f1d7c1e2b3a4c5d6e7f8091',
                added._id
            ]);

            const user = await this.service.getUserById('5f1d7c1e2b3a4c5d6e7f8091');

            expect(user._id).toBe(added._id);
        });
    });

    describe('update()', function () {
        beforeEach(async function () {
            await this.service.addUser(newUser());
            this.details = (await this.service.getUserByUsername('Stark')).getDetails();
        });

        it('should save the user details', async function () {
            this.details.email = 'eddard@winterfell.example';
            this.details.settings = { ...this.details.settings, cardSize: 'large' };
            this.details.trustState = 'restricted';
            this.details.restrictedUntil = new Date('2026-02-01T00:00:00Z');

            await this.service.update(this.details);

            const user = await this.service.getUserByUsername('Stark');
            expect(user.email).toBe('eddard@winterfell.example');
            expect(user.emailDomain).toBe('winterfell.example');
            expect(user.getDetails().settings.cardSize).toBe('large');
            expect(user.trustState).toBe('restricted');
            expect(user.restrictedUntil).toEqual(new Date('2026-02-01T00:00:00Z'));
        });

        it('should replace the permissions, ignoring ones that do not exist', async function () {
            this.details.permissions = { isAdmin: true, canEditNews: true, canFly: true };
            await this.service.update(this.details);

            this.details.permissions = { isAdmin: false, canEditNews: true };
            await this.service.update(this.details);

            const user = await this.service.getUserByUsername('Stark');
            expect(user.permissions).toEqual({ canEditNews: true });
            expect(user.isAdmin).toBeFalsy();
        });

        it('should only change the password when a new one is given', async function () {
            this.details.password = '';
            await this.service.update(this.details);
            expect((await this.service.getUserByUsername('Stark')).password).toBe(
                'hashed-password'
            );

            this.details.password = 'new-hash';
            await this.service.update(this.details);
            expect((await this.service.getUserByUsername('Stark')).password).toBe('new-hash');
        });
    });

    describe('updateBlockList()', function () {
        it('should store the block list lower cased and tell listeners', async function () {
            await this.service.addUser(newUser());
            const listener = jasmine.createSpy('onBlocklistChanged');
            this.service.on('onBlocklistChanged', listener);

            await this.service.updateBlockList({
                username: 'Stark',
                blockList: ['Lannister', 'lannister', 'Greyjoy']
            });

            const user = await this.service.getUserByUsername('Stark');
            expect(user.blockList).toEqual(['greyjoy', 'lannister']);
            expect(listener).toHaveBeenCalled();
        });
    });

    describe('reset and activation tokens', function () {
        beforeEach(async function () {
            await this.service.addUser(
                newUser({
                    verified: false,
                    activationTokenHash: 'activation-hash',
                    activationTokenExpiry: new Date(Date.now() + 60000)
                })
            );
            this.user = await this.service.getUserByUsername('Stark');
        });

        it('should set and clear a reset token', async function () {
            const expiry = new Date('2026-03-01T00:00:00Z');

            await this.service.setResetToken(this.user, 'reset-hash', expiry);
            let user = await this.service.getUserByUsername('Stark');
            expect(user.resetTokenHash).toBe('reset-hash');
            expect(user.tokenExpires).toEqual(expiry);

            await this.service.clearResetToken(user);
            user = await this.service.getUserByUsername('Stark');
            expect(user.resetTokenHash).toBeUndefined();
            expect(user.tokenExpires).toBeUndefined();
        });

        it('should verify the user and clear the activation token on activation', async function () {
            await this.service.activateUser(this.user);

            const user = await this.service.getUserByUsername('Stark');
            expect(user.verified).toBe(true);
            expect(user.activationTokenHash).toBeUndefined();
            expect(user.activationTokenExpiry).toBeUndefined();
        });

        it('should set a new password', async function () {
            await this.service.setPassword(this.user, 'another-hash');

            expect((await this.service.getUserByUsername('Stark')).password).toBe('another-hash');
        });
    });

    describe('deleteExpiredUnverifiedAccounts()', function () {
        beforeEach(async function () {
            const expired = new Date(Date.now() - 60000);
            const pending = new Date(Date.now() + 60000);

            await this.service.addUser(
                newUser({ verified: false, activationTokenExpiry: expired })
            );
            await this.service.addUser(
                newUser({
                    username: 'Lannister',
                    email: 'tywin@casterly.example',
                    verified: false,
                    activationTokenExpiry: expired
                })
            );
            await this.service.addUser(
                newUser({
                    username: 'Tully',
                    email: 'hoster@riverrun.example',
                    verified: false,
                    activationTokenExpiry: pending
                })
            );
            await this.service.addUser(
                newUser({ username: 'Arryn', email: 'jon@eyrie.example', verified: true })
            );
        });

        it('should delete every unverified account whose activation has expired', async function () {
            expect(await this.service.deleteExpiredUnverifiedAccounts()).toBe(2);

            const remaining = await db.query('SELECT username FROM users ORDER BY username');
            expect(remaining.map((row) => row.username)).toEqual(['Arryn', 'Tully']);
        });

        it('should only delete the matching account when given a username or email', async function () {
            expect(
                await this.service.deleteExpiredUnverifiedAccounts({ username: 'lannister' })
            ).toBe(1);
            expect(
                await this.service.deleteExpiredUnverifiedAccounts({
                    email: 'NED@winterfell.example'
                })
            ).toBe(1);
            expect(await this.service.deleteExpiredUnverifiedAccounts({ username: 'Tully' })).toBe(
                0
            );
        });
    });

    describe('refresh tokens', function () {
        beforeEach(async function () {
            await this.service.addUser(newUser());
        });

        it('should add a token that can then be verified', async function () {
            const added = await this.service.addRefreshToken('Stark', 'auth-token', '10.0.0.1');

            const user = await this.service.getUserByUsername('Stark');
            const stored = user.tokens.find((token) => token._id.toString() === added.id);

            expect(stored).toEqual(
                jasmine.objectContaining({
                    token: added.token,
                    ip: '10.0.0.1',
                    exp: jasmine.any(Date),
                    lastUsed: jasmine.any(Date)
                })
            );
            expect(this.service.verifyRefreshToken('Stark', stored, added.token)).toBe(true);
            expect(this.service.verifyRefreshToken('Stark', stored, 'not-the-token')).toBe(false);
            expect(this.service.verifyRefreshToken('Lannister', stored, added.token)).toBe(false);
        });

        it('should still verify a token carried over from MongoDB', async function () {
            const mongoTokenId = '5f1d7c1e2b3a4c5d6e7f8091';
            const token = crypto
                .createHmac('sha512', config.hmacSecret)
                .update(`REFRESH Stark ${mongoTokenId}`)
                .digest('hex');
            await db.query(
                "INSERT INTO refresh_tokens (user_id, token_id, token, expires_at) SELECT id, $1, $2, now() + interval '1 day' FROM users",
                [mongoTokenId, token]
            );

            const user = await this.service.getUserByUsername('Stark');
            const stored = user.tokens.find((t) => t._id.toString() === mongoTokenId);

            expect(this.service.verifyRefreshToken('Stark', stored, token)).toBe(true);
        });

        it('should not verify an expired token', async function () {
            const added = await this.service.addRefreshToken('Stark', 'auth-token', '10.0.0.1');
            await db.query("UPDATE refresh_tokens SET expires_at = now() - interval '1 minute'");

            const user = await this.service.getUserByUsername('Stark');

            expect(this.service.verifyRefreshToken('Stark', user.tokens[0], added.token)).toBe(
                false
            );
        });

        it('should not add a token for an unknown user', async function () {
            expect(
                await this.service.addRefreshToken('Lannister', 'auth-token', '10.0.0.1')
            ).toBeUndefined();
        });

        it('should record where and when a token was last used', async function () {
            const added = await this.service.addRefreshToken('Stark', 'auth-token', '10.0.0.1');
            await db.query("UPDATE refresh_tokens SET last_used_at = now() - interval '1 day'");

            await this.service.updateRefreshTokenUsage(added.id, '10.0.0.2');

            const [token] = (await this.service.getUserByUsername('Stark')).tokens;
            expect(token.ip).toBe('10.0.0.2');
            expect(Date.now() - token.lastUsed.getTime()).toBeLessThan(60000);
        });

        it('should look up and remove a token only for the user that holds it', async function () {
            const added = await this.service.addRefreshToken('Stark', 'auth-token', '10.0.0.1');
            await this.service.addUser(
                newUser({ username: 'Lannister', email: 'tywin@casterly.example' })
            );

            expect(await this.service.getRefreshTokenById('Lannister', added.id)).toBeUndefined();
            expect((await this.service.getRefreshTokenById('stark', added.id)).username).toBe(
                'Stark'
            );

            await this.service.removeRefreshToken('Lannister', added.id);
            expect((await this.service.getUserByUsername('Stark')).tokens.length).toBe(1);

            await this.service.removeRefreshToken('Stark', added.id);
            expect((await this.service.getUserByUsername('Stark')).tokens.length).toBe(0);
        });

        it('should clear every session for a user', async function () {
            await this.service.addRefreshToken('Stark', 'auth-token', '10.0.0.1');
            await this.service.addRefreshToken('Stark', 'auth-token', '10.0.0.2');

            expect(await this.service.clearUserSessions('stark')).toBe(true);
            expect((await this.service.getUserByUsername('Stark')).tokens).toEqual([]);
            expect(await this.service.clearUserSessions('Lannister')).toBe(false);
        });

        it('should clean up tokens that have expired or not been used for too long', async function () {
            const expired = await this.service.addRefreshToken('Stark', 'a', '10.0.0.1');
            const stale = await this.service.addRefreshToken('Stark', 'b', '10.0.0.1');
            const current = await this.service.addRefreshToken('Stark', 'c', '10.0.0.1');
            await db.query(
                "UPDATE refresh_tokens SET expires_at = now() - interval '1 minute' WHERE token_id = $1",
                [expired.id]
            );
            await db.query(
                "UPDATE refresh_tokens SET last_used_at = now() - interval '31 days' WHERE token_id = $1",
                [stale.id]
            );

            expect(await this.service.cleanupRefreshTokens()).toBe(2);

            const tokens = (await this.service.getUserByUsername('Stark')).tokens;
            expect(tokens.map((token) => token._id)).toEqual([current.id]);
        });
    });

    describe('setSupporterStatus()', function () {
        it('should grant and remove the supporter permission', async function () {
            await this.service.addUser(newUser());

            await this.service.setSupporterStatus('Stark', true);
            await this.service.setSupporterStatus('Stark', true);
            expect((await this.service.getUserByUsername('Stark')).isSupporter).toBe(true);

            await this.service.setSupporterStatus('Stark', false);
            expect((await this.service.getUserByUsername('Stark')).isSupporter).toBeFalsy();
        });
    });

    describe('getPossiblyLinkedAccounts()', function () {
        it('should find users who have used a refresh token from the same ip', async function () {
            await this.service.addUser(newUser());
            await this.service.addUser(newUser({ username: 'Snow', email: 'jon@wall.example' }));
            await this.service.addUser(
                newUser({ username: 'Lannister', email: 'tywin@casterly.example' })
            );
            await this.service.addRefreshToken('Stark', 'a', '10.0.0.1');
            await this.service.addRefreshToken('Snow', 'b', '10.0.0.1');
            await this.service.addRefreshToken('Lannister', 'c', '10.0.0.9');

            const user = await this.service.getUserByUsername('Stark');
            const linked = await this.service.getPossiblyLinkedAccounts(user);

            expect(linked.map((account) => account.username)).toEqual(['Snow', 'Stark']);
        });
    });

    describe('findLinkedUsers()', function () {
        beforeEach(async function () {
            this.stark = await this.service.addUser(newUser());
            await this.service.addUser(
                newUser({
                    username: 'Snow',
                    email: 'jon@wall.example',
                    registerIp: '10.0.0.5',
                    registerIpNormalized: '10.0.0.5',
                    lastLoginIp: '192.168.1.25',
                    registerSubnet: '2001:0db8:0000:0000::/64',
                    lastLoginSubnet: '10.0.0.0/24',
                    signupFingerprintHash: 'fingerprint-2'
                })
            );
            await this.service.addUser(
                newUser({
                    username: 'Lannister',
                    email: 'tywin@casterly.example',
                    registerIp: '172.16.0.1',
                    registerIpNormalized: '172.16.0.1',
                    lastLoginIp: '172.16.0.1',
                    registerSubnet: '172.16.0.0/24',
                    lastLoginSubnet: '172.16.0.0/24',
                    signupFingerprintHash: 'fingerprint-1'
                })
            );
        });

        it('should report each linked user with the evidence for the link', async function () {
            const linked = await this.service.findLinkedUsers({
                ip: '192.168.1.25',
                subnet: '172.16.0.0/24',
                fingerprintHash: 'fingerprint-1',
                excludeUserId: this.stark._id
            });

            expect(
                linked.map((link) => ({ username: link.user.username, evidence: link.evidence }))
            ).toEqual([
                { username: 'Snow', evidence: ['shared exact ip'] },
                {
                    username: 'Lannister',
                    evidence: ['shared subnet', 'shared fingerprint']
                }
            ]);
        });

        it('should match ipv6 subnets however they are written', async function () {
            const linked = await this.service.findLinkedUsers({ subnet: '2001:db8::/64' });

            expect(linked.map((link) => link.user.username)).toEqual(['Snow']);
        });

        it('should find nothing when given nothing to match on', async function () {
            expect(await this.service.findLinkedUsers({ excludeUserId: this.stark._id })).toEqual(
                []
            );
        });
    });

    describe('updateUserFields()', function () {
        beforeEach(async function () {
            this.added = await this.service.addUser(newUser());
        });

        it('should set fields by username or id', async function () {
            await this.service.updateUserFields(
                { username: 'stark' },
                { lastLoginIp: '10.1.1.1', lastLoginSubnet: '10.1.1.0/24' }
            );
            await this.service.updateUserFields(
                { id: this.added._id },
                { disabled: true, banReason: 'Ban evasion' }
            );

            const details = (await this.service.getUserByUsername('Stark')).getDetails();
            expect(details.lastLoginIp).toBe('10.1.1.1');
            expect(details.lastLoginSubnet).toBe('10.1.1.0/24');
            expect(details.disabled).toBe(true);
            expect(details.banReason).toBe('Ban evasion');
        });

        it('should refuse a field that does not exist', async function () {
            await expectAsync(
                this.service.updateUserFields({ username: 'Stark' }, { isKing: true })
            ).toBeRejectedWithError("Unknown user field 'isKing'");
        });
    });
});
