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

    it('drops keys it does not know', function () {
        expect(sanitizeHud({ cards: 'small', layout: 'grid', extra: true })).toEqual({
            cards: 'small'
        });
    });

    it('keeps the overlays switch only when it is a switch', function () {
        expect(sanitizeHud({ overlays: false })).toEqual({ overlays: false });
        expect(sanitizeHud({ overlays: 'no' })).toBeUndefined();
    });
});
