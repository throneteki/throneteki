describe('Nightflyer (R2)', function () {
    it('discards a non-limited location with printed cost X or lower after it comes out of shadows', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Nightflyer (R2)'], gold: 2 },
            player2: { inPlay: ['Casterly Rock (Core)', 'The Roseroad'] }
        });
        this.player1.clickCard(this.nightflyer);
        this.player1.selectValue(2);
        this.player1.triggerAbility('Nightflyer');
        expect(this.player1).not.toAllowSelect(this.theRoseroad);
        this.player1.clickCard(this.casterlyRock);
        expect(this.nightflyer.location).toBe('play area');
        expect(this.casterlyRock.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can come out of shadows with X of 0', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['The Kingsroad'], shadows: ['Nightflyer (R2)'], gold: 0 }
        });
        this.player1.clickCard(this.nightflyer);
        expect(this.nightflyer.location).toBe('play area');
    });

    it('can come out of shadows after Assault from the Shadows places it there', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { agenda: 'Assault from the Shadows', hand: ['Nightflyer (R2)'] }
        });
        this.player1.clickMenu(this.assaultFromTheShadows, 'Put card into shadows');
        this.player1.clickCard(this.nightflyer);
        this.player1.clickCard(this.nightflyer);
        expect(this.nightflyer.location).toBe('play area');
    });
});
