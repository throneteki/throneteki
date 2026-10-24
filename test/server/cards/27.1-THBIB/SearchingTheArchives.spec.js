describe('Searching the Archives', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                agenda: 'Fealty',
                plotDeck: ['Searching the Archives'],
                hand: ['Hedge Knight', 'Castle Guard'],
                drawDeck: [
                    'Winterfell Steward',
                    'Lannisport Merchant',
                    'Garden Caretaker',
                    'Desert Scavenger'
                ]
            }
        });
        this.player1.selectPlot('Searching the Archives');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it('places chosen cards facedown under your agenda, then draws that many cards', function () {
        expect(this.hedgeKnight.location).toBe('underneath');
        expect(this.castleGuard.location).toBe('underneath');
        expect(this.player1Object.hand.length).toBe(2 + 2);
    });
});
