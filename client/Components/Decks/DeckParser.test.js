const { lookupCardByName } = require('./DeckParser');

describe('#lookupCardName', () => {
    let cards, packs;

    const uniqueCard = { code: '1', name: 'Unique Card', packCode: 'P1' };
    const newVersionWithName = { code: '2', name: 'Duplicate Card', packCode: 'P2' };
    const originalVersionWithName = { code: '3', name: 'Duplicate Card', packCode: 'P1' };

    beforeEach(() => {
        cards = [
            uniqueCard,
            newVersionWithName,
            originalVersionWithName
        ];
        packs = [
            { name: 'Pack 2', code: 'P2', releaseDate: '2020-03-01' },
            { name: 'Pack 1', code: 'P1', releaseDate: '2020-01-01' }
        ];
    });

    test('returns empty if no card matches', () => {
        const card = lookupCardByName({ cardName: 'Unknown Card', cards, packs });
        expect(card).toBeUndefined();
    });

    test('returns the matching card', () => {
        const card = lookupCardByName({ cardName: 'Unique Card', cards, packs });
        expect(card).toBe(uniqueCard);
    });

    test('returns the matching card regardless of case', () => {
        const card = lookupCardByName({ cardName: 'UnIqUe CaRd', cards, packs });
        expect(card).toBe(uniqueCard);
    });

    test('strips out the bracket indicators from ThronesDB', () => {
        let cardWithIndicator = lookupCardByName({ cardName: 'Unique Card [B]', cards, packs });
        let cardWithMultipleIndicators = lookupCardByName({ cardName: 'Unique Card [B] [M] [J] [P4]', cards, packs });
        let cardWithPackAndIndicator = lookupCardByName({ cardName: 'Unique Card (Pack 1) [P8]', cards, packs });

        expect(cardWithIndicator).toBe(uniqueCard);
        expect(cardWithMultipleIndicators).toBe(uniqueCard);
        expect(cardWithPackAndIndicator).toBe(uniqueCard);
    });

    describe('when there are multiple copies of a card', () => {
        test('returns the earliest one by release data', () => {
            const card = lookupCardByName({ cardName: 'Duplicate Card', cards, packs });
            expect(card).toBe(originalVersionWithName);
        });

        test('returns the specific version when pack name is specified', () => {
            const card = lookupCardByName({ cardName: 'Duplicate Card  (Pack 2)', cards, packs });
            expect(card).toBe(newVersionWithName);
        });

        test('returns the specific version when pack code is specified', () => {
            const card = lookupCardByName({ cardName: 'Duplicate Card  (P2)', cards, packs });
            expect(card).toBe(newVersionWithName);
        });

        test('returns the earliest version if a pack name is specified that does not exist', () => {
            const card = lookupCardByName({ cardName: 'Duplicate Card (P123)', cards, packs });
            expect(card).toBe(originalVersionWithName);
        });
    });
});
