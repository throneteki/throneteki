describe('Brimstone', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Brimstone', 'Obara Sand (Core)'], gold: 0 }
        });
        expect(this.obaraSand.getStrength()).toBe(4);
        this.player1.clickCard(this.brimstone);
        this.player1.clickCard(this.obaraSand);
    });

    it('gives each Sand Snake you control +1 STR, and kneels and returns a Sand Snake to your hand to gain 1 gold', function () {
        expect(this.obaraSand.location).toBe('hand');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
