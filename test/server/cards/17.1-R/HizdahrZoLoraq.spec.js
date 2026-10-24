describe('Hizdahr zo Loraq (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Hizdahr zo Loraq (R)'],
                hand: ['Khal Drogo (Core)', 'Burned Men'],
                gold: 3
            }
        });
        this.player1.clickCard(this.hizdahrZoLoraq);
        this.player1.clickCard(this.burnedMen);
    });

    it('discards a character from your hand to reduce the cost of the next card you marshal this phase by 3', function () {
        this.player1.clickCard(this.khalDrogo);

        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.khalDrogo.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
