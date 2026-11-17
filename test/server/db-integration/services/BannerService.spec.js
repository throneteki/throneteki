import db, { resetDatabase } from '../helpers/database.js';
import BannerService from '../../../../server/services/BannerService.js';

describe('Postgres BannerService', function () {
    const now = new Date('2026-11-17T12:00:00Z');

    const banner = (overrides = {}) => ({
        title: 'Winter Melee Open',
        linkUrl: 'https://example.com/winter',
        eventId: null,
        eventDate: '2026-12-12',
        showFrom: new Date('2026-11-01T00:00:00Z'),
        showUntil: new Date('2026-12-13T00:00:00Z'),
        ...overrides
    });

    beforeEach(async function () {
        await resetDatabase();

        this.service = new BannerService();
    });

    it('should add a banner and return it with its window', async function () {
        const added = await this.service.addBanner(banner(), 'Organiser');

        expect(added).toEqual({
            _id: expect.any(String),
            title: 'Winter Melee Open',
            linkUrl: 'https://example.com/winter',
            eventId: null,
            eventDate: '2026-12-12',
            image: null,
            showFrom: new Date('2026-11-01T00:00:00Z'),
            showUntil: new Date('2026-12-13T00:00:00Z'),
            createdBy: 'Organiser',
            createdAt: expect.any(Date)
        });
    });

    it('should only list banners with an image inside their window, soonest event first', async function () {
        const withImage = async (values) => {
            const added = await this.service.addBanner(banner(values));
            await this.service.setImage(added._id, {
                contentType: 'image/png',
                image: Buffer.from(values.title)
            });

            return added;
        };

        const later = await withImage(banner({ title: 'Later', eventDate: '2026-12-20' }));
        const sooner = await withImage(banner({ title: 'Sooner', eventDate: '2026-11-30' }));
        const undated = await withImage({ title: 'Undated', eventDate: null });
        await withImage(
            banner({
                title: 'Expired',
                showFrom: new Date('2026-10-01T00:00:00Z'),
                showUntil: new Date('2026-11-17T12:00:00Z')
            })
        );
        await withImage({ title: 'Scheduled', showFrom: new Date('2026-11-18T00:00:00Z') });
        await this.service.addBanner(banner({ title: 'No image', eventDate: '2026-11-20' }));

        const active = await this.service.getActiveBanners(now);

        expect(active.map((b) => b.title)).toEqual(['Sooner', 'Later', 'Undated']);
        expect(active.map((b) => b._id)).toEqual([sooner._id, later._id, undated._id]);
        expect(active[0]).not.toHaveProperty('createdBy');
        expect(active[0]).not.toHaveProperty('showFrom');
        expect((await this.service.getBanners()).length).toBe(6);
    });

    it('should link a banner to an event and unlink it when the event is deleted', async function () {
        const [event] = await db.query("INSERT INTO events (name) VALUES ('Winter') RETURNING id");
        const added = await this.service.addBanner(banner({ eventId: String(event.id) }));

        expect(added.eventId).toBe(String(event.id));

        await db.query('DELETE FROM events WHERE id = $1', [event.id]);

        expect((await this.service.getBanners())[0].eventId).toBeNull();
    });

    it('should refuse an event that does not exist', async function () {
        await expect(this.service.addBanner(banner({ eventId: '999' }))).rejects.toMatchObject({
            code: '23503'
        });
    });

    it('should update a banner', async function () {
        const added = await this.service.addBanner(banner());

        const updated = await this.service.updateBanner(
            added._id,
            banner({ title: 'Renamed', linkUrl: null, eventDate: null })
        );

        expect(updated).toEqual(
            expect.objectContaining({ title: 'Renamed', linkUrl: null, eventDate: null })
        );
        expect(await this.service.updateBanner('999', banner())).toBeUndefined();
    });

    it('should cache the lobby banners until a banner changes', async function () {
        const added = await this.service.addBanner(
            banner({
                showFrom: new Date(Date.now() - 60000),
                showUntil: new Date(Date.now() + 3600000)
            })
        );
        await this.service.setImage(added._id, {
            contentType: 'image/png',
            image: Buffer.from('image')
        });

        expect(await this.service.getCachedActiveBanners()).toHaveLength(1);

        await db.query('DELETE FROM banners');
        expect(await this.service.getCachedActiveBanners()).toHaveLength(1);

        await this.service.deleteBanner(added._id);
        expect(await this.service.getCachedActiveBanners()).toEqual([]);
    });

    it('should store and replace an image under a new token each time', async function () {
        const added = await this.service.addBanner(banner());

        const { image: first } = await this.service.setImage(added._id, {
            contentType: 'image/png',
            image: Buffer.from('first')
        });
        const updated = await this.service.setImage(added._id, {
            contentType: 'image/webp',
            image: Buffer.from('second')
        });
        const second = updated.image;

        expect(updated).toEqual({ ...added, image: second });
        expect(second).toMatch(/^[a-f0-9]{32}$/);
        expect(second).not.toBe(first);
        expect(await this.service.getImage(first)).toBeUndefined();
        expect(await this.service.getImage(second)).toEqual({
            contentType: 'image/webp',
            image: Buffer.from('second')
        });
        expect((await this.service.getBanners())[0].image).toBe(second);
    });

    it('should not store an image for a banner that does not exist', async function () {
        expect(
            await this.service.setImage('999', {
                contentType: 'image/png',
                image: Buffer.from('x')
            })
        ).toBeUndefined();
    });

    it('should delete a banner', async function () {
        const added = await this.service.addBanner(banner());

        expect(await this.service.deleteBanner(added._id)).toBe(true);
        expect(await this.service.deleteBanner(added._id)).toBe(false);
        expect(await this.service.getBanners()).toEqual([]);
    });
});
