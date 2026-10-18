import { resetDatabase } from '../helpers/database.js';
import DraftCubeService from '../../../../server/services/DraftCubeService.js';

describe('Postgres DraftCubeService', function () {
    beforeEach(async function () {
        await resetDatabase();

        this.service = new DraftCubeService();
    });

    it('should create, read, update and delete draft cubes', async function () {
        const packDefinitions = [
            { rarities: [{ name: 'Common', numPerPack: 5, cards: ['01028'] }] }
        ];

        const created = await this.service.create({
            name: 'Starter Cube',
            packDefinitions,
            starterDeck: { plotCards: [] }
        });

        expect(created).toEqual({
            _id: jasmine.any(String),
            name: 'Starter Cube',
            packDefinitions,
            starterDeck: { plotCards: [] },
            lastUpdated: jasmine.any(Date)
        });

        await this.service.update({ id: created._id, name: 'Renamed Cube', packDefinitions });

        const updated = await this.service.getById(created._id);
        expect(updated.name).toBe('Renamed Cube');
        expect(updated.starterDeck).toBeNull();
        expect(await this.service.getAll()).toEqual([updated]);

        await this.service.delete(created._id);
        expect(await this.service.getById(created._id)).toBeNull();
    });
});
