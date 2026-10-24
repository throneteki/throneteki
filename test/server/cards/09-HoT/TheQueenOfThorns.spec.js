describe('The Queen of Thorns (HoT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Queen of Thorns (HoT)'],
                hand: ['Nightmares'],
                drawDeck: ['Tithe']
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.theQueenOfThorns);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.theQueenOfThorns);
        this.player1.clickCard(this.nightmares);
    });

    it('discards an event from your hand to search your deck for an event after she is knelt', function () {
        expect(this.nightmares.location).toBe('discard pile');

        this.player1.clickCard(this.tithe);

        expect(this.tithe.location).toBe('hand');

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
