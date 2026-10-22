describe('Varys (DitD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Varys (DitD)', 'Catspaw'], gold: 7 },
            player2: { inPlay: [{ card: 'Khal Drogo (Core)', power: 1 }] }
        });
        this.player1.clickCard(this.varys);
        this.player1.triggerAbility(this.varys);
        this.player1.clickCard(this.khalDrogo);
    });

    it('costs 1 less to bring out of shadows for each other card in shadows, and kills a character with power after he comes out of shadows', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.khalDrogo.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
