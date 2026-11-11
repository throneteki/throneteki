describe('Arnolf Karstark', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Arnolf Karstark', kneeling: true }, 'The Kingsroad']
            }
        });

        this.player1.clickCard(this.theKingsroad);
    });

    it('stands after a character or location is sacrificed', function () {
        this.player1.triggerAbility(this.arnolfKarstark);

        expect(this.arnolfKarstark.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
