import {
    findSpectators,
    spectatorPreview
} from '../../client/Components/GameBoard/Adaptive/SpectatorList.jsx';

const watching = (...names) => names.map((name) => ({ id: name, name }));

describe('spectatorPreview', function () {
    it('says no one is watching when there are no spectators', function () {
        expect(spectatorPreview([])).toBe('No one is watching');
    });

    it('names one or two spectators', function () {
        expect(spectatorPreview(watching('Ann'))).toBe('Ann');
        expect(spectatorPreview(watching('Ann', 'Bob'))).toBe('Ann and Bob');
    });

    it('names two spectators and counts the rest', function () {
        expect(spectatorPreview(watching('Ann', 'Bob', 'Cy'))).toBe('Ann, Bob and 1 more');
        const crowd = watching(...Array.from({ length: 60 }, (_, index) => `Watcher${index}`));
        expect(spectatorPreview(crowd)).toBe('Watcher0, Watcher1 and 58 more');
    });
});

describe('findSpectators', function () {
    const spectators = watching('Ann', 'Bob', 'Joanna');

    it('keeps everyone without a search', function () {
        expect(findSpectators(spectators, '  ')).toEqual(spectators);
    });

    it('finds spectators by any part of their name, whatever its case', function () {
        expect(findSpectators(spectators, 'AN').map((spectator) => spectator.name)).toEqual([
            'Ann',
            'Joanna'
        ]);
    });

    it('finds no one when no name matches', function () {
        expect(findSpectators(spectators, 'zed')).toEqual([]);
    });
});
