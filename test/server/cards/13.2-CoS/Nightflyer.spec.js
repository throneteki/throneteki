describe('Nightflyer (CoS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Nightflyer (CoS)'], gold: 2 },
            player2: { inPlay: ['Sunspear (Core)', 'The Roseroad'] }
        });
        this.player1.clickCard(this.nightflyer);
        this.player1.selectValue(2);
        this.player1.triggerAbility('Nightflyer');
        this.player1.clickCard(this.theRoseroad);
    });

    it('discards a location with printed cost X or lower after it comes out of shadows', function () {
        expect(this.nightflyer.location).toBe('play area');
        expect(this.theRoseroad.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
