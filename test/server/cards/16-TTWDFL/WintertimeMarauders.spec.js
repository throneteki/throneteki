describe('Wintertime Marauders', function () {
    describe('while more Summer than Winter plots are revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    plot: 'Summer Harvest',
                    inPlay: ['Wintertime Marauders', 'Tumblestone Knight']
                }
            });

            this.player1.clickPrompt('Military');
        });

        it('cannot be declared as an attacker', function () {
            expect(this.player1).not.toBeAbleToSelect(this.wintertimeMarauders);

            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while more Winter than Summer plots are revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'The Winds of Winter', inPlay: ['Wintertime Marauders'] },
                player2: { inPlay: ['Tumblestone Knight', 'Ser Jaime Lannister (Core)'] }
            });

            this.unopposedChallenge(this.player1, 'Power', this.wintertimeMarauders);
            this.player1.triggerAbility(this.wintertimeMarauders);
        });

        it('discards a non-unique card from play after a challenge it wins', function () {
            expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
