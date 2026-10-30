describe('High Ground', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'High Ground',
                    { card: 'Free Brothers (ATT)', kneeling: true },
                    { card: 'Tumblestone Knight', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.highGround);
    });

    it('kneels to stand an Army character', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.freeBrothers);

        expect(this.freeBrothers.kneeled).toBe(false);
        expect(this.highGround.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
