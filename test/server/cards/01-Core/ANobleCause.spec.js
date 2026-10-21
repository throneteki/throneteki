describe('A Noble Cause', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'A Noble Cause',
                hand: ['Bran Stark (Core)', 'Joffrey Baratheon (Core)']
            }
        });
    });

    it('reduces the cost of the first Lord or Lady character you marshal this round by 2', function () {
        this.player1.clickCard(this.branStark);

        expect(this.branStark.location).toBe('play area');
        expect(this.player1Object.gold).toBe(5);

        this.player1.clickCard(this.joffreyBaratheon);

        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
