describe('No Crown but Truth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Maester Luwin'],
                hand: ['No Crown but Truth'],
                drawDeck: ['Hedge Knight']
            },
            player2: { inPlay: ['Lannisport Merchant'] }
        });
        this.player2.clickCard(this.lannisportMerchant);
        this.player1.triggerAbility('No Crown but Truth');
        this.player1.clickCard(this.maesterLuwin);
    });

    it("kills a Maester to cancel an opponent's triggered character ability and draw 1 card", function () {
        expect(this.maesterLuwin.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
