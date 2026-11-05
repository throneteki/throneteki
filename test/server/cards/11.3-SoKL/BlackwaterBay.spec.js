describe('Blackwater Bay', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Blackwater Bay'] },
            player2: {
                inPlay: [{ card: 'Khal Drogo (Core)', kneeling: true }, 'Tumblestone Knight']
            }
        });
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.blackwaterBay);
    });

    it('kneels to draw 1 card for each kneeling character an opponent controls after the challenges phase begins', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
