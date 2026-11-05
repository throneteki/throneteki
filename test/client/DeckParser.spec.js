import { lookupCardByName } from '../../client/Components/Decks/DeckParser.js';

describe('lookupCardByName', function () {
    const packs = [{ name: 'Core Set', code: 'Core', releaseDate: '2015-10-01' }];
    const handsJudgment = { code: '01045', name: "The Hand's Judgment", packCode: 'Core' };

    it('matches a name written with a typographic apostrophe, as CardgameDB exports it', function () {
        const apostrophe = String.fromCharCode(0x2019);
        const card = lookupCardByName({
            cardName: `The Hand${apostrophe}s Judgment`,
            cards: [handsJudgment],
            packs
        });

        expect(card).toBe(handsJudgment);
    });

    it('still matches a name written with a plain apostrophe', function () {
        const card = lookupCardByName({
            cardName: "The Hand's Judgment (Core)",
            cards: [handsJudgment],
            packs
        });

        expect(card).toBe(handsJudgment);
    });
});
