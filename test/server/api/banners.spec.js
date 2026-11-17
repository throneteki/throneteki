import { parseBanner } from '../../../server/api/banners.js';

describe('banner request', function () {
    const valid = {
        title: '  Winter Melee Open  ',
        linkUrl: 'https://example.com/winter',
        eventId: null,
        eventDate: '2026-12-12',
        showFrom: '2026-11-01T00:00:00.000Z',
        showUntil: '2026-12-13T00:00:00.000Z'
    };

    it('reads a complete banner', function () {
        expect(parseBanner(valid)).toEqual({
            banner: {
                title: 'Winter Melee Open',
                linkUrl: 'https://example.com/winter',
                eventId: null,
                eventDate: '2026-12-12',
                showFrom: new Date('2026-11-01T00:00:00.000Z'),
                showUntil: new Date('2026-12-13T00:00:00.000Z')
            }
        });
    });

    it('allows a banner with only a title and when to show it', function () {
        const { banner } = parseBanner({
            title: 'Store championships',
            linkUrl: '',
            eventId: null,
            eventDate: null,
            showFrom: valid.showFrom,
            showUntil: valid.showUntil
        });

        expect(banner).toEqual(
            expect.objectContaining({ linkUrl: null, eventId: null, eventDate: null })
        );
    });

    it('needs a title', function () {
        expect(parseBanner({ ...valid, title: '   ' }).error).toMatch(/title/);
        expect(parseBanner({ ...valid, title: 'x'.repeat(101) }).error).toMatch(/title/);
    });

    it('only links to https addresses', function () {
        expect(parseBanner({ ...valid, linkUrl: 'http://example.com' }).error).toMatch(/https/);
        expect(parseBanner({ ...valid, linkUrl: 'javascript:alert(1)' }).error).toMatch(/https/);
        expect(parseBanner({ ...valid, linkUrl: 'not a url' }).error).toMatch(/https/);
    });

    it('limits the length of the link as it will be stored', function () {
        const path = 'x'.repeat(500 - 'https://example.com/'.length);

        expect(
            parseBanner({ ...valid, linkUrl: `https://example.com/${path}` }).banner
        ).toBeDefined();
        // Each é is stored percent-encoded as %C3%A9
        expect(
            parseBanner({ ...valid, linkUrl: `https://example.com/${'é'.repeat(200)}` }).error
        ).toMatch(/at most 500/);
    });

    it('only accepts timestamps that say their timezone', function () {
        expect(parseBanner({ ...valid, showFrom: '2026-11-01 00:00' }).error).toMatch(
            /start and stop/
        );
        expect(parseBanner({ ...valid, showFrom: '2026-11-01T00:00:00' }).error).toMatch(
            /start and stop/
        );
        expect(parseBanner({ ...valid, showFrom: '2026-11-01T00:00:00+10:00' }).banner).toEqual(
            expect.objectContaining({ showFrom: new Date('2026-10-31T14:00:00Z') })
        );
    });

    it('starts a game for an event instead of opening a link', function () {
        expect(parseBanner({ ...valid, linkUrl: null, eventId: '12' }).banner).toEqual(
            expect.objectContaining({ linkUrl: null, eventId: '12' })
        );
    });

    it('refuses a banner that both opens a link and starts a game', function () {
        expect(parseBanner({ ...valid, eventId: '12' }).error).toMatch(/not both/);
    });

    it('refuses an event id that is not a number', function () {
        expect(
            parseBanner({ ...valid, linkUrl: null, eventId: '5f1d7c1e2b3a4c5d6e7f8091' }).error
        ).toMatch(/event/);
    });

    it('refuses an event date that does not exist', function () {
        expect(parseBanner({ ...valid, eventDate: '2026-02-30' }).error).toMatch(/date/);
        expect(parseBanner({ ...valid, eventDate: '12/12/2026' }).error).toMatch(/date/);
    });

    it('needs a window that ends after it starts', function () {
        expect(parseBanner({ ...valid, showUntil: undefined }).error).toMatch(/start and stop/);
        expect(parseBanner({ ...valid, showUntil: valid.showFrom }).error).toMatch(/after/);
    });
});
