describe('The Black Cells', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { shadows: ['The Black Cells'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)', 'Burned Men'] }
        });
        this.player1.clickCard(this.theBlackCells);
        this.player1.triggerAbility(this.theBlackCells);
    });

    it('stops a character that must kneel to attack being declared', function () {
        this.player1.clickCard(this.burnedMen);
        this.player2.clickPrompt('Military');

        expect(this.player2).not.toBeAbleToSelect(this.burnedMen);
        expect(this.player2).toBeAbleToSelect(this.serJaimeLannister);
        expect(this.theBlackCells.kneeled).toBe(true);
    });

    it('still allows a character that does not kneel to attack to be declared', function () {
        this.player1.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Military');

        expect(this.player2).toBeAbleToSelect(this.serJaimeLannister);
        expect(this.player2).toBeAbleToSelect(this.burnedMen);

        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.serJaimeLannister.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
