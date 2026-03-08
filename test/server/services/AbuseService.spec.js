import AbuseService from '../../../server/services/AbuseService.js';

function createCollection(initialData = []) {
    let data = initialData.slice();

    return {
        async find(query = {}) {
            if (!query || Object.keys(query).length === 0) {
                return data.slice();
            }

            if (query.type && query.createdAt && query.createdAt.$gte) {
                return data.filter((entry) => {
                    return (
                        entry.type === query.type &&
                        new Date(entry.createdAt) >= new Date(query.createdAt.$gte)
                    );
                });
            }

            if (query.ip) {
                return data.filter((entry) => entry.ip === query.ip);
            }

            return data.slice();
        },
        async insert(entry) {
            const savedEntry = {
                _id: entry._id || `${data.length + 1}`,
                ...entry
            };
            data.push(savedEntry);
            return savedEntry;
        },
        async update(filter, update) {
            data = data.map((entry) => {
                const matches =
                    (filter._id && entry._id === filter._id) ||
                    (filter.username && entry.username === filter.username);

                if (!matches) {
                    return entry;
                }

                return {
                    ...entry,
                    ...(update.$set || {})
                };
            });
        },
        getData() {
            return data;
        }
    };
}

describe('AbuseService', function () {
    beforeEach(function () {
        this.collections = {
            users: createCollection([]),
            banlist: createCollection([]),
            abuse_blocks: createCollection([]),
            abuse_events: createCollection([])
        };
        this.db = {
            get: (name) => this.collections[name]
        };
        this.configService = {
            getValue: () => 'test-secret'
        };
        this.service = new AbuseService(this.db, this.configService);
    });

    it('should normalize ipv4 and derive a /24 subnet', function () {
        expect(this.service.normalizeIp('::ffff:192.168.1.25')).toBe('192.168.1.25');
        expect(this.service.getSubnet('192.168.1.25')).toBe('192.168.1.0/24');
    });

    it('should derive an ipv6 /64 subnet', function () {
        expect(this.service.getSubnet('2001:db8::1')).toBe('2001:0db8:0000:0000::/64');
    });

    it('should hard-block a registration from an exact blocked ip', async function () {
        await this.collections.abuse_blocks.insert({
            scope: 'ip',
            value: '10.0.0.1',
            active: true,
            createdAt: new Date()
        });

        const assessment = await this.service.assessRegistrationAttempt({
            ip: '10.0.0.1',
            email: 'test@example.com',
            username: 'newuser'
        });

        expect(assessment.blocked).toBe(true);
        expect(assessment.trustState).toBe('banned_evasion_review');
        expect(assessment.riskFlags).toContain('blocked_exact_ip');
    });

    it('should restrict repeated registrations on a suspicious subnet', async function () {
        await this.collections.users.insert({
            _id: 'user-1',
            username: 'disabled-one',
            disabled: true,
            registerSubnet: '10.0.0.0/24'
        });
        await this.collections.users.insert({
            _id: 'user-2',
            username: 'disabled-two',
            disabled: true,
            registerSubnet: '10.0.0.0/24'
        });

        const assessment = await this.service.assessRegistrationAttempt({
            ip: '10.0.0.33',
            email: 'test@example.com',
            username: 'newuser'
        });

        expect(assessment.blocked).toBe(false);
        expect(assessment.trustState).toBe('new');
        expect(assessment.riskFlags).toContain('repeated_disabled_subnet_match');
    });
});
