describe('Longclaw', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Longclaw'],
                inPlay: ['Steward at the Wall', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.longclaw);
    });

    it('can only be attached to a [thenightswatch] character, and gives it +1 STR and renown', function () {
        expect(this.player1).toBeAbleToSelect(this.stewardAtTheWall);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.stewardAtTheWall);

        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.getStrength()).toBe(2);
        expect(this.stewardAtTheWall.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
