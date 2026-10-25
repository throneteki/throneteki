describe('Hidden in Shadow', function () {
    describe('when sacrificed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: [{ card: 'Tumblestone Knight', attachments: ['Hidden in Shadow'] }]
                }
            });

            this.player1.clickCard(this.hiddenInShadow);
        });

        it('places the attached character in shadows', function () {
            expect(this.tumblestoneKnight.location).toBe('shadows');
            expect(this.hiddenInShadow.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when discarded from shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    shadows: ['Hidden in Shadow', 'Shadow Politics'],
                    gold: 1
                }
            });

            this.player1.clickCard(this.shadowPolitics);
            this.player1.clickPrompt('Discard a card from shadows');
            this.player1.clickCard(this.hiddenInShadow);
            this.player1.triggerAbility(this.hiddenInShadow);
        });

        it('draws 1 card', function () {
            expect(this.hiddenInShadow.location).toBe('discard pile');
            expect(this.player1Object.hand).toHaveLength(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
