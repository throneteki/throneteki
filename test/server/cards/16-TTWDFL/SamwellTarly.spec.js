describe('Samwell Tarly (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Samwell Tarly (TTWDFL)'],
                hand: ['Castle Guard'],
                drawDeck: ['Hedge Knight', 'Winterfell Steward', 'The Roseroad', 'The Kingsroad']
            }
        });
        this.player1.clickMenu(this.samwellTarly, 'Look at top 4 cards');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it('kneels to switch one of the top 4 cards of your deck with a card in your hand', function () {
        expect(this.samwellTarly.kneeled).toBe(true);
        expect(this.theRoseroad.location).toBe('hand');
        expect(this.castleGuard.location).toBe('draw deck');
        expect(this.player1Object.drawDeck.slice(0, 4)).toContain(this.castleGuard);
        expect(this.player1).isReadyToTakeAction();
    });
});
