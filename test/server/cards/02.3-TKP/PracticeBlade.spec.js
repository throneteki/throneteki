describe('Practice Blade', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Practice Blade'],
                inPlay: ['Steward at the Wall', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.practiceBlade);
    });

    it('can only be attached to a [thenightswatch] character, which gets +1 STR and a [military] icon', function () {
        expect(this.player1).toBeAbleToSelect(this.stewardAtTheWall);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.getStrength()).toBe(2);
        expect(this.stewardAtTheWall.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
