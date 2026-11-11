describe('Oldtown Undercity', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Oldtown Undercity'],
                shadows: ['Nighttime Marauders (R)'],
                drawDeck: ['Hedge Knight', 'Castle Guard', 'The Roseroad'],
                gold: 5
            }
        });
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.triggerAbility('Oldtown Undercity');
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickCard(this.hedgeKnight);
    });

    it('looks at the top 3 cards after a card comes out of shadows, adding 1 to hand, 1 to the bottom and 1 to the top', function () {
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player1Object.drawDeck[0]).toBe(this.theRoseroad);
        expect(this.player1Object.drawDeck[this.player1Object.drawDeck.length - 1]).toBe(
            this.hedgeKnight
        );
    });
});
