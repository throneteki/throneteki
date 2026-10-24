describe("Renly's Pavilion", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'tyrell',
                inPlay: ["Renly's Pavilion", 'Tumblestone Knight', 'Winterfell Steward']
            }
        });
        this.player1.clickCard(this.renlysPavilion);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.winterfellSteward);
    });

    it('kneels to give one character -1 STR and another +1 STR until the end of the phase', function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);
        expect(this.winterfellSteward.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
