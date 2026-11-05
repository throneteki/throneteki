describe('Uneasy Truce', function () {
    describe('outside of challenges', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { plotDeck: ['Uneasy Truce'], inPlay: ['Jon Arryn (AHaH)'] },
                player2: { plotDeck: ['Valar Morghulis'] }
            });
            this.player1.selectPlot('Uneasy Truce');
            this.player2.selectPlot('Valar Morghulis');
            this.selectFirstPlayer(this.player1);
        });

        it('stops players gaining power for their faction, even through a multiple-choice ability', function () {
            expect(this.player1).toHaveDisabledPromptButton('Gain 1 power');
        });
    });

    describe('after a challenge is initiated', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'Uneasy Truce', inPlay: ['Hedge Knight'], power: 2 }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
        });

        it("moves 1 power from the attacking player's faction to the defending player's faction", function () {
            expect(this.player1Object.faction.power).toBe(1);
            expect(this.player2Object.faction.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
