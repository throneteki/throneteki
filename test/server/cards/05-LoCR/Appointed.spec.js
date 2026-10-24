describe('Appointed', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Appointed'],
                inPlay: ['Khal Drogo (Core)', 'Tumblestone Knight']
            }
        });

        this.player1.clickCard(this.appointed);
    });

    it('can only be attached to a unique character, which gains an [intrigue] icon and the Small Council trait', function () {
        expect(this.player1).toBeAbleToSelect(this.khalDrogo);
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.khalDrogo);

        expect(this.khalDrogo.hasIcon('intrigue')).toBe(true);
        expect(this.khalDrogo.hasTrait('Small Council')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
