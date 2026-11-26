import { canDrop, needsChoice } from '../../client/Components/GameBoard/dropTargets.js';

describe('canDrop', function () {
    it('does not let an event be put into play, but lets it go to the discard pile', function () {
        expect(canDrop('hand', 'play area', 'event')).toBe(false);
        expect(canDrop('hand', 'discard pile', 'event')).toBe(true);
    });

    it('lets characters, locations and attachments into play', function () {
        ['character', 'location', 'attachment'].forEach((type) =>
            expect(canDrop('hand', 'play area', type)).toBe(true)
        );
    });

    it('only lets characters go to the dead pile', function () {
        expect(canDrop('play area', 'dead pile', 'character')).toBe(true);
        expect(canDrop('play area', 'dead pile', 'location')).toBe(false);
    });

    it('keeps plots to the plot piles', function () {
        expect(canDrop('plot deck', 'revealed plots', 'plot')).toBe(true);
        expect(canDrop('hand', 'plot deck', 'character')).toBe(false);
    });

    it('leaves a card of unknown type to the server', function () {
        expect(canDrop('hand', 'play area', undefined)).toBe(true);
    });

    it('refuses an area the card cannot be moved to from where it is', function () {
        expect(canDrop('plot deck', 'hand', 'plot')).toBe(false);
    });
});

describe('needsChoice', function () {
    it('asks about a plot put on the used plots from the plot deck or the used plots', function () {
        expect(needsChoice('plot deck', 'revealed plots', 'plot')).toBe(true);
        expect(needsChoice('revealed plots', 'revealed plots', 'plot')).toBe(true);
    });

    it('does not ask about other moves', function () {
        expect(needsChoice('hand', 'discard pile', 'event')).toBe(false);
        expect(needsChoice('out of game', 'revealed plots', 'plot')).toBe(false);
        expect(needsChoice('revealed plots', 'plot deck', 'plot')).toBe(false);
    });
});
