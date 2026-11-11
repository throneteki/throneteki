describe('Wildfire Assault', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Wildfire Assault'],
                inPlay: [
                    'Hedge Knight',
                    'Castle Guard',
                    'Winterfell Steward',
                    'Steward at the Wall'
                ]
            },
            player2: { inPlay: ['Garden Caretaker', 'Lannisport Merchant'] }
        });
        this.player1.selectPlot('Wildfire Assault');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.gardenCaretaker);
        this.player2.clickPrompt('Done');
    });

    it('kills each character a player did not choose, and they cannot be saved', function () {
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.castleGuard.location).toBe('play area');
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.stewardAtTheWall.location).toBe('dead pile');
        expect(this.gardenCaretaker.location).toBe('play area');
        expect(this.lannisportMerchant.location).toBe('dead pile');
    });
});
