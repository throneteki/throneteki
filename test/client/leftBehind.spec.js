import { findLeftBehind, rowTypeOf } from '../../client/Components/GameBoard/leftBehind.js';

describe('findLeftBehind', function () {
    it('finds cards outside play that still hold attachments or duplicates', function () {
        const withAttachment = { uuid: 'a', attachments: [{ uuid: 'x' }], dupes: [] };
        const withDupe = { uuid: 'b', attachments: [], dupes: [{ uuid: 'y' }] };
        const plain = { uuid: 'c', attachments: [], dupes: [] };

        const found = findLeftBehind({
            discardPile: [plain, withAttachment],
            deadPile: [withDupe],
            hand: [plain]
        });

        expect(found).toEqual([withAttachment, withDupe]);
    });

    it('returns the same empty list when nothing is left behind', function () {
        const first = findLeftBehind({ discardPile: [{ uuid: 'c', attachments: [], dupes: [] }] });

        expect(first).toEqual([]);
        expect(findLeftBehind({ hand: [] })).toBe(first);
    });
});

describe('rowTypeOf', function () {
    it('puts attachments with characters and other types in the last row', function () {
        expect(rowTypeOf({ type: 'attachment' })).toBe('character');
        expect(rowTypeOf({ type: 'location' })).toBe('location');
        expect(rowTypeOf({ type: 'event' })).toBe('other');
    });
});
