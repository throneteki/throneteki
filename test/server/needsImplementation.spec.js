import { needsImplementation } from '../../server/game/needsImplementation.js';

describe('whether a card needs a card file', function () {
    it('does not for a card without text', function () {
        expect(needsImplementation({ type: 'character', text: '' })).toBe(false);
    });

    it('does not for a card whose text is only keywords', function () {
        expect(needsImplementation({ type: 'character', text: 'Ambush (2).' })).toBe(false);
        expect(needsImplementation({ type: 'character', text: 'Shadow (3). Stealth.' })).toBe(
            false
        );
        expect(
            needsImplementation({
                type: 'attachment',
                text: 'No attachments except <i>Weapon</i>.'
            })
        ).toBe(false);
    });

    it('does for a card whose text starts with a keyword but is an ability', function () {
        expect(
            needsImplementation({
                type: 'plot',
                text: 'Limited cards cannot be marshaled, played, or put into play.'
            })
        ).toBe(true);
    });

    it('does for a card with an ability as well as keywords', function () {
        expect(
            needsImplementation({
                type: 'character',
                text: 'Stealth.\n<b>Action:</b> Kneel your faction card to draw 1 card.'
            })
        ).toBe(true);
    });

    it('does not for an agenda whose deckbuilding rules deck validation enforces', function () {
        expect(
            needsImplementation({
                code: '01204',
                type: 'agenda',
                text: 'You may include non-loyal [targaryen] cards in your deck.'
            })
        ).toBe(false);
    });

    it('does for an agenda without deckbuilding rules', function () {
        expect(
            needsImplementation({
                code: '00030',
                type: 'agenda',
                text: 'You may run an agenda in addition to this one.'
            })
        ).toBe(true);
    });
});
