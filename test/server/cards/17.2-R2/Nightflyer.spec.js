describe('Nightflyer (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Nightflyer (R2)'], gold: 2 },
            player2: { inPlay: ['Casterly Rock (Core)', 'The Roseroad'] }
        });
        this.player1.clickCard(this.nightflyer);
        this.player1.selectValue(2);
        this.player1.triggerAbility('Nightflyer');
        this.player1.clickCard(this.casterlyRock);
    });

    it('discards a non-limited location with printed cost X or lower after it comes out of shadows', function () {
        expect(this.nightflyer.location).toBe('play area');
        expect(this.casterlyRock.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
