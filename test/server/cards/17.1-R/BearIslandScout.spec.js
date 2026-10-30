describe('Bear Island Scout (R)', function () {
    describe('when you marshal it and each character you control is [stark]', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Bear Island Scout (R)'],
                    inPlay: ['Tumblestone Knight'],
                    drawDeck: [
                        'Hedge Knight',
                        'Dacey Mormont',
                        ...Array(8).fill('House Maester'),
                        'Maege Mormont'
                    ]
                }
            });

            this.player1.clickCard(this.bearIslandScout);
            this.player1.triggerAbility(this.bearIslandScout);
        });

        it('can choose a House Mormont card in the top 10 cards of your deck', function () {
            expect(this.player1).toBeAbleToSelect(this.daceyMormont);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.maegeMormont);

            this.player1.clickCard(this.daceyMormont);

            expect(this.player1).isReadyToTakeAction();
        });

        it('adds the card to your hand', function () {
            this.player1.clickCard(this.daceyMormont);

            expect(this.daceyMormont.location).toBe('hand');
            expect(this.maegeMormont.location).toBe('draw deck');
            expect(this.hedgeKnight.location).toBe('draw deck');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Bear Island Scout to search the top 10 cards of their deck for a House Mormont card'
            );
            expect(this.game.getPlainTextLog()).toContain(
                'player1 adds Dacey Mormont to their hand'
            );
            expect(this.game.getPlainTextLog()).toContain('player1 shuffles their deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you control a non-[stark] character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Bear Island Scout (R)'],
                    inPlay: ['Hedge Knight'],
                    drawDeck: ['Dacey Mormont']
                }
            });

            this.player1.clickCard(this.bearIslandScout);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.bearIslandScout);
            expect(this.daceyMormont.location).toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
