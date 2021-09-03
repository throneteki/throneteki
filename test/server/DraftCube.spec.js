const DraftingCube = require('../../server/DraftCube');

describe('DraftCube', function() {
    beforeEach(function() {
        this.rarities = [
            { name: 'Rare', numPerPack: 1, cards: ['rare-1', 'rare-2'] },
            { name: 'Uncommon', numPerPack: 2, cards: ['uncommon-1', 'uncommon-2', 'uncommon-3', 'uncommon-4'] },
            { name: 'Common', numPerPack: 3, cards: ['common-1', 'common-2', 'common-3', 'common-4', 'common-5', 'common-6'] }
        ];
        this.cube = new DraftingCube({ _id: 'cube-id', name: 'Event Cube 2021', rarities: this.rarities });
    });

    describe('generatePacks', function() {
        beforeEach(function() {
            this.packs = this.cube.generatePacks();
        });

        it('generates the correct number of packs', function() {
            expect(this.packs.length).toEqual(2);
        });

        it('contains the correct number of card rarities in each pack', function() {
            for(const pack of this.packs) {
                expect(pack.filter(card => card.startsWith('rare')).length).toEqual(1);
                expect(pack.filter(card => card.startsWith('uncommon')).length).toEqual(2);
                expect(pack.filter(card => card.startsWith('common')).length).toEqual(3);
            }
        });

        it('does not contain any re-used cards', function() {
            const allCards = this.packs.reduce((allCards, cards) => allCards.concat(cards), []);
            expect(allCards).toEqual(jasmine.arrayWithExactContents([
                'rare-1', 'rare-2',
                'uncommon-1', 'uncommon-2', 'uncommon-3', 'uncommon-4',
                'common-1', 'common-2', 'common-3', 'common-4', 'common-5', 'common-6'
            ]));
        });
    });
});
