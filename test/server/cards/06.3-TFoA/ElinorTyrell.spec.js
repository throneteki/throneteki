describe('Elinor Tyrell', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Elinor Tyrell'],
                hand: ['Lannisport Moneylender', 'The Kingsroad']
            }
        });
    });

    it('lets you marshal 1 additional limited card each round', function () {
        this.player1.clickCard(this.lannisportMoneylender);
        this.player1.clickCard(this.theKingsroad);

        expect(this.lannisportMoneylender.location).toBe('play area');
        expect(this.theKingsroad.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
