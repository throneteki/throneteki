describe('The Fire That Burns', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                plot: 'The Fire That Burns',
                inPlay: ['Sworn Brother']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.swornBrother);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('stops each [thenightswatch] character you control kneeling when declared as a defender', function () {
        expect(this.swornBrother.kneeled).toBe(false);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
