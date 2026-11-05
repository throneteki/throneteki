describe('The Dreadfort', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'The Dreadfort',
                    'Wildling Scout',
                    { card: 'Khal Drogo (Core)', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.wildlingScout);
        this.player1.triggerAbility(this.theDreadfort);
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickCard(this.khalDrogo);
    });

    it('kneels to stand a House Bolton or non-stark character after a character you control is sacrificed', function () {
        expect(this.theDreadfort.kneeled).toBe(true);
        expect(this.khalDrogo.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
