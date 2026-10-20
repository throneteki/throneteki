describe('Blessed by the Maiden', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'tyrell',
                    hand: ['Blessed by the Maiden'],
                    inPlay: ['House Maester']
                },
                player2: {
                    inPlay: ['Hedge Knight']
                }
            });

            this.player1.clickCard(this.blessedByTheMaiden);
        });

        it('can only be attached to a character you control', function () {
            expect(this.player1).toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.attachments).toContain(this.blessedByTheMaiden);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while attached', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'tyrell',
                    hand: ['Little Bird (Core)'],
                    inPlay: [
                        { card: 'House Maester', attachments: ['Blessed by the Maiden'] },
                        'Hedge Knight'
                    ]
                }
            });

            this.player1.clickCard(this.littleBird);
        });

        it('gives the character The Seven trait and "No attachments except Blessing."', function () {
            expect(this.houseMaester.hasTrait('The Seven')).toBe(true);
            expect(this.hedgeKnight.hasTrait('The Seven')).toBe(false);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);

            this.player1.clickCard(this.hedgeKnight);

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
