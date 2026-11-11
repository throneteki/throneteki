import AbuseService from '../../../server/services/AbuseService.js';

describe('AbuseService', function () {
    beforeEach(function () {
        this.service = new AbuseService({ getValue: () => 'test-secret' });
    });

    it('should normalize ipv4 and derive a /24 subnet', function () {
        expect(this.service.normalizeIp('::ffff:192.168.1.25')).toBe('192.168.1.25');
        expect(this.service.getSubnet('192.168.1.25')).toBe('192.168.1.0/24');
    });

    it('should derive an ipv6 /64 subnet', function () {
        expect(this.service.getSubnet('2001:db8::1')).toBe('2001:0db8:0000:0000::/64');
    });
});
