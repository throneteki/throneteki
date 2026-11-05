describe('Taena Merryweather (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Taena Merryweather (R)'],
                hand: ['Confinement', 'Burned Men'],
                drawDeck: ['Hot Pie (FFH)'],
                gold: 1
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickCard(this.confinement);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.taenaMerryweather);
        this.player1.clickCard(this.burnedMen);
    });

    it('discards a card from your hand to draw 1 card after you play an event', function () {
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.hotPie.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
