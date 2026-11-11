describe('Hollow Hill', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                inPlay: ['Hollow Hill'],
                hand: ['Khal Drogo (Core)'],
                gold: 6
            }
        });
        this.player1.clickCard(this.khalDrogo);
        this.player1.triggerAbility(this.hollowHill);
    });

    it('draws 1 card after you marshal a character whose faction matches no other card you control', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
