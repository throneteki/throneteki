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

    it('drops keys it does not know', function () {
        expect(sanitizeHud({ cards: 'small', layout: 'grid', extra: true })).toEqual({
            cards: 'small'
        });
    });

    it('keeps the prompt side only when it is left or right', function () {
        expect(sanitizeHud({ promptSide: 'right' })).toEqual({ promptSide: 'right' });
        expect(sanitizeHud({ promptSide: 'left' })).toEqual({ promptSide: 'left' });
        expect(sanitizeHud({ promptSide: 'middle' })).toBeUndefined();
    });
});
