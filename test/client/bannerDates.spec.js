import {
    bannerStatus,
    endOfDay,
    startOfDay,
    toDateInput
} from '../../client/Components/Banners/bannerDates.js';

describe('banner dates', function () {
    const now = new Date(2026, 10, 17, 15, 30);

    it('turns form days into a window covering the whole of both UTC days', function () {
        expect(startOfDay('2026-11-17')).toBe('2026-11-17T00:00:00.000Z');
        expect(endOfDay('2026-11-17')).toBe('2026-11-18T00:00:00.000Z');
        expect(toDateInput('2026-11-17T23:59:00.000Z')).toBe('2026-11-17');
    });

    it('reads back the days it saved whatever the local timezone', function () {
        const showFrom = startOfDay('2026-11-17');
        const showUntil = endOfDay('2026-11-18');

        expect(toDateInput(showFrom)).toBe('2026-11-17');
        expect(toDateInput(new Date(new Date(showUntil).getTime() - 1))).toBe('2026-11-18');
    });

    describe('bannerStatus', function () {
        const banner = {
            image: 'abc',
            showFrom: new Date(2026, 10, 10).toISOString(),
            showUntil: new Date(2026, 10, 20).toISOString()
        };

        it('describes whether a banner is showing', function () {
            expect(bannerStatus(banner, now)).toBe('Live');
            expect(bannerStatus(banner, new Date(2026, 10, 9))).toBe('Scheduled');
            expect(bannerStatus(banner, new Date(2026, 10, 20))).toBe('Expired');
        });

        it('flags a banner that will not show because it has no image', function () {
            expect(bannerStatus({ ...banner, image: null }, now)).toBe('No image');
            expect(bannerStatus({ ...banner, image: null }, new Date(2026, 10, 20))).toBe(
                'Expired'
            );
        });
    });
});
