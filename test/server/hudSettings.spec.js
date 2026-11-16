import { sanitizeHud } from '../../server/hudSettings.js';

describe('sanitizeHud', function () {
    it('returns nothing when there is nothing to keep', function () {
        expect(sanitizeHud(undefined)).toBeUndefined();
        expect(sanitizeHud('large')).toBeUndefined();
        expect(sanitizeHud({ board: 'fancy', followAction: 'yes' })).toBeUndefined();
    });

    it('keeps sizes and switches that are valid', function () {
        expect(
            sanitizeHud({ cards: 'large', interface: '1.25', auto: false, animations: true })
        ).toEqual({ cards: 'large', interface: '1.25', auto: false, animations: true });
    });

    it('keeps only a known board layout', function () {
        expect(sanitizeHud({ board: 'adaptive' })).toEqual({ board: 'adaptive' });
        expect(sanitizeHud({ board: 'classic' })).toEqual({ board: 'classic' });
        expect(sanitizeHud({ board: 'adaptive<script>', cards: 'small' })).toEqual({
            cards: 'small'
        });
    });

    it('keeps follow the action only as a boolean', function () {
        expect(sanitizeHud({ followAction: false })).toEqual({ followAction: false });
        expect(sanitizeHud({ followAction: 'false', cards: 'small' })).toEqual({ cards: 'small' });
    });

    it('drops keys it does not know', function () {
        expect(sanitizeHud({ cards: 'small', layout: 'grid', extra: true })).toEqual({
            cards: 'small'
        });
    });
});
