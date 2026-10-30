describe('River Gate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['River Gate', 'Hedge Knight', 'Steward at the Wall'],
                drawDeck: ['Castle Guard', 'Winterfell Steward']
            },
            player2: { inPlay: ['Black Walder', 'Genna Frey'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.blackWalder);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.gennaFrey);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickMenu(this.riverGate, 'Sacrifice to draw 2 cards');
    });

    it('sacrifices itself to draw 2 cards after losing 2 challenges', function () {
        expect(this.riverGate.location).toBe('discard pile');
        expect(this.castleGuard.location).toBe('hand');
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
