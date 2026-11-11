describe('Ser Jaime Lannister (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Ser Jaime Lannister (BtB)', kneeling: true }],
                shadows: ['Ser Andrey Dalt']
            }
        });

        this.player1.clickCard(this.serAndreyDalt);
    });

    it('stands after a character enters play during the challenges phase, then discards that character', function () {
        expect(this.serJaimeLannister.kneeled).toBe(false);
        expect(this.serAndreyDalt.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
