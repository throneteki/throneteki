import db, { resetDatabase } from '../helpers/database.js';
import BanlistService from '../../../../server/services/BanlistService.js';

describe('Postgres BanlistService', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.service = new BanlistService();
    });

    it('should add, find, list and remove entries in the MongoDB document shape', async function () {
        const added = await this.service.addBanlistEntry({
            ip: '203.0.113.10',
            user: 'Admin',
            added: new Date('2026-01-01T00:00:00Z')
        });

        expect(added).toEqual({
            _id: jasmine.any(String),
            ip: '203.0.113.10',
            user: 'Admin',
            added: new Date('2026-01-01T00:00:00Z')
        });
        expect(await this.service.getEntryByIp('203.0.113.10')).toEqual(added);
        expect(await this.service.getBanList()).toEqual([added]);

        await this.service.removeBanlistEntry(String(added._id));

        expect(await this.service.getEntryByIp('203.0.113.10')).toBeUndefined();
    });

    it('should remove an entry carried over from MongoDB by its old id', async function () {
        await db.query(
            "INSERT INTO banlist (mongo_id, ip, created_by) VALUES ('5f1d7c1e2b3a4c5d6e7f8091', '203.0.113.10', 'Admin')"
        );

        await this.service.removeBanlistEntry('5f1d7c1e2b3a4c5d6e7f8091');

        expect(await this.service.getBanList()).toEqual([]);
    });

    it('should refuse a duplicate ip', async function () {
        await this.service.addBanlistEntry({ ip: '203.0.113.10', user: 'Admin' });

        await expectAsync(
            this.service.addBanlistEntry({ ip: '203.0.113.10', user: 'Admin' })
        ).toBeRejectedWithError('Error occured adding banlist entry');
    });
});
