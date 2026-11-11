describe('For the North!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Winterfell Steward', 'Bear Island Loyalist'],
                hand: ['For the North!'],
                drawDeck: ['Hedge Knight']
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.bearIslandLoyalist);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.forTheNorth);
        this.player1.clickCard(this.bearIslandLoyalist);
    });

    it('gives a participating stark character +2 STR, and draws 1 card if you win the challenge', function () {
        expect(this.bearIslandLoyalist.getStrength()).toBe(
            this.bearIslandLoyalist.getPrintedStrength() + 2
        );
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.hedgeKnight.location).toBe('hand');
    });
});
